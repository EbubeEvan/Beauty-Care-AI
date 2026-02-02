import { auth } from '@/auth';
import ResumeChat from '@/components/chat/ResumeChat';
import { getChat, getUser } from '@/lib/fetchData';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
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

  return (
    <div className='h-screen w-full'>
      <ResumeChat email={session?.user?.email || ''} id={id} chat={chat} userId={user?._id} />
    </div>
  );
}
