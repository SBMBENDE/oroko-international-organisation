import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: import("@/types").UserRole;
      membershipStatus: import("@/types").MembershipStatus;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
    membershipStatus?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    membershipStatus?: string;
  }
}
