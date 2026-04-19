"use client";

import Link from "next/link";
import styles from "./Sidebar.module.css";
import LogoutButton from "../ui/LogoutButton/LogoutButton";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Dashboard</h2>

      <nav className={styles.nav}>
        <Link href="/dashboard">Inicio</Link>
        <Link href="/dashboard/whatsapp">WhatsApp</Link>
      </nav>

      <div className={styles.footer}>
        <LogoutButton />
      </div>
    </aside>
  );
}
