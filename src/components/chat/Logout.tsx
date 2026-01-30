import { LogOut } from "lucide-react";
import { logout } from "@/lib/actions";

const Logout = () => {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="text-red-500 p-3 pl-6 flex gap-3 hover:opacity-70"
      >
        <LogOut size={20} className="w-6" />
        <p>Log out</p>
      </button>
    </form>
  );
};

export default Logout;
