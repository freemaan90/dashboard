"use client";

/**
 * TemplateMessageForm — Formulario para enviar plantillas de WhatsApp.
 * Requisitos: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7
 */

import { useState } from "react";
import styles from "./TemplateMessageForm.module.css";
import { sendWhatsappMessage } from "@/app/actions/Message";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import { Icon } from "../../ui/Icon/Icon";

interface TemplateMessageFormProps {
  sessionId: string;
  onBack: () => void;
}

const PHONE_REGEX = /^\d{10,15}$/;

export default function TemplateMessageForm({
  sessionId,
  onBack,
}: TemplateMessageFormProps) {
  const [phone, setPhone] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [variables, setVariables] = useState("");
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const isPhoneValid = PHONE_REGEX.test(phone);
  const isTemplateNameValid = templateName.trim().length > 0;
  const canSubmit = isPhoneValid && isTemplateNameValid && !sending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSending(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      await sendWhatsappMessage({
        type: "template",
        sessionId,
        phone,
        templateName,
        variables: variables.trim() || undefined,
      });
      setSuccessMsg("Plantilla enviada correctamente");
      setPhone("");
      setTemplateName("");
      setVariables("");
    } catch (err: any) {
      setErrorMsg(err.message || "Error al enviar la plantilla");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Enviar plantilla</h2>

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <Input
          id="tmf-phone"
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

        <Input
          id="tmf-templateName"
          label="Nombre de la plantilla"
          type="text"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          placeholder="nombre_de_plantilla"
          disabled={sending}
          errorMessage={
            templateName && !isTemplateNameValid
              ? "El nombre de la plantilla no puede estar vacío"
              : undefined
          }
        />

        <div className={styles.fieldRoot}>
          <label htmlFor="tmf-variables" className={styles.label}>
            Variables <span className={styles.optional}>(opcional)</span>
          </label>
          <textarea
            id="tmf-variables"
            className={styles.textarea}
            value={variables}
            onChange={(e) => setVariables(e.target.value)}
            placeholder="Variable1, Variable2, ..."
            disabled={sending}
          />
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
            Enviar plantilla
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
