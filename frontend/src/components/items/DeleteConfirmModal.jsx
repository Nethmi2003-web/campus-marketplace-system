import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { deleteItem } from '../../services/itemService';

function DeleteConfirmModal({ item, isOpen, onClose, onDeleted }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !item) {
    return null;
  }

  const handleDelete = async () => {
    try {
      setSubmitting(true);
      setError('');
      await deleteItem(item._id);
      onDeleted?.(item._id);
      onClose?.();
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to delete listing. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        padding: '16px',
      }}
      onClick={onClose}
      role="presentation"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 18px 42px rgba(15, 23, 42, 0.22)',
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
          <AlertTriangle size={30} color="#ef4444" />
        </div>

        <h3
          style={{
            margin: '0 0 8px',
            color: '#0f1b3d',
            textAlign: 'center',
            fontSize: '22px',
            fontWeight: 800,
          }}
        >
          Delete Listing?
        </h3>

        <p style={{ margin: 0, color: '#6b7280', textAlign: 'center', fontSize: '14px', lineHeight: 1.6 }}>
          Are you sure you want to delete {item.title}? This action cannot be undone and the listing will be
          permanently removed from the marketplace.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '22px' }}>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            style={{
              border: '1px solid #d1d5db',
              background: '#ffffff',
              color: '#374151',
              borderRadius: '8px',
              padding: '10px 14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={submitting}
            style={{
              border: '1px solid #ef4444',
              background: '#ef4444',
              color: '#ffffff',
              borderRadius: '8px',
              padding: '10px 14px',
              fontWeight: 600,
              cursor: 'pointer',
              opacity: submitting ? 0.8 : 1,
            }}
          >
            {submitting ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>

        {error && <p style={{ color: '#ef4444', fontSize: '13px', margin: '10px 0 0' }}>{error}</p>}
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
