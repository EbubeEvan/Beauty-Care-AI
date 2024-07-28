import dbConnect from "./database/dbConnect";
import { SignUpType, LoginType, beautyProfileType, signUpSchema, loginSchema } from "./types";
import User, { IUser } from "./database/user.model";
import z from "zod";
import bcrypt from "bcrypt";

export async function createUser(user: SignUpType) {
  const validatedFields = signUpSchema.safeParse(user);

  if (!validatedFields.success) {
    throw new Error("Validation Error: " + validatedFields.error.flatten()); // Throw specific error
    return
  }

  const hashedPassword = await bcrypt.hash(validatedFields.data.password, 10);

  const newUser : IUser = new User({
    firstName: validatedFields.data.firstName,
    lastName: validatedFields.data.lastName,
    email: validatedFields.data.email,
    password: hashedPassword,
  });

  try {
    await dbConnect();
    await newUser.save();
  } catch (error : any) {
    console.error("Database Error:", error); // Log with error type
    throw new Error("Error creating user: " + error.message); // Throw for caller handling
  } 
}
