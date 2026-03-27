import React, { useEffect } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';

  return (
    <>
      <style>
        {`@keyframes toastSlideIn { from { opacity: 0; transform: translateX(28px); } to { opacity: 1; transform: translateX(0); } }`}
      </style>
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1200,
          background: '#ffffff',
          borderRadius: '12px',
          padding: '16px 20px',
          borderLeft: `4px solid ${isSuccess ? '#16a34a' : '#ef4444'}`,
          boxShadow: '0 12px 28px rgba(15, 23, 42, 0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          minWidth: '260px',
          animation: 'toastSlideIn 0.25s ease-out',
        }}
      >
        {isSuccess ? <CheckCircle2 size={18} color="#16a34a" /> : <XCircle size={18} color="#ef4444" />}
        <span style={{ color: '#0f1b3d', fontSize: '14px', fontWeight: 600 }}>{message}</span>
      </div>
    </>
  );
}

export default Toast;
