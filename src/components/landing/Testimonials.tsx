"use client";

import { StarIcon, WebcamIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Testimonials() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 2 }}
            variants={{
              hidden: { opacity: 0, y: 0 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <Image
              src="/images/pic3.jpg"
              width={500}
              height={400}
              alt="Skincare Consultation"
              className="mx-auto rounded-lg shadow-lg"
            />
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            variants={{
              hidden: { opacity: 0, x: 50 },
              visible: { opacity: 1, x: 0 },
            }}
            className="space-y-4"
          >
            <div className="inline-block rounded-lg bg-pink-100 px-3 py-1 text-sm font-medium text-pink-500 dark:bg-purple-800 dark:text-purple-400">
              Trusted by Thousands
            </div>
            <h2 className="text-3xl font-bold tracking-tighter text-gray-900 dark:text-gray-50 sm:text-4xl">
              Real results, real people
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-400">
              Our AI-powered skincare and haircare recommendations have helped
              thousands of people achieve their beauty goals.
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
