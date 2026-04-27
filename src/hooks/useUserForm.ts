"use client";
import { useState } from "react";
import { UserInterface } from "@/interfaces/User.interface";
import { registerAction } from "@/app/actions/User";
import { env } from "@/config/envs";

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
    role: initialRole,
    company: "",
    companyLogo: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    if (form.password !== form.confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden");
      return false;
    }

    await registerAction({ ...form });
    return true;
  };

  const handleEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden");
      return false;
    }

    const body = { ...form, confirmPassword: undefined, company: undefined, companyLogo: undefined, ownerId: undefined };

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
    console.log("RESPONSE BODY:", text);

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

    return true;
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
