import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { authMe } from "../actions/User";
import styles from "./DashboardHome.module.css";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("No hay sesión activa");
  }

  const user = session.accessToken && (await authMe(session.accessToken));
  const displayUser = user || null;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  return (
    <div className={styles.container}>
      {/* Hero greeting */}
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.greeting}>{greeting()},</p>
          <h1 className={styles.name}>
            {displayUser?.name || session.user.name} 👋
          </h1>
          <p className={styles.company}>{displayUser?.company}</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Accesos rápidos</h2>
        <div className={styles.grid}>
          <Link href="/dashboard/whatsapp" className={styles.card}>
            <div className={`${styles.cardIcon} ${styles.nube}`}>💬</div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>WhatsApp</h3>
              <p className={styles.cardDescription}>
                Conectá tu cuenta y enviá mensajes
              </p>
            </div>
            <span className={styles.cardArrow}>→</span>
          </Link>

          <Link href="/dashboard/templates" className={styles.card}>
            <div className={`${styles.cardIcon} ${styles.lista}`}>📄</div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>Templates</h3>
              <p className={styles.cardDescription}>
                Creá y gestioná plantillas de mensajes
              </p>
            </div>
            <span className={styles.cardArrow}>→</span>
          </Link>

          <Link href="/dashboard/employee" className={styles.card}>
            <div className={`${styles.cardIcon} ${styles.emplpeado}`}>👥</div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>Empleados</h3>
              <p className={styles.cardDescription}>
                Administrá tu equipo y sus roles
              </p>
            </div>
            <span className={styles.cardArrow}>→</span>
          </Link>

          <Link href="/dashboard/account" className={styles.card}>
            <div className={`${styles.cardIcon} ${styles.perfil}`}>⚙️</div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>Mi perfil</h3>
              <p className={styles.cardDescription}>
                Configurá tu cuenta y preferencias
              </p>
            </div>
            <span className={styles.cardArrow}>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
