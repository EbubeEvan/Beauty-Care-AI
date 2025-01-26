"use server";

import dbConnect from "@/database/dbConnect";
import {
  SignUpType,
  LoginType,
  beautyProfileType,
  signUpSchema,
  beautyProfileSchema,
  userReturn,
  beautyReturn,
} from "./types";
import { beautyProfileDefault } from "./data";
import User, { IUser } from "@/database/models/user.model";
import bcrypt from "bcrypt";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

export async function createUser(user: SignUpType): Promise<userReturn> {
  const validatedFields = signUpSchema.safeParse(user);

  if (!validatedFields.success) {
    return {
      message: "Missing fields. Failed to create user",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  } else {
    console.log("validated successfully!");
  }

  const hashedPassword = await bcrypt.hash(validatedFields.data.password, 10);

  const newUser: IUser = new User({
    firstName: validatedFields.data.firstName,
    lastName: validatedFields.data.lastName,
    email: validatedFields.data.email.toLowerCase(),
    password: hashedPassword,
    creditBalance: 20,
    beautyProfile: beautyProfileDefault,
  });

  try {
    await dbConnect();

    const savedUser = await newUser.save();

    savedUser && console.log("User created successfully!");

    return {
      id: savedUser._id as string,
      message: "User created successfully!",
    };
  } catch (error: any) {
    console.log(`Database error : ${error.message}`);
    return {
      message: `Database error : ${error.message}`,
    };
  }
}

export async function addBeautyProfile(
  profile: beautyProfileType,
  userId: string
): Promise<beautyReturn> {
  const validatedFields = beautyProfileSchema.safeParse(profile);

  if (!validatedFields.success) {
    return {
      message: "Missing fields. Failed to create user",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  } else {
    console.log("validated successfully!");
  }

  try {
    await dbConnect();

    const user: IUser | null = await User.findOneAndUpdate(
      { _id: userId },
      { beautyProfile: validatedFields.data },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    } else {
      console.log("Beauty profile added successfully!");
    }

    return {
      message: "Beauty profile added successfully",
    };
    
  } catch (error: any) {
    console.log(`Database error : ${error.message}`);
    return {
      message: `Database error : ${error.message}`,
    };
  }
}

export async function authenticate(
  user: LoginType
): Promise<"Invalid credentials." | "Something went wrong." | undefined> {
  try {
    await signIn("credentials", user);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export const logout = async () => {
  "use server";
  await signOut();
};

export async function addCredits(
  credits: number,
  userId: string
): Promise<string> {
  try {
    await dbConnect();

    const user: IUser | null = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { creditBalance: credits } },
      { new: true }
    );

    if (user) {
      console.log(
        `Updated credit balance for user ${userId}: ${credits}`
      );
      revalidatePath("/chat")
      return `${credits} credits added successfully!`;
    } else {
      console.log(`User with ID ${userId} not found.`);
      return `Something went wrong. Unable to add credits`;
    }
  } catch (error: any) {
    console.log(`Database error: ${error.message}`);
    return `Something went wrong. Unable to add credits`;
  }
}

