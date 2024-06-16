import { FlowerIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { ModeToggle } from '../ui/mode-toggle'

export default function Heading() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center justify-between">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <FlowerIcon className="h-6 w-6 text-pink-500 dark:text-purple-400" />
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Beautycare AI
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Link
            href="#"
            className="inline-flex items-center gap-2 rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:bg-purple-400 dark:text-gray-900 dark:hover:bg-purple-500 dark:focus:ring-purple-400"
            prefetch={false}
          >
            <UserIcon className="h-4 w-4" />
            Account
          </Link>
        </div>
      </header>
  )
}
