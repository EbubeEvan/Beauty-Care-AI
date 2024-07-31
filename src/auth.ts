import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import User, {IUser} from "./lib/database/user.model";
import dbConnect from "./lib/database/dbConnect";
import bcrypt from "bcrypt";



const getUser = async(userEmail: string): Promise<IUser | null> => {
  try {
    dbConnect()
    const user : IUser | null =  await User.findOne({email : userEmail})

    return user
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
};

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            // Return a user object with the properties expected by NextAuth
            return {
              id: user._id,
              ...user
            };
          }
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});

