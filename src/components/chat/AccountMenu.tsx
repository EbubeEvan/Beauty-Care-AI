import {
  ChevronsUpDownIcon,
  CircleUser,
  Wallet,
  User,
  CreditCard,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import clsx from "clsx";
import useStore from "@/lib/store/useStore";
import Link from "next/link";
import Logout from "./Logout";

export function AccountMenu({
  credits,
  userName,
}: Readonly<{ credits: number; userName: string }>) {
  const { menuOpen } = useStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={clsx(
            "flex p-3 relative hover:bg-pink-300 dark:hover:bg-purple-400 rounded-md text-white cursor-pointer",
            {
              hidden: !menuOpen,
            }
          )}
        >
          <CircleUser size={35} />
          <div className="ml-3">
            <p>{userName}</p>
            <div className="flex gap-2">
              <CreditCard />
              <p>{`${credits} credits`}</p>
            </div>
          </div>
          <ChevronsUpDownIcon className="cursor-pointer absolute right-0 top-5" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-gray-200 dark:bg-gray-700">
        <DropdownMenuItem>
          <Link href="/buy-credits" className="flex gap-3 px-5 py-2">
            <Wallet />
            <p>Buy credits</p>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/profile" className="flex gap-3 px-5 py-2">
            <User />
            <p>profile</p>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-400 dark:bg-gray-800" />
        <Logout />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
