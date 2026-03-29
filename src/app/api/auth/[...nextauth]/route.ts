import { env } from "@/config/envs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        // 1) LOGIN en NestJS (esto setea cookies httpOnly)
        const loginRes = await fetch(
          `${env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          },
        );



        if (!loginRes.ok) return null;

        const cookies = loginRes.headers.get("set-cookie");

        // 2) Pedimos el usuario real
        const meRes = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}/auth/me`, {
          method: "GET",
          headers: {
            Cookie: cookies ?? "",
          },
          credentials: "include",
        });
        if (!meRes.ok) return null;

        const user = await meRes.json();

        // 3) NextAuth exige un User con id
        return {
          id: String(user.id),
          name: user.name,
          lastName: user.lastName,
          phone: user.phone,
          email: user.email,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      // Cuando el usuario inicia sesión
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      // Refrescamos el usuario desde NestJS
      const meRes = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}/auth/me`, {
        credentials: "include",
      });

      if (meRes.ok) {
        const user = await meRes.json();
        session.user = user;
      } else {
        // ❗ NextAuth NO acepta null
        session.user = undefined;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
