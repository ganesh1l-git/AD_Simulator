import { create } from 'zustand';

interface ToastNotification {
  id: string;
  message: string;
  type: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING';
}

interface UIState {
  sidebarCollapsed: boolean;
  activeModal: string | null;
  comparisonList: string[]; // Air defence system IDs
  toasts: ToastNotification[];
  
  // Actions
  toggleSidebar: () => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  addToComparison: (systemId: string) => void;
  removeFromComparison: (systemId: string) => void;
  clearComparison: () => void;
  addToast: (message: string, type?: ToastNotification['type']) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  activeModal: null,
  comparisonList: [],
  toasts: [],

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),
  
  addToComparison: (systemId) => set((state) => {
    if (state.comparisonList.includes(systemId)) return state;
    if (state.comparisonList.length >= 3) {
      // Limit to 3 comparison elements
      return state;
    }
    return { comparisonList: [...state.comparisonList, systemId] };
  }),

  removeFromComparison: (systemId) => set((state) => ({
    comparisonList: state.comparisonList.filter(id => id !== systemId)
  })),

  clearComparison: () => set({ comparisonList: [] }),

  addToast: (message, type = 'INFO') => {
    const id = `toast-${Date.now()}`;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }]
    }));

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter(t => t.id !== id)
      }));
    }, 4000);
  },

  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id)
  }))
}));
