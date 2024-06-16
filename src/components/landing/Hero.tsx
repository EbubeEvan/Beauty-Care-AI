import { WebcamIcon } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-[#f5d0fe] to-[#e879f9] dark:from-[#1e293b] dark:to-[#4c1d95]">
          <div className="container px-4 md:px-6 text-center">
            <div className="max-w-2xl mx-auto space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter text-gray-900 dark:text-gray-50 sm:text-5xl md:text-6xl">
                Get personalized skincare and haircare recommendations
              </h1>
              <p className="text-lg text-gray-700 dark:text-gray-400">
                Our AI-powered chatbot analyzes your skin and hair concerns to
                provide tailored product suggestions and routines.
              </p>
              <Link
                href="#"
                className="inline-flex items-center gap-2 rounded-md bg-pink-500 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:bg-purple-400 dark:text-gray-900 dark:hover:bg-purple-500 dark:focus:ring-purple-400"
                prefetch={false}
              >
                <WebcamIcon className="h-5 w-5" />
                Start Consultation
              </Link>
            </div>
          </div>
        </section>
  )
}
