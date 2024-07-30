import NewChat from "@/components/chat/NewChat"
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'chat',
  };

export default function page() {

  return (
    <div>
      <NewChat/>
    </div>
  )
}
