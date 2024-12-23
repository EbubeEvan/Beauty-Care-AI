'use client'

import clsx from "clsx";
import ChatHeader from "@/components/chat/ChatHeader";
import SideNav from "@/components/chat/SideNav";
import { useFetchHistory } from "@/hooks/useFetchHistory";
import useStore from "@/lib/store/useStore";

export default function LayoutContent({
    children,
    id,
    email
}: Readonly<{
    children: React.ReactNode;
    id?: string;
    email?: string;
}>) {
    const {data : history, isLoading} = useFetchHistory(id!)
    const {menuOpen} = useStore()

    console.log(history);

    return (
        <div className="flex h-full w-full">
            <aside
                className={clsx(
                    "bg-pink-500 transition-all fixed inset-y-0 left-0 dark:bg-purple-500 overflow-y-auto overflow-x-hidden",
                    {
                        "max-md:translate-x-[-100%] md:w-[5%]": !menuOpen,
                        "md:w-[32%] lg:w-[20%] max-md:w-[80%] min-[1280px]:w-[21%]": menuOpen,
                    }
                )}
            >
                <SideNav id={id} email={email!}/>
            </aside>
            <div
                className={clsx("flex-1 h-screen transition-all bg-gradient-to-br from-[#f5d0fe] to-[#e879f9] dark:from-[#1e293b] dark:to-[#4c1d95] overflow-hidden", {
                    "w-full md:w-[95%] md:pl-10 lg:pl-14": !menuOpen,
                    "md:w-[68%] lg:w-[80%] md:ml-[32%] lg:ml-[20%]": menuOpen,
                })}
            >
                <header className="w-full">
                    <ChatHeader />
                </header>
                <main
                    className="flex-1 px-[2rem]"
                    // onClick={() => setMenuOpen(false)}
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
