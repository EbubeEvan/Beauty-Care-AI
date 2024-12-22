import { Bot, Flower, Flower2, Wallet } from "lucide-react";

export const CARDITEMS = [
  {
    id: 1,
    icon: Flower,
    title: "Skin Analysis",
    description:
      "Our AI examines your skin type, texture, and concerns to recommend the best products and routines.",
  },
  {
    id: 2,
    icon: Flower2,
    title: "Hair Analysis",
    description:
      "Our AI evaluates your hair type, condition, and concerns to suggest the perfect haircare products.",
  },
  {
    id: 3,
    icon: Bot,
    title: "AI-Powered Chatbot",
    description:
      "Have natural conversations and receive tailored recommendations for your skin and hair concerns.",
  },
  {
    id: 4,
    icon: Wallet,
    title: "Credit System",
    description:
      "Utilize your credits to access expert advice and receive personalized treatment plans. Top up your credits whenever you need.",
  },
];

export const HAIRTYPE = [
  { name: "No idea", value: "No idea" },
  { name: "1a", value: "1a" },
  { name: "1b", value: "1b" },
  { name: "1c", value: "1c" },
  { name: "2a", value: "2a" },
  { name: "2b", value: "2b" },
  { name: "2c", value: "2c" },
  { name: "3a", value: "3a" },
  { name: "3b", value: "3b" },
  { name: "3c", value: "3c" },
  { name: "4a", value: "4a" },
  { name: "4b", value: "4b" },
  { name: "4c", value: "4c" },
];

export const STRANDTHICKNESS = [
  { name: "No idea", value: "No idea" },
  { name: "Fine", value: "Fine" },
  { name: "Medium", value: "Medium" },
  { name: "Coarse", value: "Coarse" },
];

export const CHEMICALTREATMENTS = [
  { name: "No idea", value: "No idea" },
  { name: "None", value: "None" },
  { name: "Relaxer", value: "Relaxer" },
  { name: "Color / Bleach", value: "Color / Bleach" },
  { name: "Perm", value: "Perm" },
  { name: "Keratin", value: "Keratin" },
];

export const HAIRVOLUME = [
  { name: "No idea", value: "No idea" },
  { name: "Thin", value: "Thin" },
  { name: "Medium", value: "Medium" },
  { name: "Thick", value: "Thick" },
];

export const SKINTYPE = [
  { name: "No idea", value: "No idea" },
  { name: "Oily", value: "Oily" },
  { name: "Combination", value: "Combination" },
  { name: "Dry", value: "Dry" },
];

export const SENSITIVITY = [
  { name: "No idea", value: "No idea" },
  { name: "Mildly sensitive", value: "Mildly sensitive" },
  { name: "Not sensitive", value: "Not sensitive" },
  { name: "Very sensitive", value: "Very sensitive" },
];

export const ALBINO = [
  { name: "Yes", value: "Yes" },
  { name: "No", value: "No" },
];

export const beautyProfileDefault = {
  hairColor: "No idea",
  hairType: "No idea",
  strandThickness: "No idea",
  chemicalTreatment: "No idea",
  hairVolume: "No idea",
  skinColor: "No idea",
  skinType: "No idea",
  sensitivity: "No idea",
  albino: "No idea",
};

export const DEFAULT_PRICES = [
  {
    id: "",
    credits: 0,
    price: 0,
    discount: 0,
  },
];

export const PRICE_SKELETON_ARRAY = [1, 2, 3, 4]