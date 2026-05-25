/**
 * SuccessView — Sub-componente de SessionPanel
 * Muestra el estado de sesión activa con opciones de envío y cierre.
 * Requirements: 2.1, 2.2, 2.3, 2.4, 5.1, 5.2, 5.3
 */

import { CheckCircle } from "lucide-react";
import Button from "../../ui/Button/Button";
import { Icon } from "../../ui/Icon/Icon";
import styles from "./SuccessView.module.css";

interface SuccessViewProps {
  sessionId: string;
  onSendSimple: () => void;
  onCloseSession: () => void;
  closingSession: boolean;
  closeError: string;
}

export default function SuccessView({
  sessionId,
  onSendSimple,
  onCloseSession,
  closingSession,
  closeError,
}: SuccessViewProps) {
  return (
    <div className={styles.container}>
      {/* Ícono de éxito — Requirement 2.1 */}
      <div className={styles.iconWrapper} aria-hidden="true">
        <CheckCircle size={48} />
      </div>

      {/* Título de éxito — Requirement 2.1 */}
      <h3 className={styles.successTitle}>¡Sesión iniciada con éxito!</h3>

      {/* sessionId activo — Requirement 2.2 */}
      <div className={styles.sessionInfo}>
        <span className={styles.sessionLabel}>Sesión activa</span>
        <span className={styles.sessionId}>{sessionId}</span>
      </div>

      {/* Acciones — Requirements 2.3, 2.4, 5.1, 5.2, 5.3 */}
      <div className={styles.actions}>
        <Button
          variant="primary"
          size="md"
          onClick={onSendSimple}
          disabled={closingSession}
        >
          <Icon name="MessageSquare" size={16} aria-hidden="true" />
          Enviar mensaje simple
        </Button>

        <Button
          variant="danger"
          size="md"
          onClick={onCloseSession}
          disabled={closingSession}
          loading={closingSession}
        >
          <Icon name="LogOut" size={16} aria-hidden="true" />
          Cerrar sesión
        </Button>
      </div>

      {/* Error al cerrar sesión — Requirement 5.3 */}
      {closeError && (
        <p className={styles.closeError} role="alert">
          {closeError}
        </p>
      )}
    </div>
  );
}
