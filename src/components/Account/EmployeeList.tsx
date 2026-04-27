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
  return (
    <>
      {employees.map((emp) => (
        <div key={emp.id} className={styles.card}>
          <div>
            <p className={styles.name}>{emp.name}</p>
            <p className={styles.role}>{emp.role}</p>
          </div>

          <div className={styles.actions}>
            <form action={handleRoleChange.bind(null, emp.id)}>
              <select
                name="role"
                defaultValue={emp.role}
                className={styles.select}
                onChange={(e) => e.currentTarget.form?.requestSubmit()}
              >
                <option value="SUPERVISOR">Supervisor</option>
                <option value="EMPLOYEE">Empleado</option>
              </select>
            </form>

            <form action={handleDelete.bind(null, emp.id)}>
              <button className={styles.deleteButton}>Eliminar</button>
            </form>
          </div>
        </div>
      ))}
    </>
  );
};
