import { z } from 'zod';

export interface LoginType {
    email : string;
    password : string
}

export interface SignUpType {
    firstName : string;
    lastName : string;
    email : string;
    password : string;
    confirmPassword : string
}

export interface selectProps {
    items : string[];
    id : string
}

export const signUpSchema = z.object({
    firstName : z.string().min(1, {message : "First name is required"}),
    lastName : z.string().min(1, {message : "Last name is required"}),
    email : z.string().min(1, {message : "email is required"}),
    password : z.string().min(1, {message : "password is required"}),
})

export const loginSchema = z.object({
    email : z.string().min(1, {message : "email is required"}),
    password : z.string().min(1, {message : "password is required"}),
})

export const beautyProfileSchema = z.object({
    hairColor: z.string().min(1, { message: 'Hair color is required' }),
    hairType: z.string({ message: 'Hair type is required' }),
    strandThickness: z.string({ message: 'Strand thickness is required' }),
    chemicalTreatments: z.string({ message: 'Please indicate if your hair is treated' }),
    hairVolume: z.string({ message: 'Hair volume is required' }),
    skinColor: z.string().min(1, { message: 'Skin color is required' }),
    skinType: z.string({ message: 'Skin type is required' }),
    sensitivity: z.string({ message: 'Sensitivity is required' }),
    albino: z.string({ message: 'Please indicate if you are an albino' }),
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