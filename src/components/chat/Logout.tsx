import React from 'react'
import { LogOut } from 'lucide-react';
import { logout } from '@/lib/actions';

const Logout = () => {
  return (
    <form  action={logout}>
      <button className="hover:bg-pink-300 dark:hover:bg-purple-400 rounded-full text-white p-3">
        <LogOut size={20} className="w-6" />
      </button>
    </form>
  )
}

export default Logout