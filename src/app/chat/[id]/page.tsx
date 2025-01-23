import { auth } from "@/auth";
import ResumeChat from "@/components/chat/ResumeChat";
import { getUser, getChat } from "@/lib/fetchData";

export default async function page({ params }: { params: { id: string } }) {
  const {id} = params

  const chat = await getChat(id)
  console.log({chat});

  const session = await auth();
  const user = await getUser(session?.user?.email!);

  return (
    <div className="w-full h-screen">
      <ResumeChat email={session?.user?.email!} id={id} chat={chat} userId={user?._id}/>
    </div>
  );
}