"use client";
import { ButtonAddEmployee } from "./ButtonAddEmployee";
import { EmployeeList } from "./EmployeeList";
import styles from "./EmployeeContainer.module.css";
import { useState } from "react";
import { EmployeeForm } from "../ui/Forms/EmployeeForm";
import { Employees, UserSession } from "@/interfaces/User.interface";

export const EmployeeContainer = ({
  employees,
  userSession,
  accessToken,
}: {
  employees: Employees[];
  userSession: UserSession;
  accessToken?: string;
}) => {
  const [showForm, setShowForm] = useState(false);

  const { company, companyLogo, id } = userSession;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Empleados</h1>
          <p className={styles.subtitle}>
            Gestioná los miembros de tu equipo y sus roles
          </p>
        </div>
        <ButtonAddEmployee setShowForm={setShowForm} />
      </div>

      {showForm ? (
        <div className={styles.form}>
          <EmployeeForm
            setShowForm={setShowForm}
            accessToken={accessToken}
            id={id}
            company={company}
            companyLogo={companyLogo}
          />
        </div>
      ) : (
        <EmployeeList employees={employees} />
      )}
    </div>
  );
};
