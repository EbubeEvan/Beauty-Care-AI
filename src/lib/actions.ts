"use server";

import dbConnect from "./database/dbConnect";
import {
  SignUpType,
  LoginType,
  beautyProfileType,
  signUpSchema,
  loginSchema,
  beautyProfileSchema,
  userReturn,
  beautyReturn,
} from "./types";
import { beautyProfileDefault } from "./data";
import User, { IUser } from "./database/user.model";
import bcrypt from "bcrypt";
import { signIn } from "@/auth";

export async function createUser(user: SignUpType) {
  const validatedFields = signUpSchema.safeParse(user);

  if (!validatedFields.success) {
    return {
      message: "Missing fields. Failed to create user",
      errors: validatedFields.error.flatten(),
    };
  }

  const hashedPassword = await bcrypt.hash(validatedFields.data.password, 10);

  const newUser: IUser = new User({
    firstName: validatedFields.data.firstName,
    lastName: validatedFields.data.lastName,
    email: validatedFields.data.email,
    password: hashedPassword,
    beautyProfile: beautyProfileDefault,
  });

  try {
    await dbConnect();

    const savedUser = await newUser.save();

    return {
      id: savedUser.id as string,
      message: "User created successfully!",
    };
  } catch (error: any) {
    return {
      message: `Database error : ${error.message}`,
    };
  }
}

export async function addBeautyProfile(
  profile: beautyProfileType,
  userId: string
) {
  const validatedFields = beautyProfileSchema.safeParse(profile);

  if (!validatedFields.success) {
    return {
      message: "Missing fields. Failed to create user",
      errors: validatedFields.error.flatten(),
    };
  }

  try {
    await dbConnect();

    const user: IUser | null = await User.findOneAndUpdate(
      { _id: userId },
      { beautyProfile: validatedFields.data },
    );

    if (!user) {
      throw new Error("User not found");
    }

    return {
      message: "Beauty profile added successfully!",
    };
  } catch (error: any) {
    return {
      message: `Database error : ${error.message}`,
    };
  }
}

export const authenticate = async (
  data : LoginType
) => {
  try {
    await signIn("credentials", data);
  } catch (error) {
    console.log(error);
    if ((error as Error).message.includes("CredentialsSignin")) {
      return "CredentialsSignin";
    }
    throw error;
  }
};