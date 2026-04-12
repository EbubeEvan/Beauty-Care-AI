import { auth } from '@/auth';
import ResumeChat from '@/components/chat/ResumeChat';
import { getChat, getUser } from '@/lib/fetchData';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Readonly<PageProps>) {
  const { id } = await params;

  console.log('=== PAGE COMPONENT ===');
  console.log('URL param ID:', id);

  const chat = await getChat(id);
  console.log('Chat found:', !!chat);
  if (chat) {
    console.log('Chat ID from DB:', chat.chatId);
    console.log('Chat messages count:', chat.messages?.length || 0);
  }

  const session = await auth();
  const user = await getUser(session?.user?.email || '');
  const initialChat = chat ? { messages: chat.messages } : null;

  return (
    <div className='bg-surface text-text-main h-full w-full overflow-hidden transition-colors duration-300'>
      <ResumeChat
        email={session?.user?.email || ''}
        id={id}
        chat={initialChat}
        userId={user?._id}
      />
    </div>
  );
}
