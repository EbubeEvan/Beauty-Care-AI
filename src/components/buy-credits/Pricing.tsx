"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from 'axios';
import { CreditCard } from "lucide-react";
import { priceType } from "@/lib/types";

interface CurrencyData {
    currency: string;
    conversionRate: number;
  }

export default function Pricing({ prices }: { prices: priceType[] }) {
    const [currencyData, setCurrencyData] = useState<CurrencyData | null>(null);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchCurrencyData = async () => {
        try {
          // Fetch user's location and currency
          const { data: locationData } = await axios.get('https://ipapi.co/json/');
          const userCurrency = locationData.currency;
  
          // Fetch conversion rate (assuming the base price is in USD)
          const { data: exchangeData } = await axios.get(
            `https://api.exchangerate-api.com/v4/latest/USD`
          );
          const conversionRate = exchangeData.rates[userCurrency];
  
          setCurrencyData({ currency: userCurrency, conversionRate });
        } catch (err) {
          setError('Failed to fetch currency information');
        }
      };
  
      fetchCurrencyData();
    }, []);
  
    // Base prices in USD
    const basePrices = [19, 29, 49, 99];
  
    const formatPrice = (price: number, currency: string) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
      }).format(price);
    };
  
    if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto py-12 px-5 md:px-20 lg:px-48 h-full">
      <h1 className="text-4xl font-bold text-center mb-4">Get Your Credits</h1>
      <p className="text-center text-muted-foreground mb-6">
        Purchase the amount of credits you need
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {prices.map((price) => (
          <Card
            key={price.id}
            className="flex flex-col"
          >
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <CreditCard className="h-6 w-6" />
                {price.credits} Credits
              </CardTitle>
              <p className="text-3xl font-bold">{price.p1}</p>
              <p className="text-sm text-green-500 font-semibold">
                  {price.discount}
                </p>
            </CardHeader>
            <CardFooter>
              <Button
                className="w-full"
                variant={"outline"}
              >
                Buy Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
