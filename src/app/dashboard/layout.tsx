import { ReactNode } from "react";
import DashboardShell from "./DashboardShell";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getBillingStatus } from "@/app/actions/Billing";
import { Roles } from "@/enum/Roles";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  let trialDaysRemaining: number | null = null;

  if (session?.user?.role === Roles.OWNER) {
    try {
      const billing = await getBillingStatus();
      if (billing?.status === "TRIAL" && typeof billing.daysRemaining === "number") {
        trialDaysRemaining = billing.daysRemaining;
      }
    } catch {
      // non-critical — banner simply won't show
    }
  }

  return (
    <DashboardShell session={session} trialDaysRemaining={trialDaysRemaining}>
      {children}
    </DashboardShell>
  );
}
