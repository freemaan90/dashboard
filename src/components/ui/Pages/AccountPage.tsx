'use client';
import { UserSession } from "@/interfaces/User.interface";
import ChangePasswordButton from "../Button/ChangePasswordButton";
import styles from "@/app/dashboard/account/Account.module.css";
import EditPhone from "../Input/EditPhone";
import { LogoUpload } from "../LogoUpload/LogoUpload";

export const AccountPage = ({ user }: { user: UserSession }) => {
  const initials = [user.name?.[0], user.lastName?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase() || "U";

  return (
    <div className={styles.wrapper}>
      {/* Page header */}
      <div className={styles.titleRow}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Mi cuenta</h1>
          <p className={styles.subtitle}>Gestioná tu información personal y de empresa</p>
        </div>
      </div>

      {/* Profile card */}
      <div className={styles.card}>
        {/* Banner decorativo */}
        <div className={styles.cardBanner} aria-hidden="true" />

        {/* Avatar + nombre */}
        <div className={styles.cardHeader}>
          <LogoUpload
            userId={user.id}
            currentLogo={user.companyLogo?.startsWith("http") ? user.companyLogo : ""}
            initials={initials}
          />
          <div className={styles.avatarInfo}>
            <h2 className={styles.name}>
              {user.name} {user.lastName}
            </h2>
            <span className={styles.roleBadge}>{user.role}</span>
          </div>
        </div>

        <div className={styles.divider} />

        {/* Info grid */}
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Nombre</span>
            <span className={styles.value}>{user.name}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Apellido</span>
            <span className={styles.value}>{user.lastName}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Email</span>
            <span className={styles.value}>{user.email}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Teléfono</span>
            <EditPhone phone={user.phone} userId={user.id} />
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Empresa</span>
            <span className={styles.value}>{user.company}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Logo de empresa</span>
            <span className={styles.value}>
              Hacé clic en el avatar para cambiarlo
            </span>
          </div>
        </div>
      </div>

      {/* Sección seguridad */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h3 className={styles.sectionTitle}>Seguridad</h3>
            <p className={styles.sectionDescription}>
              Actualizá tu contraseña para mantener tu cuenta segura
            </p>
          </div>
          <ChangePasswordButton userId={user.id} />
        </div>
      </div>
    </div>
  );
};
