import { Input } from "@/components/ui/input";
import { FlowerIcon, ImageIcon} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col h-screen pt-10">
      {/* New container */}
      <div className="flex-1 h-full overflow-y-auto flex flex-col gap-10">
        <div className="mb-4 flex items-start gap-2">
          <FlowerIcon className="h-6 w-6 text-pink-500 dark:text-purple-400" />
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        </div>
      </div>

      {/* Form positioned at the bottom */}
      <div className="flex justify-center pt-5">
        <div className="flex flex-col w-[90%] items-center py-2 mb-[5rem] px-8 md:px-10 rounded-full bg-gray-200 dark:bg-gray-700 max-md:w-full">
          {/* Form */}
          <form className="flex w-full items-center gap-4">
            <label htmlFor="image-upload" className="cursor-pointer">
              <ImageIcon className="h-6 w-6 text-pink-500 dark:text-purple-500 overflow" />
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
              />
            </label>
            <Input
              placeholder="Type your message..."
              className="flex-1 rounded-lg px-4 bg-gray-200 dark:bg-gray-700 max-md:w-[80%] focus-visible:ring-transparent dark:focus-visible:ring-transparent text-[1.11rem]"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
