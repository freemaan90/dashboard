import { ReactNode } from "react";
import DashboardShell from "./DashboardShell";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  return <DashboardShell session={session}>{children}</DashboardShell>;
}
