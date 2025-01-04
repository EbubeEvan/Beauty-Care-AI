"use client";

import { Menu, Plus, MessageCircle, CreditCard, Wallet } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import clsx from "clsx";
import Logout from "./Logout";
import { Spinner } from "../ui/spinner";
import { useFetchHistory } from "@/hooks/useFetchHistory";
import useStore from "@/lib/store/useStore";
import { usePathname } from "next/navigation";
import { useFetchCredits } from "@/hooks/useFetchCredits";
import { useEffect } from "react";

export default function SideNav({
  id,
  email
}: Readonly<{
  id?: string;
  email: string
}>) {
  const { data: history, isLoading } = useFetchHistory(id!);
  const { data: newCredits } = useFetchCredits(email);
  const { menuOpen, setMenuOpen, setCredits, credits } = useStore();
  const pathname = usePathname();
  const pathID = pathname.split("/")[2];

  console.log(credits);
  
  useEffect(() => {
    console.log("New Credits from API:", newCredits?.credits); // Log fetched data
    if (newCredits?.credits !== undefined || null) {
      setCredits(newCredits?.credits!);
    }
  }, [newCredits?.credits, setCredits]);  

  return (
    <div className="py-6 h-full">
      <div className="flex flex-col gap-5 px-3 h-full">
        <div
          className={clsx("flex transition-all duration-300", {
            "justify-center": !menuOpen,
            "justify-start": menuOpen,
          })}
        >
          <Button
            onClick={() => setMenuOpen(!menuOpen)}
            className="hover:bg-pink-300 dark:hover:bg-purple-400 rounded-full"
          >
            <Menu />
          </Button>
        </div>
        <div
          className={clsx("flex transition-all duration-1000", {
            "justify-center": !menuOpen,
            "justify-start": menuOpen,
          })}
        >
          <Link
            href="/chat"
            className="hover:bg-pink-300 dark:hover:bg-purple-400 rounded-full text-white px-3 py-2 flex gap-1"
          >
            <Plus />
            {menuOpen && "New Chat"}
          </Link>
        </div>
        {/* Make the history div scrollable */}
        <div
          className={clsx(
            "flex flex-col gap-3 overflow-y-auto", // Enables vertical scrolling
            { hidden: !menuOpen }
          )}
          style={{ maxHeight: "calc(100vh - 200px)" }} // Adjust the height as needed
        >
          {isLoading ? (
            <Spinner size="medium" className="text-gray-200 dark:text-gray-700"/>
          ) : (
            history?.map((chat) => (
              <Link
                href={`/chat/${chat.chatId}`}
                className={clsx(
                  "flex gap-2 text-white px-5 py-2 mr-3 hover:bg-pink-300 dark:hover:bg-purple-400 rounded-full",
                  {
                    "bg-pink-300 dark:bg-purple-400": chat.chatId === pathID,
                  }
                )}
                key={chat.chatId}
              >
                <MessageCircle className="min-w-4 max-w-4" />
                <p className="truncate">{chat.messages[0].content}</p>
              </Link>
            ))
          )}
        </div>

        <div className={clsx("text-white flex gap-3 px-5 py-2 hover:bg-pink-300 dark:hover:bg-purple-400 rounded-full", {
            hidden: !menuOpen,
          })}>
          <CreditCard />
          <p>{`${newCredits?.credits || 0 } credits`}</p>
        </div>

        <Link
          href="/buy-credits"
          className={clsx("text-white flex gap-3 px-5 py-2 hover:bg-pink-300 dark:hover:bg-purple-400 rounded-full", {
            hidden: !menuOpen,
          })}
        >
          <Wallet />
          <p>Buy credits</p>
        </Link>

        <div
          className={clsx("flex transition-all duration-300 px-3", {
            "justify-center": !menuOpen,
            "justify-start": menuOpen,
          })}
        >
          <Logout />
        </div>
      </div>
    </div>
  );
}
