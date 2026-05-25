"use client";

import Link from "next/link";
import styles from "./Sidebar.module.css";
import LogoutButton from "../ui/Button/LogoutButton";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Roles } from "@/enum/Roles";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Users,
  User,
  X,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/whatsapp", label: "WhatsApp", icon: MessageSquare },
  { href: "/dashboard/templates", label: "Templates", icon: FileText },
  { href: "/dashboard/employee", label: "Empleados", icon: Users, ownerOnly: true },
  { href: "/dashboard/account", label: "Perfil", icon: User },
];

function isValidUrl(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

export default function Sidebar({
  session: serverSession,
  isOpen,
  onClose,
}: {
  session: Session | null;
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const { data: clientSession } = useSession();
  const pathname = usePathname();

  // Prefer live client session (reflects update() calls) over stale server prop
  const user = clientSession?.user ?? serverSession?.user;
  const { company = "", companyLogo = "", role = Roles.EMPLOYEE, name = "" } = user || {};

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const initials = name
    ? name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      {onClose && (
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Cerrar menú"
        >
          <X size={16} />
        </button>
      )}
      {/* Header — logo y nombre de empresa */}
      <div className={styles.header}>
        <div className={styles.logoWrapper}>
          {companyLogo && isValidUrl(companyLogo) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={companyLogo}
              alt={company}
              width={48}
              height={48}
              className={styles.logo}
            />
          ) : (
            <span className={styles.icon}>🏢</span>
          )}
        </div>
        <h2 className={styles.title}>{company || "Mi Empresa"}</h2>
      </div>

      <div className={styles.separator} />

      {/* Navegación */}
      <nav className={styles.nav} aria-label="Navegación principal">
        <p className={styles.navLabel}>Menú</p>

        {navItems.map(({ href, label, icon: Icon, exact, ownerOnly }) => {
          if (ownerOnly && role === Roles.EMPLOYEE) return null;
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={`${styles.navItem} ${active ? styles.active : ""}`}
              aria-current={active ? "page" : undefined}
              onClick={onClose}
            >
              <span className={styles.navIcon}>
                <Icon size={18} aria-hidden="true" />
              </span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer — info de usuario y logout */}
      <div className={styles.footer}>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar} aria-hidden="true">
            {initials}
          </div>
          <div className={styles.userDetails}>
            <p className={styles.userName}>{name || "Usuario"}</p>
            <p className={styles.userRole}>{role}</p>
          </div>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}
