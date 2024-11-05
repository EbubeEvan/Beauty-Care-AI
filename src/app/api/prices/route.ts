export const dynamic = 'force-dynamic';

import dbConnect from "@/lib/database/dbConnect";
import Price, { IPrice } from "@/lib/database/models/price.model";
import { priceType, FinalPriceType } from "@/lib/types";
import axios from "axios";

const exchangeKey = process.env.EXCHANGE_RATE_KEY;

export async function GET(req: Request) {
  try {
    // Connect to the database and fetch prices
    await dbConnect();
    const prices: IPrice[] = await Price.find();
    const parsedPrices: priceType[] = JSON.parse(JSON.stringify(prices));

    console.log({parsedPrices});
    
    // Retrieve the client's IP address from request headers
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1"; // Fallback IP for local development

    console.log({ clientIp });

    // Get user's currency based on their IP address
    const { data: locationData } = await axios.get(
      `https://ipapi.co/${clientIp}/json/`
    );
    const userCurrency = locationData.currency || "NGN";

    console.log({ userCurrency });

    // Fetch exchange rates for conversion
    const { data: exchangeData } = await axios.get(
      `https://v6.exchangerate-api.com/v6/${exchangeKey}/latest/NGN`
    );
    const conversionRate: number =
      exchangeData.conversion_rates[userCurrency] || 1;

    console.log({ conversionRate });

    // Convert each price in parsedPrices to the user's currency
    const convertedPrices: FinalPriceType[] = parsedPrices.map((price) => {
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

    console.log({ convertedPrices });

    return new Response(
      JSON.stringify({ prices: convertedPrices, currency: userCurrency }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Failed to fetch prices:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch pricing information" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
