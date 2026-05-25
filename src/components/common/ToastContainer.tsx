import React, { useState, useEffect } from 'react';
import { toastListeners } from '../../utils/toast';
import type { ToastMessage } from '../../types';

const icons: Record<string, string> = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
  warning: '⚠️',
};

const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const fn = (t: ToastMessage & { remove?: boolean }) => {
      if (t.remove) {
        setToasts((p) => p.filter((x) => x.id !== t.id));
      } else {
        setToasts((p) => [...p, t]);
      }
    };
    toastListeners.add(fn);
    return () => { toastListeners.delete(fn); };
  }, []);

  if (!toasts.length) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="slide-in"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 18px',
            borderRadius: 10,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-lg)',
            fontSize: 14,
            maxWidth: 360,
            borderLeft: `4px solid var(--${t.type === 'success' ? 'success' : t.type === 'error' ? 'danger' : t.type === 'warning' ? 'warn' : 'pri'})`,
          }}
        >
          <span>{icons[t.type]}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
