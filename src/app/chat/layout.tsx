import LayoutContent from "@/components/chat/LayoutContent";
import { fetchHistory } from "@/lib/fetchData";
import { auth } from "@/auth"; 
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'chat',
};

export default async function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const session = await auth()

    const history = await fetchHistory(session?.user?.id!)

  return (
    <div>
      <LayoutContent history={history!}>{children}</LayoutContent>
    </div>
  );
}
