import { z } from "zod";

export interface LoginType {
  email: string;
  password: string;
}

export interface SignUpType {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface selectProps {
  items: string[]; 
  id: string;
}

export const signUpFormSchema = z.object({
  firstName: z.string({ message: "First name is required" }).min(1),
  lastName: z.string({ message: "Last name is required" }).min(1),
  email: z
    .string({ message: "email is required" })
    .min(1)
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email address"
    ),
  password: z
    .string({ message: "password is required" })
    .min(6, { message: "minimum of 6 characters required" }),
  confirmPassword: z
    .string({ message: "password is required" })
    .min(6, { message: "minimum of 6 characters required" }),
});

export const signUpSchema = z.object({
  firstName: z.string({ message: "First name is required" }).min(1),
  lastName: z.string({ message: "Last name is required" }).min(1),
  email: z.string({ message: "email is required" }).min(1),
  password: z
    .string({ message: "password is required" })
    .min(6, { message: "minimum of 6 characters required" }),
});

export const loginSchema = z.object({
  email: z
    .string({ message: "email is required" })
    .min(1)
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email address"
    ),
  password: z
    .string({ message: "password is required" })
    .min(6, { message: "minimum of 6 characters required" }),
});

export const beautyProfileSchema = z.object({
  hairColor: z.string({ message: "Hair color is required" }).min(1),
  hairType: z.string({ message: "Hair type is required" }),
  strandThickness: z.string({ message: "Strand thickness is required" }),
  chemicalTreatment: z.string({
    message: "Please indicate if your hair is treated",
  }),
  hairVolume: z.string({ message: "Hair volume is required" }),
  skinColor: z.string({ message: "Skin color is required" }).min(1),
  skinType: z.string({ message: "Skin type is required" }),
  sensitivity: z.string({ message: "Sensitivity is required" }),
  albino: z.string({ message: "Please indicate if you are an albino" }),
});

export interface beautyProfileType {
  hairColor: string;
  hairType: string;
  strandThickness: string;
  chemicalTreatment: string;
  hairVolume: string;
  skinColor: string;
  skinType: string;
  sensitivity: string;
  albino: string;
}

export interface messageSchematype {
  content: string;
  createdAt: Date;
  experimental_attachments?: string;
  id: string;
  role: "assistant" | "user";
}

export interface userReturn {
  message?: string;
  errors?: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    password?: string[];
  };
}

export interface userErrors {
  firstName?: string[];
  lastName?: string[];
  email?: string[];
  password?: string[];
}

export interface beautyReturn {
  id?: string;
  message?: string;
  errors?: {
    hairColor?: string[];
    hairType?: string[];
    strandThickness?: string[];
    chemicalTreatment?: string[];
    hairVolume?: string[];
    skinColor?: string[];
    skinType?: string[];
    sensitivity?: string[];
    albino?: string[];
  };
}

export interface beautyError {
  hairColor?: string[];
  hairType?: string[];
  strandThickness?: string[];
  chemicalTreatment?: string[];
  hairVolume?: string[];
  skinColor?: string[];
  skinType?: string[];
  sensitivity?: string[];
  albino?: string[];
} 
