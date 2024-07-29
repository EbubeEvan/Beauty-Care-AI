import { create, StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

interface UserDetailsType {
  id: string;
  setId: (data: string) => void;
}

// Define the store type including persist options
type MyPersist = (
  config: StateCreator<UserDetailsType>,
  options: PersistOptions<UserDetailsType>
) => StateCreator<UserDetailsType>;

const useStore = create<UserDetailsType>(
  (persist as MyPersist)(
    (set) => ({
      id: '',
      setId: (data: string) => set({ id: data }),
    }),
    {
      name: 'user-storage',
    }
  )
);

export default useStore;
