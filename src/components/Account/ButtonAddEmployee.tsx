"use client";

import { Dispatch, SetStateAction } from "react";
import styles from "./ButtonAddEmployee.module.css";
export const ButtonAddEmployee = ({
  setShowForm,
}: {
  setShowForm: Dispatch<SetStateAction<boolean>>;
}) => {
  const handleAddEmployee = () => {
    setShowForm(true);
  };

  return (
    <button className={styles.button} onClick={handleAddEmployee}>
      + Agregar empleado
    </button>
  );
};
