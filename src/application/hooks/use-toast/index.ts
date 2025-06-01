import { ToastOptions } from '@components';
import { useToastStore } from '@storage';

// 🎯 HOOK PRINCIPAL
export const useToast = () => {
  const { addToast, removeToast, clearAll, updateConfig } = useToastStore();

  const toast = {
    success: (title: string, message?: string, options?: Partial<ToastOptions>) =>
      addToast({ type: 'success', title, message, ...options }),

    error: (title: string, message?: string, options?: Partial<ToastOptions>) =>
      addToast({ type: 'error', title, message, ...options }),

    warning: (title: string, message?: string, options?: Partial<ToastOptions>) =>
      addToast({ type: 'warning', title, message, ...options }),

    info: (title: string, message?: string, options?: Partial<ToastOptions>) =>
      addToast({ type: 'info', title, message, ...options }),

    custom: (options: ToastOptions) => addToast(options),

    remove: removeToast,

    clear: clearAll,

    // Helpers para casos comuns
    promise: async <T>(
      promise: Promise<T>,
      {
        loading = 'Carregando...',
        success = 'Sucesso!',
        error = 'Erro!',
      }: {
        loading?: string;
        success?: string | ((data: T) => string);
        error?: string | ((error: unknown) => string);
      },
    ): Promise<T> => {
      const loadingId = addToast({
        type: 'info',
        title: loading,
        duration: 0, // Não remove automaticamente
      });

      try {
        const result = await promise;
        removeToast(loadingId);

        const successMessage = typeof success === 'function' ? success(result) : success;
        addToast({
          type: 'success',
          title: successMessage,
        });

        return result;
      } catch (err) {
        removeToast(loadingId);

        const errorMessage = typeof error === 'function' ? error(err) : error;
        addToast({
          type: 'error',
          title: errorMessage,
        });

        throw err;
      }
    },
  };

  return { toast, updateConfig };
};

// 🎯 HOOKS ESPECÍFICOS
export const useToastConfig = () => {
  const { config, updateConfig } = useToastStore();
  return { config, updateConfig };
};
