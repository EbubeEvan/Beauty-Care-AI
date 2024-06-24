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

export interface OnboardingType {
    hairColor : string,
    hairType : string;
    strandThickness : string;
    chemicalTreatments : string;
    hairVolume : string,
    skinColor : string;
    skinType : string;
    sensitivity : string;
    albino: string
}

export interface selectProps {
    items : string[];
    id : string
}

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