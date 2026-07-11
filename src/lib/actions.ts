'use server';

import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';
import { AuthError } from 'next-auth';

import { signIn, signOut } from '@/auth';
import dbConnect from '@/database/dbConnect';
import User, { IUser } from '@/database/models/user.model';

import { beautyProfileDefault } from './data';
import {
  beautyProfileSchema,
  beautyProfileType,
  beautyReturn,
  LoginType,
  signUpFormSchema,
  SignUpType,
  userReturn,
} from './types';

export async function createUser(user: SignUpType): Promise<userReturn> {
  const validatedFields = signUpFormSchema.safeParse(user);

  if (validatedFields.success) {
    console.log('validated successfully!');
  } else {
    return {
      message: 'Missing fields. Failed to create user',
      errors: validatedFields.error.flatten().fieldErrors,
    };
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

    if (savedUser) {
      console.log('User created successfully!');
    }

    return {
      id: savedUser._id.toString(),
      message: 'User created successfully!',
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
  userId: string,
): Promise<beautyReturn> {
  const validatedFields = beautyProfileSchema.safeParse(profile);

  if (validatedFields.success) {
    console.log('validated successfully!');
  } else {
    return {
      message: 'Missing fields. Failed to create user',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await dbConnect();

    const user: IUser | null = await User.findOneAndUpdate(
      { _id: userId },
      { beautyProfile: validatedFields.data },
      { new: true },
    );

    if (user) {
      console.log('Beauty profile added successfully!');
    } else {
      throw new Error('User not found');
    }

    return {
      message: 'Beauty profile added successfully',
    };
  } catch (error: any) {
    console.log(`Database error : ${error.message}`);
    return {
      message: `Database error : ${error.message}`,
    };
  }
}

export async function authenticate(user: LoginType): Promise<void> {
  try {
    await signIn('credentials', user);
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === 'CredentialsSignin') {
        throw new Error('Invalid credentials.');
      }
      throw new Error('Something went wrong.');
    }
    throw error;
  }
}

export const logout = async () => {
  'use server';
  await signOut({ redirectTo: '/login' });
};

export async function addCredits(credits: number, userId: string): Promise<string> {
  try {
    await dbConnect();

    const user: IUser | null = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { creditBalance: credits } },
      { new: true },
    );

    if (user) {
      console.log(`Updated credit balance for user ${userId}: ${credits}`);
      revalidatePath('/chat');
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
