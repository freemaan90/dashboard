"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Roles } from "@/enum/Roles";
import { getBillingStatus, getPlans, getInvoices } from "@/app/actions/Billing";
import { BillingPage } from "@/components/Billing/BillingPage";

export default async function BillingRoute() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("No hay sesión activa");
  }

  if (session.user.role !== Roles.OWNER) {
    redirect("/dashboard");
  }

  const [billingStatus, plans, invoices] = await Promise.all([
    getBillingStatus(),
    getPlans(),
    getInvoices(1, 10),
  ]);

  return (
    <BillingPage
      initialStatus={billingStatus}
      plans={plans}
      initialInvoices={invoices}
    />
  );
}
