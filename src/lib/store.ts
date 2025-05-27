import { create } from 'zustand';
import { Image, Battle, User } from '../types';

interface AppState {
  user: User | null;
  currentImage: Image | null;
  battles: Battle[];
  topImages: Image[];
  loading: boolean;
  error: string | null;
  
  // 액션
  setUser: (user: User | null) => void;
  setCurrentImage: (image: Image | null) => void;
  addBattle: (battle: Battle) => void;
  setTopImages: (images: Image[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  currentImage: null,
  battles: [],
  topImages: [],
  loading: false,
  error: null,
  
  // 액션 구현
  setUser: (user) => set({ user }),
  setCurrentImage: (image) => set({ currentImage: image }),
  addBattle: (battle) => set((state) => ({ battles: [battle, ...state.battles] })),
  setTopImages: (images) => set({ topImages: images }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
})); 