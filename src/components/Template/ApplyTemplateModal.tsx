"use client";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import * as XLSX from "xlsx";
import { startBulkSend, getBulkSendStatus, BulkJobStatus } from "@/app/actions/Message";
import { renderTemplate, extractVariables } from "@/lib/renderTemplate";
import { Template } from "@/interfaces/Template.interface";
import Button from "../ui/Button/Button";
import { Icon } from "../ui/Icon/Icon";
import { HighlightedText } from "./HighlightedText";
import styles from "./ApplyTemplateModal.module.css";

interface Row {
  phone: string;
  [key: string]: string;
}

interface Props {
  template: Template;
  onClose: () => void;
}

export function ApplyTemplateModal({ template, onClose }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [fileError, setFileError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [jobStatus, setJobStatus] = useState<BulkJobStatus | null>(null);
  const [pollError, setPollError] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [countdown, setCountdown] = useState("");

  const variables = extractVariables(template.content);
  const requiredColumns = ["phone", ...variables.filter((v) => v !== "phone")];

  const isRunning = jobStatus && jobStatus.status !== "done";

  useEffect(() => {
    const stored = window.localStorage.getItem("whatsapp_active_session");
    setSessionId(stored);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Poll job status while active
  useEffect(() => {
    if (!jobStatus || jobStatus.status === "done") return;
    const id = setInterval(async () => {
      try {
        const status = await getBulkSendStatus(jobStatus.jobId);
        setJobStatus(status);
      } catch {
        setPollError("Error al obtener el estado del envío.");
      }
    }, 3000);
    return () => clearInterval(id);
  }, [jobStatus?.jobId, jobStatus?.status]);

  // Countdown ticker for out-of-window wait
  useEffect(() => {
    if (!jobStatus?.waitUntil) { setCountdown(""); return; }
    const tick = () => {
      const ms = new Date(jobStatus.waitUntil!).getTime() - Date.now();
      if (ms <= 0) { setCountdown(""); return; }
      const h = Math.floor(ms / 3_600_000);
      const m = Math.floor((ms % 3_600_000) / 60_000);
      const s = Math.floor((ms % 60_000) / 1_000);
      setCountdown(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [jobStatus?.waitUntil]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    setRows([]);
    setJobStatus(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const wb = XLSX.read(ev.target?.result, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json<Row>(ws, { defval: "" });

        if (data.length === 0) { setFileError("El archivo está vacío."); return; }
        if (!Object.keys(data[0]).includes("phone")) {
          setFileError('El archivo debe tener una columna llamada "phone".');
          return;
        }
        setRows(data);
      } catch {
        setFileError("No se pudo leer el archivo. Verificá que sea .xlsx, .xls o .csv.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSend = async () => {
    if (!sessionId || rows.length === 0) return;
    setSubmitting(true);
    setPollError("");

    const messages = rows
      .map((row) => {
        const phone = String(row.phone).trim();
        if (!phone) return null;
        const vars: Record<string, string> = {};
        for (const key of Object.keys(row)) vars[key] = String(row[key]);
        return { phone, message: renderTemplate(template.content, vars) };
      })
      .filter(Boolean) as { phone: string; message: string }[];

    try {
      const { jobId } = await startBulkSend(sessionId, messages, template.title);
      setJobStatus({ jobId, status: "processing", total: messages.length, done: 0, failed: [] });
    } catch (err) {
      setPollError(err instanceof Error ? err.message : "Error al iniciar el envío.");
    } finally {
      setSubmitting(false);
    }
  };

  const progressPct = jobStatus && jobStatus.total > 0
    ? Math.round((jobStatus.done / jobStatus.total) * 100)
    : 0;

  const sent = jobStatus ? jobStatus.done - jobStatus.failed.length : 0;

  return createPortal(
    <div
      className={styles.overlay}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={styles.modal} role="dialog" aria-modal="true">
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Aplicar: {template.title}</h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Cerrar"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className={styles.body}>
          {/* Template preview */}
          <div className={styles.section}>
            <p className={styles.sectionLabel}>Contenido del template</p>
            <HighlightedText content={template.content} className={styles.previewContent} />
            {variables.length > 0 && (
              <p className={styles.hint}>
                Columnas requeridas en el Excel: <strong>{requiredColumns.join(", ")}</strong>
              </p>
            )}
          </div>

          {/* No session warning */}
          {!sessionId && (
            <div className={styles.warning}>
              <Icon name="AlertCircle" size={16} />
              No hay sesión de WhatsApp activa. Iniciá una sesión en la sección de WhatsApp antes de enviar.
            </div>
          )}

          {/* Excel upload */}
          {!jobStatus && (
            <div className={styles.section}>
              <p className={styles.sectionLabel}>Archivo Excel / CSV</p>
              <div className={styles.uploadRow}>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={submitting}
                >
                  <Icon name="Upload" size={16} aria-hidden="true" />
                  Seleccionar archivo
                </Button>
                <span className={styles.hint}>
                  {rows.length > 0 ? `${rows.length} filas cargadas` : "Formatos: .xlsx, .xls, .csv"}
                </span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className={styles.fileInput}
                onChange={handleFileChange}
              />
              {fileError && <p className={styles.error}>{fileError}</p>}
            </div>
          )}

          {/* Preview table */}
          {rows.length > 0 && !jobStatus && (
            <div className={styles.section}>
              <p className={styles.sectionLabel}>Vista previa (primeras 5 filas)</p>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      {Object.keys(rows[0]).map((col) => <th key={col} className={styles.th}>{col}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 5).map((row, i) => (
                      <tr key={i}>
                        {Object.values(row).map((val, j) => <td key={j} className={styles.td}>{val}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {rows.length > 5 && <p className={styles.hint}>... y {rows.length - 5} filas más</p>}
            </div>
          )}

          {pollError && <p className={styles.error}>{pollError}</p>}

          {/* Job progress */}
          {jobStatus && (
            <>
              {jobStatus.status === "waiting" && (
                <div className={styles.waitBanner}>
                  <Icon name="AlertCircle" size={16} />
                  <span>
                    Fuera del horario de envío (08:00–20:00 hs Argentina).
                    Reanudando en <strong>{countdown}</strong>
                  </span>
                </div>
              )}

              <div className={styles.progressWrapper}>
                <div className={styles.progressBar} style={{ width: `${progressPct}%` }} />
                <span className={styles.progressText}>{progressPct}%</span>
              </div>

              <p className={styles.hint}>
                {jobStatus.status === "done"
                  ? `Completado — ${sent} enviados, ${jobStatus.failed.length} fallidos`
                  : `Enviando ${jobStatus.done} de ${jobStatus.total}…`}
              </p>

              {jobStatus.status === "done" && jobStatus.failed.length > 0 && (
                <div className={styles.results}>
                  <p className={styles.resultsSummary}>
                    <span className={styles.ok}>✓ {sent} enviados</span>
                    <span className={styles.fail}>✗ {jobStatus.failed.length} fallidos</span>
                  </p>
                  <button className={styles.toggleErrors} onClick={() => setShowErrors((v) => !v)}>
                    {showErrors ? "Ocultar errores" : "Ver errores"}
                  </button>
                  {showErrors && (
                    <ul className={styles.errorList}>
                      {jobStatus.failed.map((r, i) => (
                        <li key={i} className={styles.errorItem}>
                          <strong>{r.phone}</strong>: {r.error}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          {!jobStatus ? (
            <>
              <Button variant="ghost" size="sm" onClick={onClose} disabled={submitting}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleSend}
                disabled={submitting || rows.length === 0 || !sessionId}
                loading={submitting}
              >
                <Icon name="Send" size={16} aria-hidden="true" />
                {submitting ? "Iniciando..." : `Enviar a ${rows.length} contactos`}
              </Button>
            </>
          ) : jobStatus.status === "done" ? (
            <Button variant="outline" size="sm" onClick={onClose}>
              Cerrar
            </Button>
          ) : (
            <div className={styles.runningFooter}>
              <p className={styles.hint}>El envío continúa en el servidor aunque cierres esta ventana.</p>
              <Button variant="outline" size="sm" onClick={onClose}>
                Cerrar
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
