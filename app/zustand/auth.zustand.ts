import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

interface AuthState {
  accessToken: string;
  refreshToken: string;
}

interface AuthAction {
  updateAuth: (authState: AuthState) => void;
}

export const storage = new MMKV();

const MMKVStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: name => {
    return storage.getString(name) ?? '';
  },
  removeItem: name => {
    return storage.delete(name);
  },
};

export const zustandAuth = create<AuthState & AuthAction>()(
  persist(
    set => ({
      accessToken: '',
      refreshToken: '',
      updateAuth: (authState: AuthState) => set(authState),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => MMKVStorage),
    },
  ),
);
