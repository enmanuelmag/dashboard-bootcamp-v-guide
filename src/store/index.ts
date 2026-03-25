import type { Store } from '#/types/store';
import { create } from 'zustand';

type StoreFields = Pick<Store, 'statusFilter' | 'theme'>;

const initialState: StoreFields = {
  statusFilter: null,
  theme: 'light',
};

export const useAppStore = create<Store>((set) => {
  return {
    statusFilter:
      (localStorage.getItem('statusFilter') as Store['statusFilter']) ||
      initialState.statusFilter,
    theme:
      (localStorage.getItem('theme') as Store['theme']) || initialState.theme,

    setStatusFilter: (newStatusFilter) => {
      set({ statusFilter: newStatusFilter });
      if (newStatusFilter) {
        localStorage.setItem('statusFilter', newStatusFilter);
      } else {
        localStorage.removeItem('statusFilter');
      }
    },

    setTheme: (newTheme) => {
      set({ theme: newTheme });
      localStorage.setItem('theme', newTheme);
    },
  };
});
