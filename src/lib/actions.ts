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
import User, { IUser } from "./database/models/user.model";
import bcrypt from "bcrypt";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function createUser(user: SignUpType) : Promise<userReturn> {
  const validatedFields = signUpSchema.safeParse(user);

  if (!validatedFields.success) {
    return {
      message: "Missing fields. Failed to create user",
      errors: validatedFields.error.flatten().fieldErrors,
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
      {new : true}
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

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}