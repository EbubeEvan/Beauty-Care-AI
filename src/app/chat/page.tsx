import NewChat from "@/components/chat/NewChat";
import { auth } from "@/auth";
import { fetchHistory } from "@/lib/fetchData";
import { getUser } from "@/lib/fetchData";
import { userType } from "@/lib/types";

export default async function page() {
  const session = await auth();
  const user = await getUser(session?.user?.email!);

  const parsedUser: userType = JSON.parse(JSON.stringify(user));  

  const history = await fetchHistory(session?.user?.id!);
  const newestChatId = history[0]?.chatId;

  return (
    <div>
      <NewChat
        email={session?.user?.email!}
        newChatId={newestChatId}
        username={parsedUser?.firstName!}
      />
    </div>
  );
}
