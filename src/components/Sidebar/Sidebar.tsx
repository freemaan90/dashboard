"use client";

import Link from "next/link";
import styles from "./Sidebar.module.css";
import LogoutButton from "../LogoutButton";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Dashboard</h2>

      <nav className={styles.nav}>
        <Link href="/dashboard">Inicio</Link>
        <Link href="/dashboard/profile">Perfil</Link>
        <Link href="/dashboard/admin">Admin</Link>
      </nav>

      <div className={styles.footer}>
        <LogoutButton />
      </div>
    </aside>
  );
}
