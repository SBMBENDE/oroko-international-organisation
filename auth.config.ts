import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible auth config — no Node.js-only imports (no DB, no bcrypt).
 * Used by proxy.ts for route protection and by auth.ts for the full config.
 */
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
        token.membershipStatus = (user as { membershipStatus?: string })
          .membershipStatus;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role ?? "member") as "member" | "admin" | "superadmin";
        session.user.membershipStatus = (token.membershipStatus ?? "pending") as "pending" | "active" | "suspended" | "expired";
      }
      return session;
    },
  },
  providers: [], // Credentials provider is added in auth.ts (Node.js only)
  trustHost: true,
};
