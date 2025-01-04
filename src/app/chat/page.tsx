import NewChat from "@/components/chat/NewChat";
import { auth } from "@/auth";
import { getUser } from "@/lib/fetchData";

export default async function page() {
  const session = await auth();
  const user = await getUser(session?.user?.email!); 

  return (
    <div className="w-full h-full">
      <NewChat
        username={user?.firstName!}
      />
    </div>
  );
}
