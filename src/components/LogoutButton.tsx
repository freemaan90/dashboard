"use client";

import { env } from "@/config/envs";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const handleLogout = async () => {
    await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    signOut({ redirect: true, callbackUrl: "/login" });
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  );
}
