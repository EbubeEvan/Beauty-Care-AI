import Header from "@/components/ui/Header"

export default function layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <section className="bg-gradient-to-br from-[#f5d0fe] to-[#e879f9] dark:from-[#1e293b] dark:to-[#4c1d95]">
        <Header/>
        {children}
    </section>
  )
}
