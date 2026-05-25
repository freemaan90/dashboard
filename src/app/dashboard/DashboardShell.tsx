"use client";

import { useState } from "react";
import { Session } from "next-auth";
import { Menu, X } from "lucide-react";
import Sidebar from "@/components/Sidebar/Sidebar";
import styles from "./dashboard.module.css";

export default function DashboardShell({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.container}>
      <header className={styles.mobileHeader}>
        <button
          className={styles.hamburger}
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menú"
        >
          <Menu size={22} />
        </button>
        <span className={styles.mobileTitle}>
          {session?.user?.company || "Dashboard"}
        </span>
      </header>

      {sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar
        session={session}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className={styles.main}>{children}</main>
    </div>
  );
}
