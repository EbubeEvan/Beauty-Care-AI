import { Dispatch, SetStateAction } from "react";
import { Menu, Plus, MessageCircle } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import clsx from "clsx";

export default function SideNav({
  menuOpen,
  setMenuOpen,
}: {
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="py-6">
      <div className="flex flex-col gap-10 px-3">
        <div className={clsx("flex transition-all", {
          "justify-center" : !menuOpen,
          "justify-start" : menuOpen
        })}>
          <Button onClick={() => setMenuOpen(!menuOpen)} className="hover:bg-pink-300 dark:hover:bg-purple-400 rounded-full">
            <Menu />
          </Button>
        </div>
        <div className={clsx("flex transition-all", {
          "justify-center" : !menuOpen,
          "justify-start" : menuOpen
        })}>
          <Button className="hover:bg-pink-300 dark:hover:bg-purple-400 rounded-full">
            <Plus/>
            { menuOpen && 'New Chat'}
          </Button>
        </div>
        <div className={clsx("flex flex-col justify-center gap-3", {
          "hidden" : !menuOpen
        })}>
          <Link href='' className="flex gap-2 text-white px-5 py-2 hover:bg-pink-300 dark:hover:bg-purple-400 rounded-full">
            <MessageCircle className="min-w-4"/>
            <p className="truncate">
            Skin rash issues resulting from new cream
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
