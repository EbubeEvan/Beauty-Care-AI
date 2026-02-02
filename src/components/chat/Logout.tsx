import { LogOut } from 'lucide-react';

import { logout } from '@/lib/actions';

const Logout = () => {
  return (
    <form action={logout}>
      <button type='submit' className='flex gap-3 p-3 pl-6 text-red-500 hover:opacity-70'>
        <LogOut size={20} className='w-6' />
        <p>Log out</p>
      </button>
    </form>
  );
};

export default Logout;
