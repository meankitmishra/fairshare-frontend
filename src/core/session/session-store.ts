import { create } from 'zustand';

export type SessionStatus = 'unauthenticated' | 'authenticated';

type SessionState = {
  status: SessionStatus;
  signInDev: () => void;
  signOut: () => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  status: 'unauthenticated',
  signInDev: () => set({ status: 'authenticated' }),
  signOut: () => set({ status: 'unauthenticated' }),
}));