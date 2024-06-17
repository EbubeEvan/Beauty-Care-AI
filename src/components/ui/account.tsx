"use client"

import { UserIcon } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Account() {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
      <Button
            className="inline-flex items-center gap-2 rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:bg-purple-400 dark:text-gray-900 dark:hover:bg-purple-500 dark:focus:ring-purple-400"
          >
            <UserIcon className="h-4 w-4" />
            Account
          </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push('/login')}>
          Login
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/signup')}>
          Sign Up
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
