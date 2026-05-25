import { env } from "@/config/envs";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // 1) LOGIN en NestJS — el backend responde con cookies httpOnly
          const loginRes = await fetch(
            `${env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            },
          );

          if (!loginRes.ok) return null;

          // 2) Extraer el access_token de las cookies de la respuesta
          const setCookie = loginRes.headers.get("set-cookie") ?? "";
          const accessTokenMatch = setCookie.match(/access_token=([^;]+)/);
          const accessToken = accessTokenMatch?.[1] ?? null;

          if (!accessToken) return null;

          // 3) Pedir el usuario usando el token como Bearer
          const meRes = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}/auth/me`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!meRes.ok) return null;

          const user = await meRes.json();

          if (!user?.id) return null;

          // 4) Retornar user con accessToken incluido
          return {
            id: String(user.id),
            name: user.name,
            lastName: user.lastName,
            phone: user.phone,
            email: user.email,
            role: user.role,
            company: user.company,
            companyLogo: user.companyLogo,
            accessToken,
            ownerId: user.ownerId,
          };
        } catch {
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 días
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 1) Login inicial
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.lastName = user.lastName;
        token.phone = user.phone;
        token.email = user.email;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.company = user.company;
        token.companyLogo = user.companyLogo;
        token.ownerId = user.ownerId;
      }

      // 2) Cuando llamamos session.update() desde el cliente
      if (trigger === "update" && session?.user) {
        token.phone = session.user.phone;
        token.name = session.user.name ?? token.name;
        token.lastName = session.user.lastName ?? token.lastName;
        token.company = session.user.company ?? token.company;
        token.companyLogo = session.user.companyLogo ?? token.companyLogo;
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;

      session.user = {
        id: token.id,
        name: token.name!,
        lastName: token.lastName,
        phone: token.phone,
        email: token.email!,
        role: token.role,
        company: token.company,
        companyLogo: token.companyLogo,
        ownerId: token.ownerId || null,
      };

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
