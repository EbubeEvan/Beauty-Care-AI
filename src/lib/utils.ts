import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import markdownit from "markdown-it";
import DOMPurify from "dompurify";
import dbConnect from "./database/dbConnect";
import User, { IUser } from "./database/models/user.model";
import { FinalPriceType, priceType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sanitizeMessage = (message: string) => {
  const md = markdownit();
  const dirty = md.render(message);
  return DOMPurify.sanitize(dirty);
};

export const creditsUpdate = async (email: string) => {
  dbConnect();

  const user = await User.findOne<IUser>({ email: email });

  if (user && user.creditBalance > 0) {
    try {
      // Decrement credits
      const updatedUser = await User.findOneAndUpdate(
        { email: email },
        { $inc: { creditBalance: -1 } },
        { new: true }
      );

      if (updatedUser) {
        console.log("User credits decremented:", updatedUser.credits);
      } else {
        console.error("Failed to decrement credits: User not found.");
      }
    } catch (err) {
      console.error("Error saving new chat:", err);
    }

  } else {
    console.log("User has no remaining credits.");
  }
};

export const priceConvert = (parsedPrices : priceType[], conversionRate : number) => {
  const convertedPrices : FinalPriceType[] = parsedPrices.map((price) => {
    let selectedPrice;

    if (conversionRate >= 1) {
      selectedPrice = price.p1; // If conversionRate is 1 or above
      console.log("Selected Price set to p1");
  } else if (conversionRate > 0.01 && conversionRate < 1) {
      selectedPrice = price.p3; // If conversionRate is between 0.01 and 1
      console.log("Selected Price set to p3");
  } else if (conversionRate > 0.0001 && conversionRate < 0.01) {
      selectedPrice = price.p2; // If conversionRate is between 0.0001 and 0.01
      console.log("Selected Price set to p2");
  } else {
      selectedPrice = price.p1; // Fallback to p1 for any unexpected case
      console.log("Selected Price set to fallback p1");
  }

    console.log({selectedPrice}); 

    const convertedPrice = selectedPrice * conversionRate;

    return {
      id: price._id,
      credits: price.credits,
      price: convertedPrice,
      discount: price.discount,
    };
  });

  return convertedPrices
}
