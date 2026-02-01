import { auth } from "@/auth";
import ResumeChat from "@/components/chat/ResumeChat";
import { getUser, getChat } from "@/lib/fetchData";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user?.email) {
    notFound();
  }

  const chat = await getChat(id);
  if (!chat) {
    notFound();
  }

  console.log({chats : chat.messages});
  

  const user = await getUser(session.user.email);

  return (
    <div className="w-full h-screen">
      <ResumeChat
        email={session.user.email}
        id={id}
        chat={chat}
        userId={user?._id}
      />
    </div>
  );
}
