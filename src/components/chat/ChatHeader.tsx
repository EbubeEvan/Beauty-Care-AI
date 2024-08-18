import { FlowerIcon } from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { ModeToggle } from "../design-system/mode-toggle";
import { Menu } from "lucide-react";

export default function ChatHeader({
  setMenuOpen,
}: {
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <header className="px-4 pt-6 lg:px-6 h-14 flex items-center justify-between">
      <Menu size={27} className="md:hidden text-pink-500 dark:text-white" onClick={() => setMenuOpen(true)}/>
      <Link href="/" className="flex items-center gap-2">
        <FlowerIcon className="h-6 w-6 text-pink-500 dark:text-purple-400 md:ml-5" />
        <span className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          Beautycare AI
        </span>
      </Link>
      <div className="flex items-center gap-4">
        <ModeToggle />
      </div>
    </header>
  );
}
