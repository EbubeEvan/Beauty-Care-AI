"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { FinalPriceType } from "@/lib/types";

export default function Pricing({
  prices,
  currency,
}: Readonly<{ prices: FinalPriceType[]; currency: string }>) {
  
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-12 px-5 md:px-20 lg:px-48 h-full">
      <h1 className="text-4xl font-bold text-center mb-4">Get Your Credits</h1>
      <p className="text-center text-muted-foreground mb-6">
        Purchase the amount of credits you need
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {prices.map((price) => (
          <Card key={price.id} className="flex flex-col">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <CreditCard className="h-6 w-6" />
                {price.credits} Credits
              </CardTitle>
              <p className="text-3xl font-bold">{formatPrice(price.price)}</p>
              {price.discount && (
                <p className="text-sm text-green-500 font-semibold">
                  Save {price.discount}%
                </p>
              )}
            </CardHeader>
            <CardFooter>
              <Button className="w-full" variant={"outline"}>
                Buy Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
