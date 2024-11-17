import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PriceResponse } from "@/lib/types";

export const useFetchPrices = () => {

  const fetchPrices = async (): Promise<PriceResponse> => {
    try {
      const response = await axios.get<PriceResponse>("/api/prices", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data; 
    } catch (error : any) {
      console.error("Fetching pricing data failed:", error);
      throw Error("Unable to fetch prices");
    }
  };

  return useQuery<PriceResponse>({
    queryKey: ["prices"],
    queryFn: fetchPrices,
    retry: false,
  });
};
