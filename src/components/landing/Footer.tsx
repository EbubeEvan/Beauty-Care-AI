import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="flex flex-col gap-4 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          &copy; 2024 Beautycare AI. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-sm hover:underline underline-offset-4 text-gray-500 dark:text-gray-400"
            prefetch={false}
          >
            Privacy
          </Link>
          <Link
            href="#"
            className="text-sm hover:underline underline-offset-4 text-gray-500 dark:text-gray-400"
            prefetch={false}
          >
            Terms
          </Link>
          <Link
            href="#"
            className="text-sm hover:underline underline-offset-4 text-gray-500 dark:text-gray-400"
            prefetch={false}
          >
            Contact
          </Link>
        </nav>
      </footer>
  )
}
