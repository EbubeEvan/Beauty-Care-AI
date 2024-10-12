import NewChat from "@/components/chat/NewChat";
import { auth } from "@/auth";
import { getUser } from "@/lib/fetchData";

export default async function page() {
  const session = await auth();
  const user = await getUser(session?.user?.email!); 

  return (
    <div>
      <NewChat
        email={session?.user?.email!}
        username={user?.firstName!}
      />
    </div>
  );
}
