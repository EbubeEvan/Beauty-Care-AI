import { FlowerIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import { Account } from '../ui/account'
import { ModeToggle } from '../ui/mode-toggle'

export default function Heading() {
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
          <Account/>
        </div>
      </header>
  )
}
