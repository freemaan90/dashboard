import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import styles from "./dashboard.module.css";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const session = await getServerSession(authOptions);
  
  return (
    <div className={styles.container}>
      <Sidebar session={session}  />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
