import { auth } from "@/auth";
import ResumeChat from "@/components/chat/ResumeChat";
import { getUser } from "@/lib/fetchData";
import { getChat } from "@/lib/fetchData";

export default async function page({ params }: { params: { id: string } }) {
  const {id} = params

  const chat = await getChat(id)
  console.log({chat});

  const session = await auth();
  const user = await getUser(session?.user?.email!);

  return (
    <div>
      <ResumeChat email={session?.user?.email!} id={id} chat={chat} userId={user?._id}/>
    </div>
  );
}
