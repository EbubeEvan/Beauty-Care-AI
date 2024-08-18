import { auth } from "@/auth";
import ResumeChat from "@/components/chat/ResumeChat";
import { getUser } from "@/lib/fetchData";

export default async function page() {
  const session = await auth();
  const user = await getUser(session?.user?.email!);

  return (
    <div>
      <ResumeChat email={session?.user?.email!} />
    </div>
  );
}
