"use client";
import { Roles } from "@/enum/Roles";
import Input from "../Input/Input";
import styles from "./EmployeeForm.module.css";
import { useUserForm } from "@/hooks/useUserForm";
import { useEffect } from "react";

interface Props {
  company: string;
  companyLogo: string;
  id: string;
  accessToken?: string;
}

export const EmployeeForm = ({ accessToken,company, companyLogo, id }: Props) => {
  const {
    form,
    setForm,
    handleEmployeeSubmit
  } = useUserForm("EMPLOYEE", accessToken);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      company,
      companyLogo,
      ownerId: id,
    }));
  }, [company, companyLogo, id, setForm]);

  return (
    <form className={styles.form} onSubmit={handleEmployeeSubmit}>
      <Input
        label="Nombre del empleado"
        name="employeeName"
        placeholder="Ingrese el nombre del empleado"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <Input
        label="Apellido del empleado"
        name="employeeLastName"
        placeholder="Ingrese el apellido del empleado"
        value={form.lastName}
        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
      />

      <Input
        label="Teléfono del empleado"
        name="employeePhone"
        placeholder="Ingrese el teléfono del empleado"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <Input
        label="Correo electrónico"
        name="employeeEmail"
        placeholder="Ingrese el correo electrónico del empleado"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <Input
        label="Contraseña"
        name="employeePassword"
        placeholder="Ingrese la contraseña del empleado"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <Input
        label="Repetir Contraseña"
        name="confirmPassword"
        placeholder="Ingrese la contraseña del empleado"
        value={form.confirmPassword}
        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
      />

      <div className={styles.field}>
        <label htmlFor="employeeRole">Rol</label>
        <select
          id="employeeRole"
          name="employeeRole"
          className={styles.select}
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value as Roles })}
        >
          <option value={Roles.SUPERVISOR}>{Roles.SUPERVISOR}</option>
          <option value={Roles.EMPLOYEE}>{Roles.EMPLOYEE}</option>
        </select>
      </div>

      <button
        type="submit"
        className={styles.button}
        onClick={() => console.log(form)}
      >
        Agregar empleado
      </button>
      <button className={styles.button}>Cerrar</button>
    </form>
  );
};
