export interface UserInterface {
  name: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role: "OWNER" | "SUPERVISOR" | "EMPLOYEE";
  company: string;
  companyLogo: string;
}

export interface Employees {
  id: number;
  name: string;
  role: "SUPERVISOR" | "EMPLOYEE";
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "SUPERVISOR" | "EMPLOYEE";
  company:string;
  companyLogo:string;
  lastName:string;
  phone:string;
}