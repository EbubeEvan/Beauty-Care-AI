import Link from "next/link"
import Image from "next/image"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { ModeToggle } from "../ui/mode-toggle"
import { FlowerIcon, SkullIcon, StarIcon, WalletIcon, WebcamIcon,  UserIcon, HashIcon } from "lucide-react"

export default function Main() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-gradient-to-br from-[#f5d0fe] to-[#e879f9] dark:from-[#1e293b] dark:to-[#4c1d95]">
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <FlowerIcon className="h-6 w-6 text-pink-500 dark:text-purple-400" />
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-50">Beautycare AI</span>
        </Link>
        <div className="flex items-center gap-4">
          <ModeToggle/>
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
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-[#f5d0fe] to-[#e879f9] dark:from-[#1e293b] dark:to-[#4c1d95]">
          <div className="container px-4 md:px-6 text-center">
            <div className="max-w-2xl mx-auto space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter text-gray-900 dark:text-gray-50 sm:text-5xl md:text-6xl">
                Get personalized skincare and haircare recommendations
              </h1>
              <p className="text-lg text-gray-700 dark:text-gray-400">
                Our AI-powered chatbot analyzes your skin and hair concerns to provide tailored product suggestions and
                routines.
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
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-pink-100 px-3 py-1 text-sm font-medium text-pink-500 dark:bg-purple-800 dark:text-purple-400">
                  Personalized Recommendations
                </div>
                <h2 className="text-3xl font-bold tracking-tighter text-gray-900 dark:text-gray-50 sm:text-4xl">
                  Tailored to your skin and hair
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-400">
                  Our AI analyzes your unique skin and hair concerns to provide personalized product recommendations and
                  routines.
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
              <Image
                src="/placeholder.svg"
                width={500}
                height={400}
                alt="Skincare Consultation"
                className="mx-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-[#f5d0fe] to-[#e879f9] dark:from-[#1e293b] dark:to-[#4c1d95]">
          <div className="container px-4 md:px-6 text-center">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="inline-block rounded-lg bg-pink-100 px-3 py-1 text-sm font-medium text-pink-500 dark:bg-purple-800 dark:text-purple-400">
                AI-Powered Recommendations
              </div>
              <h2 className="text-3xl font-bold tracking-tighter text-gray-900 dark:text-gray-50 sm:text-4xl">
                Unlock your skin and hair&apos;s potential
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-400">
                Our advanced AI analyzes your unique skin and hair concerns to provide personalized product
                recommendations and routines.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <Card className="text-left">
                  <CardHeader>
                    <SkullIcon className="h-8 w-8 text-pink-500 dark:text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">Skin Analysis</h3>
                    <p className="text-gray-700 dark:text-gray-400">
                      Our AI examines your skin type, texture, and concerns to recommend the best products and routines.
                    </p>
                  </CardContent>
                </Card>
                <Card className="text-left">
                  <CardHeader>
                    <HashIcon className="h-8 w-8 text-pink-500 dark:text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">Hair Analysis</h3>
                    <p className="text-gray-700 dark:text-gray-400">
                      Our AI evaluates your hair type, condition, and concerns to suggest the perfect haircare products.
                    </p>
                  </CardContent>
                </Card>
                <Card className="text-left">
                  <CardHeader>
                    <WalletIcon className="h-8 w-8 text-pink-500 dark:text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">Credit System</h3>
                    <p className="text-gray-700 dark:text-gray-400">
                      Earn credits for completing consultations and purchase more to continue your skincare journey.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <img
                src="/placeholder.svg"
                width={500}
                height={400}
                alt="Skincare Consultation"
                className="mx-auto rounded-lg shadow-lg"
              />
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-pink-100 px-3 py-1 text-sm font-medium text-pink-500 dark:bg-purple-800 dark:text-purple-400">
                  Trusted by Thousands
                </div>
                <h2 className="text-3xl font-bold tracking-tighter text-gray-900 dark:text-gray-50 sm:text-4xl">
                  Real results, real people
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-400">
                  Our AI-powered skincare and haircare recommendations have helped thousands of people achieve their
                  beauty goals.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="#"
                    className="inline-flex items-center gap-2 rounded-md bg-pink-500 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:bg-purple-400 dark:text-gray-900 dark:hover:bg-purple-500 dark:focus:ring-purple-400"
                    prefetch={false}
                  >
                    <StarIcon className="h-5 w-5" />
                    View Testimonials
                  </Link>
                  <Link
                    href="#"
                    className="inline-flex items-center gap-2 rounded-md bg-transparent border border-pink-500 px-6 py-3 text-sm font-medium text-pink-500 shadow-sm transition-colors hover:bg-pink-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-400 dark:hover:text-gray-900 dark:focus:ring-purple-400"
                    prefetch={false}
                  >
                    <WebcamIcon className="h-5 w-5" />
                    Start Consultation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-4 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-sm text-gray-500 dark:text-gray-400">&copy; 2024 Skincare AI. All rights reserved.</p>
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
    </div>
  )
}
