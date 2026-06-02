import { UserInterface } from "@/interfaces/User.interface";

type UserBase = Omit<
  UserInterface,
  "password" | "confirmPassword"
>;

declare module "next-auth" {
  interface User extends UserBase {
    id: string;
    accessToken: string;
  }

  interface Session {
    user?: UserBase & {
      id: string;
    };
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends UserBase {
    id: string;
    accessToken: string;
  }
}
