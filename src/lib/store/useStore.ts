import { create, StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

interface UserDetailsType {
  id: string;
  setId: (data: string) => void;
  newPrompt: string | null;
  setNewPrompt: (data: string | null) => void;
  first: boolean;
  setFirst: (data: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (data: boolean) => void;
  messageCount: number;
  setMessageCount: (data : number) => void;
  credits: number;
  setCredits: (data : number) => void;
}

// Define the store type including persist options
type MyPersist = (
  config: StateCreator<UserDetailsType>,
  options: PersistOptions<UserDetailsType>
) => StateCreator<UserDetailsType>;

const useStore = create<UserDetailsType>(
  (persist as MyPersist)(
    (set) => ({
      id: "",
      setId: (data: string) => set({ id: data }),
      newPrompt: null,
      setNewPrompt: (data: string | null) => set({ newPrompt: data }),
      first: false,
      setFirst: (data: boolean) => set({ first: data }),
      messageCount: 0,
      setMessageCount: (data: number) => set({ messageCount: data }),
      menuOpen: false,
      setMenuOpen: (data: boolean) => set({ menuOpen: data }),
      credits: 0,
      setCredits: (data: number) => set({ credits: data }),
    }),
    {
      name: "user-storage",
    }
  )
);

export default useStore;
