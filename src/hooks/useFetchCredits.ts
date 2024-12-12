import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CreditsResponse } from "@/lib/types";

export const useFetchCredits = () => {

  const fetchCredits = async (): Promise<CreditsResponse> => {
    try {
      const response = await axios.get<CreditsResponse>("/api/credits", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data; 
    } catch (error : any) {
      console.error("Fetching credits failed:", error);
      throw Error("Unable to fetch credits");
    }
  };

  return useQuery<CreditsResponse>({
    queryKey: ["credits"],
    queryFn: fetchCredits,
    retry: false,
  });
};
