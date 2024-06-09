import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import pdf from 'pdf-parse';
import { Buffer } from 'buffer';
import * as mammoth from 'mammoth';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const extractTextFromPDF = async (file: File): Promise<string> => {
  const fileJson = JSON.stringify(file)
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const data = await pdf(buffer);
  return data.text;
};

export const extractTextFromDocx = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};