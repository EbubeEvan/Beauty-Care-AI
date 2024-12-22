"use client";

import { PaystackButton } from "react-paystack";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { useState, useEffect } from "react";
import { addCredits } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useFetchPrices } from "@/hooks/useFetchPrices";
import PriceSkeleton from "./PriceSkeleton";

const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_KEY || "";

export default function Pricing({
  email,
  id,
}: Readonly<{
  email: string;
  id: string;
}>) {
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const { data , isLoading} = useFetchPrices();

  console.log(data);
  

  const currency = data?.currency
  const prices = data?.prices

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  // Trigger toast when `message` is updated
  useEffect(() => {
    if (message) {
      toast({
        variant: message.includes("successfully") ? "primary" : "destructive",
        description: message,
      });
      setMessage(""); // Reset message to avoid repeated toasts
    }
  }, [message, toast]);

  useEffect(() => {

  }, [data])

  const handleSuccess = async (credits: number) => {
    const response = await addCredits(credits, id); // Using price.credits directly
    console.log({ response });
  };

  return (
    <div className="container mx-auto py-12 px-5 md:px-20 lg:px-48 h-full">
      <h1 className="text-4xl font-bold text-center mb-4">Get Your Credits</h1>
      <p className="text-center text-muted-foreground mb-6">
        Purchase the amount of credits you need
      </p>
      {isLoading && (<PriceSkeleton/>)}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {prices?.map((price) => (
          <Card key={price.id} className="flex flex-col">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <CreditCard className="h-6 w-6" />
                {price.credits} Credits
              </CardTitle>
              <p className="text-3xl font-bold">{formatPrice(price.price)}</p>
              {!!price.discount && (
                <p className="text-sm text-green-500 font-semibold">
                  Save {price.discount}%
                </p>
              )}
            </CardHeader>
            <CardFooter className="w-full flex justify-center">
              <PaystackButton
                className="w-full rounded-md py-2 mx-5 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50"
                email={email}
                amount={price.price * 100} // Paystack expects amount in kobo (for NGN), so multiply by 100
                publicKey={publicKey}
                currency={currency}
                text="Buy"
                onSuccess={() => handleSuccess(price.credits)}
                onClose={() => console.log("Transaction closed")}
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
