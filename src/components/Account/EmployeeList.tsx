'use client';
import styles from "./EmployeeList.module.css";
import { handleDelete, handleRoleChange } from "@/app/actions/User";

interface Props {
  employees: {
    id: number;
    name: string;
    role: string;
  }[];
}

export const EmployeeList = ({ employees }: Props) => {
  if (employees.length === 0) {
    return (
      <div style={{
        padding: "var(--spacing-8)",
        textAlign: "center",
        color: "var(--color-text-tertiary)",
        background: "var(--color-bg-subtle)",
        borderRadius: "var(--radius-lg)",
        border: "1px dashed var(--color-border-default)",
      }}>
        No hay empleados registrados todavía.
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {employees.map((emp) => {
        const initials = emp.name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();

        return (
          <div key={emp.id} className={styles.card}>
            <div className={styles.info}>
              <div className={styles.avatar} aria-hidden="true">
                {initials}
              </div>
              <div>
                <p className={styles.name}>{emp.name}</p>
                <p className={styles.role}>{emp.role}</p>
              </div>
            </div>

            <div className={styles.actions}>
              <form action={handleRoleChange.bind(null, emp.id)}>
                <select
                  name="role"
                  defaultValue={emp.role}
                  className={styles.select}
                  onChange={(e) => e.currentTarget.form?.requestSubmit()}
                  aria-label={`Rol de ${emp.name}`}
                >
                  <option value="SUPERVISOR">Supervisor</option>
                  <option value="EMPLOYEE">Empleado</option>
                </select>
              </form>

              <form action={handleDelete.bind(null, emp.id)}>
                <button
                  type="submit"
                  className={styles.deleteButton}
                  aria-label={`Eliminar a ${emp.name}`}
                >
                  Eliminar
                </button>
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
};
