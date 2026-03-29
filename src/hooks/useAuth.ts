"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth({ redirectTo = "/login", redirectIfFound = false } = {}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const loading = status === "loading";
  const user = session?.user;

  useEffect(() => {
    if (!loading) {
      if (!user && !redirectIfFound) {
        router.push(redirectTo);
      }

      if (user && redirectIfFound) {
        router.push("/dashboard");
      }
    }
  }, [user, loading, redirectIfFound, redirectTo, router]);

  return { user, loading };
}
