"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./SessionPanel.module.css";
import {
  createWhatsappSession,
  deleteSessionById,
} from "@/app/actions/Session";
import { getSessionStatus } from "@/app/actions/Status";
import { useActiveSession } from "@/hooks/useActiveSession";
import Spinner from "../../ui/Spinner/Spinner";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import { Icon } from "../../ui/Icon/Icon";
import SuccessView from "./SuccessView";
import SimpleMessageForm from "./SimpleMessageForm";
import TemplateMessageForm from "./TemplateMessageForm";
import BulkSendForm from "../BulkSend/BulkSendForm";
import { Template } from "@/interfaces/Template.interface";

type PanelView =
  | 'idle'
  | 'creatingSession'
  | 'waitingQR'
  | 'showingQR'
  | 'checkingStatus'
  | 'success'
  | 'sendingSimple'
  | 'sendingTemplate'
  | 'sendingBulk';

interface SessionPanelProps {
  onSessionCreated?: () => void;
  templates?: Template[];
}

export default function SessionPanel({ onSessionCreated, templates = [] }: SessionPanelProps) {
  const [view, setView] = useState<PanelView>('idle');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [sessionIdInput, setSessionIdInput] = useState('');
  const [closeError, setCloseError] = useState('');
  const [closingSession, setClosingSession] = useState(false);
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { activeSessionId, saveActiveSession, clearActiveSession } = useActiveSession();

  // Al montar: verificar si hay sesión activa en localStorage
  useEffect(() => {
    if (!activeSessionId) return;
    setView('checkingStatus');
    setCurrentSessionId(activeSessionId);
    getSessionStatus(activeSessionId).then((data) => {
      if (data.isReady) {
        setView('success');
      } else if (data.qrBase64) {
        setQrCode(data.qrBase64);
        setView('showingQR');
      } else {
        clearActiveSession();
        setCurrentSessionId(null);
        setView('idle');
      }
    }).catch(() => {
      clearActiveSession();
      setCurrentSessionId(null);
      setView('idle');
    });
  }, []); // solo al montar

  // Polling para obtener el QR (waitingQR)
  useEffect(() => {
    if (view !== 'waitingQR' || !currentSessionId) return;

    let attempts = 0;
    const MAX_ATTEMPTS = 40; // ~20 segundos a 500ms

    const interval = setInterval(async () => {
      attempts++;
      try {
        const data = await getSessionStatus(currentSessionId);

        if (data.qrBase64) {
          setQrCode(data.qrBase64);
          setView('showingQR');
          clearInterval(interval);
          return;
        }

        if (attempts >= MAX_ATTEMPTS) {
          setError("El QR no estuvo disponible a tiempo");
          await deleteSessionById(currentSessionId).catch(() => {});
          clearActiveSession();
          setCurrentSessionId(null);
          setView('idle');
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Error checking QR status:", err);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [view, currentSessionId]);

  // Polling de autenticación (showingQR)
  useEffect(() => {
    if (view !== 'showingQR' || !currentSessionId) return;

    const TIMEOUT_MS = 120_000;
    let timedOut = false;

    const timeout = setTimeout(async () => {
      timedOut = true;
      setError("El tiempo para escanear el QR ha expirado");
      await deleteSessionById(currentSessionId).catch(() => {});
      clearActiveSession();
      setCurrentSessionId(null);
      setQrCode(null);
      setView('idle');
    }, TIMEOUT_MS);

    const interval = setInterval(async () => {
      if (timedOut) return;
      try {
        const data = await getSessionStatus(currentSessionId);
        if (data.isReady) {
          clearTimeout(timeout);
          clearInterval(interval);
          setView('success');
        }
      } catch (err) {
        console.error("Error polling auth status:", err);
      }
    }, 1000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [view, currentSessionId]);

  const validatePhoneNumber = (phone: string): string => {
    const trimmed = phone.trim();
    if (!trimmed) return "Por favor ingresa un número de teléfono";
    if (!/^\d{10,15}$/.test(trimmed)) {
      return "Formato inválido. Usa: código de país + código de área + número (ej: 549111234567)";
    }
    return "";
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setQrCode(null);
    setTouched(true);

    const validationError = validatePhoneNumber(sessionIdInput);
    if (validationError) {
      setError(validationError);
      inputRef.current?.focus();
      return;
    }

    setError("");
    setView('creatingSession');
    try {
      const result = await createWhatsappSession(sessionIdInput.trim());
      if (result.success) {
        const sid = sessionIdInput.trim();
        saveActiveSession(sid);
        setCurrentSessionId(sid);
        setSessionIdInput("");
        setView('waitingQR');
        if (onSessionCreated) onSessionCreated();
      }
    } catch (err: any) {
      setError(err.message || "Error al crear la sesión");
      setView('idle');
    }
  };

  const handleCancelSession = async () => {
    if (!currentSessionId) return;
    if (!confirm("¿Estás seguro de cancelar esta sesión?")) return;
    try {
      await deleteSessionById(currentSessionId);
      clearActiveSession();
      setQrCode(null);
      setCurrentSessionId(null);
      setView('idle');
      if (onSessionCreated) onSessionCreated();
    } catch (err: any) {
      setError(err.message || "Error al cancelar la sesión");
    }
  };

  const handleCloseSession = async () => {
    if (!currentSessionId) return;
    setClosingSession(true);
    setCloseError('');
    try {
      await deleteSessionById(currentSessionId);
      clearActiveSession();
      setCurrentSessionId(null);
      setQrCode(null);
      setView('idle');
      if (onSessionCreated) onSessionCreated();
    } catch (err: any) {
      setCloseError("Error al cerrar la sesión. Intenta de nuevo.");
    } finally {
      setClosingSession(false);
    }
  };

  const isSpinner = view === 'creatingSession' || view === 'waitingQR' || view === 'checkingStatus';

  return (
    <div className={styles.panel}>
      {view !== 'success' && view !== 'sendingSimple' && view !== 'sendingTemplate' && view !== 'sendingBulk' && (
        <h2 className={styles.title}>Nueva Sesión</h2>
      )}

      {/* Vista idle: formulario de creación */}
      {view === 'idle' && (
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
              value={sessionIdInput}
              onChange={(e) => {
                setSessionIdInput(e.target.value);
                if (touched) setError(validatePhoneNumber(e.target.value));
              }}
              placeholder="549111234567"
              helperText="Formato: código de país + código de área + número (sin espacios ni guiones)"
              errorMessage={error || undefined}
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              className={styles.submitButton}
            >
              <Icon name="Plus" size={16} aria-hidden="true" />
              Crear Sesión
            </Button>
          </form>
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
        </div>
      )}

      {/* Spinner: creatingSession, waitingQR, checkingStatus */}
      {isSpinner && (
        <div className={styles.section}>
          <div className={styles.spinnerSection}>
            <Spinner size="md" label="Generando código QR..." />
            <p className={styles.spinnerLabel}>
              {view === 'checkingStatus' ? 'Verificando sesión...' : 'Generando código QR...'}
            </p>
            <p className={styles.spinnerHint}>Esto puede tomar unos segundos</p>
            {view !== 'checkingStatus' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelSession}
                className={styles.cancelLink}
              >
                <Icon name="X" size={16} aria-hidden="true" />
                Cancelar
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Vista showingQR */}
      {view === 'showingQR' && qrCode && (
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

      {/* Vista success, sendingSimple, sendingTemplate, sendingBulk */}
      {view === 'success' && (
        <SuccessView
          sessionId={currentSessionId!}
          onSendSimple={() => setView('sendingSimple')}
          onSendTemplate={() => setView('sendingTemplate')}
          onSendBulk={() => setView('sendingBulk')}
          onCloseSession={handleCloseSession}
          closingSession={closingSession}
          closeError={closeError}
        />
      )}
      {view === 'sendingSimple' && (
        <SimpleMessageForm
          sessionId={currentSessionId!}
          onBack={() => setView('success')}
        />
      )}
      {view === 'sendingTemplate' && (
        <TemplateMessageForm
          sessionId={currentSessionId!}
          onBack={() => setView('success')}
        />
      )}
      {view === 'sendingBulk' && (
        <BulkSendForm
          sessionId={currentSessionId!}
          templates={templates}
          onBack={() => setView('success')}
        />
      )}

      {/* Error global */}
      {error && view === 'idle' && (
        <p className={styles.globalError}>
          {error}
        </p>
      )}
    </div>
  );
}
