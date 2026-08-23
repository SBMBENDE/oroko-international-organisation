import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { loginSchema } from "@/lib/validations/auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        try {
          await connectDB();
          const user = await User.findOne({
            email: parsed.data.email,
          }).select("+password +role +membershipStatus +isActive");

          if (!user || !user.password) return null;
          if (!user.isActive) return null;

          const isPasswordValid = await bcrypt.compare(
            parsed.data.password,
            user.password
          );
          if (!isPasswordValid) return null;

          return {
            id: user._id.toString(),
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role,
            membershipStatus: user.membershipStatus,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
});
