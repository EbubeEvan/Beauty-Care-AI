import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { HistoryType } from "@/lib/types";

export const useFetchHistory = (id: string) => {
  const fetchHistory = async (): Promise<HistoryType[]> => {
    try {
      const response = await axios.get<HistoryType[]>("/api/history", {
        params: {
          id,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.data) {
        throw new Error("No data returned from the API");
      }

      return response.data;
    } catch (error: any) {
      console.log(error);
      throw Error;
    }
  };

  return useQuery<HistoryType[]>({
    queryKey: ["history", id],
    queryFn: fetchHistory,
    retry: false,
  });
};
