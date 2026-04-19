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