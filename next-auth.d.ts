import { UserInterface } from "@/interfaces/User.interface";

type UserBase = Omit<UserInterface, "password" | "confirmPassword" | "company" | "companyLogo">;

declare module "next-auth" {
  interface User extends UserBase {
    id: string;
    accessToken: string;
    company?: string;
    companyLogo?: string;
  }

  interface Session {
    user?: UserBase & {
      id: string;
      company?: string;
      companyLogo?: string;
    };
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends UserBase {
    id: string;
    accessToken: string;
    company?: string;
    companyLogo?: string;
  }
}
