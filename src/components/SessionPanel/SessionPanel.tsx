"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./SessionPanel.module.css";
import {
  createWhatsappSession,
  deleteSessionById,
} from "@/app/actions/Session";
import Spinner from "../ui/Spinner/Spinner";
import Button from "../ui/Button/Button";
import Input from "../ui/Input/Input";
import { Icon } from "../ui/Icon/Icon";
import { getSessionStatus } from "@/app/actions/Status";

interface SessionPanelProps {
  onSessionCreated?: () => void;
}

export default function SessionPanel({ onSessionCreated }: SessionPanelProps) {
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [pollingSessionId, setPollingSessionId] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Limpiar QR al montar el componente (refresh)
  useEffect(() => {
    setQrCode(null);
    setPollingSessionId(null);
    setCurrentSessionId(null);
  }, []);

  // Polling para obtener el QR
  useEffect(() => {
    if (!pollingSessionId) return;

    let attempts = 0;
    const MAX_ATTEMPTS = 40; // ~20 segundos

    const interval = setInterval(async () => {
      attempts++;

      try {
        const data = await getSessionStatus(pollingSessionId);

        if (data.qrBase64) {
          setQrCode(data.qrBase64);
          setPollingSessionId(null);
          clearInterval(interval);
        }

        if (attempts >= MAX_ATTEMPTS) {
          setError("El QR no estuvo disponible a tiempo");
          setPollingSessionId(null);
          setLoading(false);
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Error checking QR status:", err);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [pollingSessionId]);

  const validatePhoneNumber = (phone: string): string => {
    const trimmed = phone.trim();
    if (!trimmed) {
      return "Por favor ingresa un número de teléfono";
    }
    if (!/^\d{10,15}$/.test(trimmed)) {
      return "Formato inválido. Usa: código de país + código de área + número (ej: 549111234567)";
    }
    return "";
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setQrCode(null);
    setTouched(true);

    const validationError = validatePhoneNumber(sessionId);
    if (validationError) {
      setError(validationError);
      inputRef.current?.focus();
      return;
    }

    setError("");
    setLoading(true);
    try {
      const result = await createWhatsappSession(sessionId.trim());

      if (result.success) {
        setCurrentSessionId(sessionId.trim());
        setPollingSessionId(sessionId.trim());
        setSessionId("");
        // showToast("Sesión creada correctamente", "success");

        if (onSessionCreated) {
          onSessionCreated();
        }
      }
    } catch (err: any) {
      setError(err.message || "Error al crear la sesión");
      setLoading(false);
    }
  };

  const handleCancelSession = async () => {
    if (!currentSessionId) return;

    if (!confirm("¿Estás seguro de cancelar esta sesión?")) return;

    try {
      await deleteSessionById(currentSessionId);
      setQrCode(null);
      setPollingSessionId(null);
      setCurrentSessionId(null);
      setLoading(false);

      if (onSessionCreated) {
        onSessionCreated();
      }
    } catch (err: any) {
      setError(err.message || "Error al cancelar la sesión");
    }
  };

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>Nueva Sesión</h2>
      <div>
        <p className={styles.description}>
          Conecta tu cuenta de WhatsApp ingresando tu número de teléfono. Se
          generará un código QR que deberás escanear con tu dispositivo.
        </p>

        <form onSubmit={handleCreateSession} className={styles.form}>
          <Input
            id="sessionId"
            ref={inputRef}
            label="Número de Teléfono"
            type="text"
            value={sessionId}
            onChange={(e) => {
              setSessionId(e.target.value);
              if (touched) {
                setError(validatePhoneNumber(e.target.value));
              }
            }}
            placeholder="549111234567"
            disabled={loading}
            helperText="Formato: código de país + código de área + número (sin espacios ni guiones)"
            errorMessage={error || undefined}
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            disabled={loading}
            className={styles.submitButton}
          >
            <Icon name="Plus" size={16} aria-hidden="true" />
            Crear Sesión
          </Button>
        </form>

        {loading && !qrCode && (
          <div className={styles.section}>
            <div className={styles.spinnerSection}>
              <Spinner size="md" label="Generando código QR..." />
              <p className={styles.spinnerLabel}>Generando código QR...</p>
              <p className={styles.spinnerHint}>
                Esto puede tomar unos segundos
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelSession}
                className={styles.cancelLink}
              >
                <Icon name="X" size={16} aria-hidden="true" />
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {qrCode && (
          <div className={styles.section}>
            <div className={styles.qrHeader}>
              <h3 className={styles.qrTitle}>Escanea el código QR</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelSession}
                className={styles.cancelLink}
              >
                <Icon name="X" size={16} aria-hidden="true" />
                Cancelar sesión
              </Button>
            </div>
            <div className={styles.qrWrapper}>
              <div className={styles.qrBox}>
                <img
                  src={qrCode}
                  alt="Código QR para conectar WhatsApp"
                  className={styles.qrImage}
                />
                <p className={styles.qrCaption}>
                  Abre tu aplicación y escanea este código
                </p>
              </div>
            </div>
          </div>
        )}

        {!qrCode && !loading && (
          <div className={styles.section}>
            <h3 className={styles.instructionsTitle}>Instrucciones</h3>
            <ol className={styles.instructionsList}>
              <li className={styles.instructionItem}>
                <span className={styles.instructionNumber}>1.</span>
                <span>Ingresa el número de teléfono completo</span>
              </li>
              <li className={styles.instructionItem}>
                <span className={styles.instructionNumber}>2.</span>
                <span>Haz clic en &quot;Crear Sesión&quot;</span>
              </li>
              <li className={styles.instructionItem}>
                <span className={styles.instructionNumber}>3.</span>
                <span>Escanea el código QR con tu dispositivo</span>
              </li>
              <li className={styles.instructionItem}>
                <span className={styles.instructionNumber}>4.</span>
                <span>Espera la confirmación de conexión</span>
              </li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
