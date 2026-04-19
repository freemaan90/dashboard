"use client";

/**
 * SimpleMessageForm — Formulario para enviar mensajes simples de WhatsApp.
 * Requisitos: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7
 */

import { useState } from "react";
import styles from "./SimpleMessageForm.module.css";
import { sendWhatsappMessage } from "@/app/actions/Message";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import { Icon } from "../../ui/Icon/Icon";

interface SimpleMessageFormProps {
  sessionId: string;
  onBack: () => void;
}

const PHONE_REGEX = /^\d{10,15}$/;

export default function SimpleMessageForm({
  sessionId,
  onBack,
}: SimpleMessageFormProps) {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const isPhoneValid = PHONE_REGEX.test(phone);
  const isMessageValid = message.trim().length > 0;
  const canSubmit = isPhoneValid && isMessageValid && !sending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSending(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      await sendWhatsappMessage({
        type: "simple",
        sessionId,
        phone,
        message,
      });
      setSuccessMsg("Mensaje enviado correctamente");
      setPhone("");
      setMessage("");
    } catch (err: any) {
      setErrorMsg(err.message || "Error al enviar el mensaje");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Enviar mensaje simple</h2>

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <Input
          id="smf-phone"
          label="Número de teléfono"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="5491112345678"
          disabled={sending}
          helperText="Código de país + código de área + número (sin espacios)"
          errorMessage={
            phone && !isPhoneValid
              ? "Formato inválido. Usa entre 10 y 15 dígitos sin espacios"
              : undefined
          }
        />

        <div className={styles.fieldRoot}>
          <label htmlFor="smf-message" className={styles.label}>
            Mensaje
          </label>
          <textarea
            id="smf-message"
            className={[
              styles.textarea,
              message && !isMessageValid ? styles.textareaError : "",
            ]
              .filter(Boolean)
              .join(" ")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe tu mensaje aquí..."
            disabled={sending}
            aria-invalid={message !== "" && !isMessageValid ? true : undefined}
            aria-describedby={
              message && !isMessageValid ? "smf-message-error" : undefined
            }
          />
          {message && !isMessageValid && (
            <p id="smf-message-error" className={styles.fieldError} role="alert">
              El mensaje no puede estar vacío
            </p>
          )}
        </div>

        {successMsg && (
          <p className={styles.successMsg} role="alert">
            {successMsg}
          </p>
        )}

        {errorMsg && (
          <p className={styles.errorMsg} role="alert">
            {errorMsg}
          </p>
        )}

        <div className={styles.actions}>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!canSubmit}
            loading={sending}
            className={styles.submitButton}
            leadingIcon={<Icon name="Send" size={16} aria-hidden="true" />}
          >
            Enviar mensaje
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={onBack}
            disabled={sending}
            className={styles.backButton}
            leadingIcon={<Icon name="ArrowLeft" size={16} aria-hidden="true" />}
          >
            Volver
          </Button>
        </div>
      </form>
    </div>
  );
}
