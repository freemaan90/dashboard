import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    lastName: string;
    phone: string;
    email: string;
    accessToken: string;
    role:string
  }

  interface Session {
    user?: {
      id: string;
      name: string;
      lastName: string;
      phone: string;
      email: string;
      role:string
    };
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    accessToken: string;
    role: string;
  }
}
