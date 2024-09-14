import NewChat from "@/components/chat/NewChat";
import { auth } from "@/auth";
import { fetchHistory } from "@/lib/fetchData";
import { getUser } from "@/lib/fetchData";
import { userType } from "@/lib/types";

export default async function page() {
  const session = await auth();
  const user = await getUser(session?.user?.email!); 

  // const history = await fetchHistory(user?._id!);
  // const newestChatId = history[0]?.chatId;

  return (
    <div>
      <NewChat
        email={session?.user?.email!}
        username={user?.firstName!}
      />
    </div>
  );
}
