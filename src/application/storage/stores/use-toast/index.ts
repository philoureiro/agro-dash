import { ToastConfig, ToastData, ToastOptions } from '@components';
import { create } from 'zustand';

interface ToastStore {
  toasts: ToastData[];
  config: ToastConfig;

  // Actions
  addToast: (options: ToastOptions) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
  updateConfig: (config: Partial<ToastConfig>) => void;
}

const defaultConfig: ToastConfig = {
  position: 'top-right',
  maxToasts: 5,
  defaultDuration: 5000,
  animationDuration: 300,
};

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  config: defaultConfig,

  addToast: (options) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const { config } = get();

    const newToast: ToastData = {
      id,
      type: 'info',
      duration: config.defaultDuration,
      ...options,
    };

    set((state) => {
      const updatedToasts = [newToast, ...state.toasts];

      // Limita o número máximo de toasts
      if (updatedToasts.length > config.maxToasts) {
        return {
          toasts: updatedToasts.slice(0, config.maxToasts),
        };
      }

      return { toasts: updatedToasts };
    });

    // Auto-remove se tiver duração definida
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, newToast.duration);
    }

    return id;
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  clearAll: () => {
    set({ toasts: [] });
  },

  updateConfig: (newConfig) => {
    set((state) => ({
      config: { ...state.config, ...newConfig },
    }));
  },
}));
