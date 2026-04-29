'use client'
import { UserSession } from "@/interfaces/User.interface";
import ChangePasswordButton from "../Button/ChangePasswordButton";
import styles from "@/app/dashboard/account/Account.module.css";
import EditPhone from "../Input/EditPhone";
export const AccountPage = ({ user }: { user: UserSession }) => {
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Mi Cuenta</h1>

          {/* Botón cambiar contraseña */}
          <ChangePasswordButton userId={user.id} />
        </div>

        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.avatar}>
              {user.companyLogo ? (
                <img src={user.companyLogo} alt="Logo" />
              ) : (
                <span>{user.name[0]}</span>
              )}
            </div>

            <div>
              <h2 className={styles.name}>
                {user.name} {user.lastName}
              </h2>
              <p className={styles.role}>{user.role}</p>
            </div>
          </div>

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
              <span className={styles.label}>Teléfono</span>

              {/* Teléfono editable */}
              <EditPhone phone={user.phone} userId={user.id} />
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>Email</span>
              <span className={styles.value}>{user.email}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>Empresa</span>
              <span className={styles.value}>{user.company}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>Logo</span>

              <span className={styles.value}>
                {user.companyLogo ? "Cargado" : "No disponible"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
