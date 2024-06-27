'use client'

import { useState } from "react";
import clsx from "clsx";
import Header from "@/components/ui/Header";

export default function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const [menuOpen, setMenuOpen] = useState(true);

  return (
    <body className="flex h-full w-full">
      <section
        className={clsx(
          "bg-pink-500 transition-all fixed inset-y-0 left-0 max-md:z-50 dark:bg-purple-400 overflow-y-auto",
          {
            "ml-[-20rem]": menuOpen === false,
            "md:w-[32%] lg:w-[20%] max-md:w-[45%] min-[1280px]:w-[21%]": menuOpen === true,
          }
        )}
      >
        {/* <SideNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} /> */}
      </section>
      <section
        className={clsx("w-full h-screen bg-gradient-to-br from-[#f5d0fe] to-[#e879f9] dark:from-[#1e293b] dark:to-[#4c1d95]", {
          "w-full": menuOpen === false,
          "md:w-[72%] lg:w-[80%] md:ml-[15rem] lg:ml-[12.8rem] min-[1280px]:ml-[17rem]" : menuOpen === true
        })}
      >
        <header className="w-full">
          <Header />
        </header>
        <main
          className="flex-1 pt-[10rem] md:pt-[7rem] px-[2rem]"
          onClick={() => setMenuOpen(false)}
        >
          {children}
        </main>
        <footer>
          {/* <Footer /> */}
        </footer>
      </section>
    </body>
  )
}
