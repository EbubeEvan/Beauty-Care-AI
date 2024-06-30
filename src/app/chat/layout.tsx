'use client'

import { useState } from "react";
import clsx from "clsx";
import Header from "@/components/ui/Header";
import SideNav from "@/components/chat/SideNav";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="flex h-full w-full">
            <aside
                className={clsx(
                    "bg-pink-500 transition-all fixed inset-y-0 left-0 dark:bg-purple-500 overflow-y-auto",
                    {
                        "max-md:translate-x-[-100%] md:w-[5%]": !menuOpen,
                        "md:w-[32%] lg:w-[20%] max-md:w-[50%] min-[1280px]:w-[21%]": menuOpen,
                    }
                )}
            >
                <SideNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            </aside>
            <div
                className={clsx("flex-1 h-screen transition-all bg-gradient-to-br from-[#f5d0fe] to-[#e879f9] dark:from-[#1e293b] dark:to-[#4c1d95]", {
                    "w-full md:w-[95%] md:pl-10 lg:pl-14": !menuOpen,
                    "md:w-[68%] lg:w-[80%] md:ml-[32%] lg:ml-[20%] min-[1280px]:ml-[21%]": menuOpen,
                })}
            >
                <header className="w-full">
                    <Header />
                </header>
                <main
                    className="flex-1 px-[2rem]"
                    onClick={() => setMenuOpen(false)}
                >
                    {children}
                </main>
                <footer>
                    {/* <Footer /> */}
                </footer>
            </div>
        </div>
    )
}
