import { create } from 'zustand';

interface UIState {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    language: 'ar' | 'en';
    setLanguage: (lang: 'ar' | 'en') => void;
}

export const useUIStore = create<UIState>((set) => ({
    isModalOpen: false,
    openModal: () => set({ isModalOpen: true }),
    closeModal: () => set({ isModalOpen: false }),
    language: 'ar',
    setLanguage: (language) => set({ language }),
}));
