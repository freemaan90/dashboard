"use client";

import Link from "next/link";
import styles from "./Sidebar.module.css";
import LogoutButton from "../ui/Button/LogoutButton";
import { Session } from "next-auth";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Roles } from "@/enum/Roles";

export default function Sidebar({ session }: { session: Session | null }) {
  const pathname = usePathname();
  const { user } = session || {};
  const { company = "", companyLogo = "", role = Roles.EMPLOYEE } = user || {};

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.logoWrapper}>
          <Image
            src={companyLogo}
            alt={company}
            width={48}
            height={48}
            className={styles.logo}
          />
        </div>
        <h2 className={styles.title}>{company}</h2>
      </div>

      <div className={styles.separator} />

      <nav className={styles.nav}>
        <Link
          href="/dashboard"
          className={pathname === "/dashboard" ? styles.active : ""}
        >
          Inicio
        </Link>

        <Link
          href="/dashboard/whatsapp"
          className={
            pathname.startsWith("/dashboard/whatsapp") ? styles.active : ""
          }
        >
          WhatsApp
        </Link>

        <Link
          href="/dashboard/templates"
          className={
            pathname.startsWith("/dashboard/templates") ? styles.active : ""
          }
        >
          Templates
        </Link>

        {role !== Roles.EMPLOYEE && (
          <Link
            href="/dashboard/employee"
            className={
              pathname.startsWith("/dashboard/employee") ? styles.active : ""
            }
          >
            Empleados
          </Link>
        )}

        <Link
          href="/dashboard/account"
          className={
            pathname.startsWith("/dashboard/account") ? styles.active : ""
          }
        >
          Perfil
        </Link>
      </nav>

      <div className={styles.footer}>
        <LogoutButton />
      </div>
    </aside>
  );
}
