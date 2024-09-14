import LayoutContent from "@/components/chat/LayoutContent";
import { fetchHistory, getUser } from "@/lib/fetchData";
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

    const user = await getUser(session?.user?.email!);

    const history = await fetchHistory(user?._id!)

  return (
    <div>
      <LayoutContent history={history!}>{children}</LayoutContent>
    </div>
  );
}
