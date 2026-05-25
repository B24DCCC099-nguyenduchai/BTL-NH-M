import type { ToastType, ToastMessage } from '../types';

let toastId = 0;
export const toastListeners = new Set<(t: ToastMessage & { remove?: boolean }) => void>();

export function addToast(message: string, type: ToastType = 'info') {
  const id = ++toastId;
  toastListeners.forEach((fn) => fn({ id, message, type }));
  setTimeout(() => {
    toastListeners.forEach((fn) => fn({ id, message, type, remove: true }));
  }, 3500);
}
