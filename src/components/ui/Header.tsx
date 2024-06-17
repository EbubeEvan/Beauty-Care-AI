import { FlowerIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { ModeToggle } from "./mode-toggle";

export default function Header() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <FlowerIcon className="h-6 w-6 text-pink-500 dark:text-purple-400" />
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
