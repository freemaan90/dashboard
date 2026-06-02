"use client";
import { useState } from "react";
import { UserInterface } from "@/interfaces/User.interface";
import { registerAction } from "@/app/actions/User";
import { env } from "@/config/envs";
import { redirect } from "next/navigation";

export const useUserForm = (
  initialRole: "OWNER" | "EMPLOYEE",
  accessToken?: string,
) => {
  const [form, setForm] = useState<UserInterface>({
    name: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    actualPassword: "",
    role: initialRole,
    company: "",
    companyLogo: "",
    ownerId: null,
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    if (form.password !== form.confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden");
      return false;
    }

    try {
      await registerAction({ ...form });
    } catch (err: unknown) {
      // Next.js redirect() throws with a NEXT_REDIRECT digest — let it propagate
      if (
        err &&
        typeof err === "object" &&
        "digest" in err &&
        typeof (err as { digest: unknown }).digest === "string" &&
        (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
      ) {
        throw err;
      }
      setErrorMsg(err instanceof Error ? err.message : "Error creando usuario");
      return false;
    }
    return true;
  };

  const handleEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden");
      return false;
    }

    const body = {
      ...form,
      confirmPassword: undefined,
      actualPassword: undefined,
      company: undefined,
      companyLogo: undefined,
      ownerId: undefined,
    };

    const res = await fetch(
      `${env.NEXT_PUBLIC_BACKEND_URL}/user/new-employee`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      },
    );

    // 👇 ESTO ES LO QUE FALTABA
    const text = await res.text();

    if (!res.ok) {
      try {
        const json = JSON.parse(text);
        setErrorMsg(
          Array.isArray(json.message) ? json.message.join(", ") : json.message,
        );
      } catch {
        setErrorMsg("Error desconocido");
      }
      return false;
    }
    redirect("/dashboard");
  };

  return {
    form,
    setForm,
    showPass,
    setShowPass,
    showConfirmPass,
    setShowConfirmPass,
    errorMsg,
    setErrorMsg,
    handleSubmit,
    handleEmployeeSubmit,
  };
};
