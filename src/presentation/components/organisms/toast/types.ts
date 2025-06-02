export interface ToastData {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number; // em ms, 0 = não remove automaticamente
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

export interface ToastOptions {
  type?: ToastData['type'];
  title: string;
  message?: string;
  duration?: number;
  action?: ToastData['action'];
  onClose?: () => void;
}

export interface ToastConfig {
  position:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center';
  maxToasts: number;
  defaultDuration: number;
  animationDuration: number;
}
