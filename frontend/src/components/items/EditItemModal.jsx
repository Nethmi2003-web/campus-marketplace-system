import React, { useEffect, useRef, useState } from 'react';
import { updateItem } from '../../services/itemService';

const CATEGORY_OPTIONS = [
  'Books',
  'Electronics',
  'Lab Equipment',
  'Clothing & Uniforms',
  'Sports & Fitness',
  'Services & Tutoring',
  'Other',
];

const CONDITION_OPTIONS = ['Brand New', 'Like New', 'Good', 'Fair', 'Poor'];
const STATUS_OPTIONS = ['Available', 'Reserved', 'Sold'];
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/webp'];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const normalizeStatus = (status = '') => {
  const lowered = String(status || '').toLowerCase();
  if (lowered === 'available') return 'Available';
  if (lowered === 'reserved') return 'Reserved';
  if (lowered === 'sold') return 'Sold';
  return 'Available';
};

const normalizeCondition = (condition = '') => {
  const lowered = String(condition || '').toLowerCase();
  if (lowered === 'used') return 'Good';
  return condition || '';
};

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown date';
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

function EditItemModal({ item, isOpen, onClose, onUpdated }) {
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState('Available');
  const [existingImages, setExistingImages] = useState([]);
  const [removeImages, setRemoveImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (!item) return;

    const images = Array.isArray(item.images) && item.images.length > 0
      ? item.images
      : item.imageUrl
        ? [item.imageUrl]
        : [];

    setTitle(item.title || '');
    setCategory(item.category || '');
    setCondition(normalizeCondition(item.condition || ''));
    setDescription(item.description || '');
    setPrice(String(item.price ?? ''));
    setStatus(normalizeStatus(item.status || 'Available'));
    setExistingImages(images);
    setRemoveImages([]);
    setNewImages([]);
    setNewImagePreviews([]);
    setErrors({});
    setSubmitError('');
    setUploadError('');
  }, [item]);

  useEffect(() => {
    return () => {
      newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newImagePreviews]);

  if (!isOpen || !item) return null;

  const fieldStyle = (fieldKey) => ({
    width: '100%',
    border: `1.5px solid ${errors[fieldKey] ? '#ef4444' : '#e5e7eb'}`,
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '15px',
    color: '#111827',
    outline: 'none',
    boxSizing: 'border-box',
  });

  const labelStyle = {
    fontSize: '13px',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '6px',
    display: 'block',
  };

  const remainingExisting = existingImages.filter((img) => !removeImages.includes(img));
  const totalAfterChanges = remainingExisting.length + newImages.length;
  const canAddMore = totalAfterChanges < 4;

  const validateAndCollectImages = (files) => {
    const availableSlots = 4 - (remainingExisting.length + newImages.length);
    const incoming = Array.from(files || []).slice(0, Math.max(0, availableSlots));

    const validFiles = [];
    for (const file of incoming) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setUploadError('Only JPEG/JPG/WEBP images are allowed.');
        continue;
      }
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        setUploadError('Each image must be 5MB or less.');
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      setUploadError('');
      setNewImages((prev) => [...prev, ...validFiles].slice(0, 4));
      const previews = validFiles.map((file) => URL.createObjectURL(file));
      setNewImagePreviews((prev) => [...prev, ...previews].slice(0, 4));
    }
  };

  const removeNewImageAt = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => {
      const next = [...prev];
      const removed = next[index];
      if (removed) URL.revokeObjectURL(removed);
      next.splice(index, 1);
      return next;
    });
  };

  const handleSubmit = async () => {
    const newErrors = {};

    if (!title.trim() || title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }
    if (title.trim().length > 100) {
      newErrors.title = 'Title must be less than or equal to 100 characters';
    }
    if (!category) {
      newErrors.category = 'Please select a category';
    }
    if (!condition) {
      newErrors.condition = 'Please select a condition';
    }
    if (!description.trim() || description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }
    if (description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less';
    }
    if (!price || Number(price) <= 0) {
      newErrors.price = 'Please enter a valid price greater than 0';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('price', String(price));
    formData.append('category', category);
    formData.append('condition', normalizeCondition(condition));
    formData.append('status', normalizeStatus(status));
    formData.append('removeImages', JSON.stringify(removeImages));
    newImages.forEach((file) => formData.append('images', file));

    try {
      setSubmitting(true);
      setSubmitError('');
      const updated = await updateItem(item._id, formData);
      onUpdated(updated);
    } catch (err) {
      setSubmitError(err?.response?.data?.message || 'Failed to save changes. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const hasUnsavedChanges = () => {
    const baseImages = Array.isArray(item.images) && item.images.length > 0
      ? item.images
      : item.imageUrl
        ? [item.imageUrl]
        : [];

    return (
      title !== (item.title || '')
      || category !== (item.category || '')
      || condition !== normalizeCondition(item.condition || '')
      || description !== (item.description || '')
      || String(price) !== String(item.price ?? '')
      || status !== normalizeStatus(item.status || 'Available')
      || removeImages.length > 0
      || newImages.length > 0
      || baseImages.length !== existingImages.length
    );
  };

  const handleDiscard = () => {
    if (!hasUnsavedChanges()) {
      onClose();
      return;
    }
    const ok = window.confirm('You have unsaved changes. Discard them?');
    if (ok) {
      onClose();
    }
  };

  const truncatedTitle = title.length > 35 ? `${title.slice(0, 35)}...` : title;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.55)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
      role="presentation"
    >
      <div
        style={{
          background: '#ffffff',
          width: '620px',
          maxWidth: '95vw',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div
          style={{
            padding: '24px 28px 16px',
            borderBottom: '1px solid #e5e7eb',
            position: 'sticky',
            top: 0,
            background: '#ffffff',
            zIndex: 10,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>Editing: {truncatedTitle || 'Untitled item'}</p>
            <h3 style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: 700, color: '#0f1b3d' }}>Edit Listing</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              fontSize: '22px',
              color: '#9ca3af',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; }}
            aria-label="Close"
          >
            x
          </button>
        </div>

        <div style={{ padding: '24px 28px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Item Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={fieldStyle('title')}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#f97316';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.title ? '#ef4444' : '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            {errors.title && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.title}</p>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={fieldStyle('category')}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#f97316';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.category ? '#ef4444' : '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <option value="">Select category</option>
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {errors.category && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.category}</p>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Condition *</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {CONDITION_OPTIONS.map((opt) => {
                const selected = condition === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setCondition(opt)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      background: selected ? '#f97316' : '#ffffff',
                      border: `1.5px solid ${selected ? '#f97316' : '#e5e7eb'}`,
                      color: selected ? '#ffffff' : '#374151',
                      fontWeight: selected ? 600 : 500,
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {errors.condition && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.condition}</p>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Description *</label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ ...fieldStyle('description'), resize: 'vertical' }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#f97316';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.description ? '#ef4444' : '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
              <span
                style={{
                  fontSize: '12px',
                  color: description.length > 480 ? '#ef4444' : description.length > 400 ? '#ca8a04' : '#9ca3af',
                }}
              >
                {description.length} / 500
              </span>
            </div>
            {errors.description && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.description}</p>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Price (LKR) *</label>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '14px',
                  color: '#6b7280',
                  fontWeight: 500,
                  pointerEvents: 'none',
                }}
              >
                LKR
              </span>
              <input
                type="number"
                min="1"
                max="500000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={{ ...fieldStyle('price'), paddingLeft: '52px' }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#f97316';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.price ? '#ef4444' : '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
            {errors.price && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.price}</p>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Availability Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={fieldStyle('status')}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#f97316';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0 0' }}>
              Marking as 'Sold' will hide this item from marketplace
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <p style={{ ...labelStyle, marginBottom: '8px' }}>Current Photos</p>
            {existingImages.length === 0 ? (
              <div
                style={{
                  fontSize: '13px',
                  color: '#9ca3af',
                  textAlign: 'center',
                  padding: '16px',
                  border: '2px dashed #e5e7eb',
                  borderRadius: '10px',
                }}
              >
                No photos uploaded for this listing
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {existingImages.map((imageUrl) => {
                  const marked = removeImages.includes(imageUrl);
                  return (
                    <div key={imageUrl} style={{ position: 'relative', width: '88px', height: '88px', flexShrink: 0 }}>
                      <img
                        src={imageUrl}
                        alt="listing"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '10px',
                          border: '1.5px solid #e5e7eb',
                          opacity: marked ? 0.3 : 1,
                        }}
                      />
                      {marked ? (
                        <>
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              background: 'rgba(239,68,68,0.15)',
                              borderRadius: '10px',
                              border: '2px solid #ef4444',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: 700, textAlign: 'center' }}>Remove</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setRemoveImages((prev) => prev.filter((img) => img !== imageUrl))}
                            style={{
                              position: 'absolute',
                              top: '-7px',
                              right: '-7px',
                              width: '22px',
                              height: '22px',
                              borderRadius: '50%',
                              background: '#16a34a',
                              color: '#ffffff',
                              fontSize: '13px',
                              fontWeight: 700,
                              border: '2px solid #ffffff',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            ↩
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setRemoveImages((prev) => [...prev, imageUrl])}
                          style={{
                            position: 'absolute',
                            top: '-7px',
                            right: '-7px',
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            background: '#ef4444',
                            color: '#ffffff',
                            fontSize: '13px',
                            fontWeight: 700,
                            border: '2px solid #ffffff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          x
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '8px' }}>
            <p style={{ ...labelStyle, marginBottom: '8px' }}>
              Add More Photos <span style={{ color: '#9ca3af', fontWeight: 500 }}>(optional)</span>
            </p>

            {!canAddMore ? (
              <div
                style={{
                  border: '2px dashed #e5e7eb',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center',
                  background: '#fafafa',
                  opacity: 0.5,
                  cursor: 'not-allowed',
                  color: '#9ca3af',
                  fontSize: '13px',
                }}
              >
                Maximum 4 photos reached
              </div>
            ) : (
              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  validateAndCollectImages(e.dataTransfer.files);
                }}
                style={{
                  border: `2px dashed ${isDragOver ? '#f97316' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center',
                  background: isDragOver ? '#fff7ed' : '#fafafa',
                  cursor: 'pointer',
                }}
              >
                <p style={{ fontSize: '24px', color: '#9ca3af', margin: 0 }}>📷</p>
                <p style={{ fontSize: '13px', color: '#9ca3af', margin: '6px 0 0' }}>Drop photos here or click to upload</p>
                <p style={{ fontSize: '11px', color: '#d1d5db', margin: '4px 0 0' }}>JPEG, JPG, WEBP • Max 5MB each</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpeg,.jpg,.webp,image/jpeg,image/jpg,image/webp"
                  multiple
                  style={{ display: 'none' }}
                  onChange={(e) => validateAndCollectImages(e.target.files)}
                />
              </div>
            )}

            {uploadError && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px' }}>{uploadError}</p>}

            {newImagePreviews.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                {newImagePreviews.map((previewUrl, idx) => (
                  <div key={`${previewUrl}-${idx}`} style={{ position: 'relative', width: '88px', height: '88px', flexShrink: 0 }}>
                    <img
                      src={previewUrl}
                      alt={`new-${idx}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '10px',
                        border: '1.5px solid #e5e7eb',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImageAt(idx)}
                      style={{
                        position: 'absolute',
                        top: '-7px',
                        right: '-7px',
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: '#ef4444',
                        color: '#ffffff',
                        fontSize: '13px',
                        fontWeight: 700,
                        border: '2px solid #ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            padding: '16px 28px 24px',
            borderTop: '1.5px solid #f3f4f6',
            position: 'sticky',
            bottom: 0,
            background: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontSize: '12px', color: '#9ca3af' }}>Listed on {formatDate(item.createdAt)}</span>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleDiscard}
              style={{
                height: '40px',
                padding: '0 20px',
                background: '#ffffff',
                border: '1.5px solid #e5e7eb',
                borderRadius: '8px',
                color: '#6b7280',
                fontSize: '14px',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#374151';
                e.currentTarget.style.color = '#374151';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.color = '#6b7280';
              }}
            >
              Discard
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                height: '40px',
                padding: '0 24px',
                background: submitting ? '#fed7aa' : '#f97316',
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '14px',
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!submitting) e.currentTarget.style.background = '#ea6c00';
              }}
              onMouseLeave={(e) => {
                if (!submitting) e.currentTarget.style.background = '#f97316';
              }}
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {submitError && (
            <p style={{ width: '100%', margin: 0, color: '#ef4444', fontSize: '13px', textAlign: 'right' }}>
              {submitError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditItemModal;
