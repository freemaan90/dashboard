import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import styles from "./dashboard.module.css";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
