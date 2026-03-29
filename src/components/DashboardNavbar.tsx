"use client";

import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function DashboardNavbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-200">
      <Link href="/dashboard" className="font-bold">
        Dashboard
      </Link>

      <LogoutButton />
    </nav>
  );
}
