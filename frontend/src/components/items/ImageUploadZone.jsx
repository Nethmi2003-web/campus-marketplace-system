import React, { useRef } from 'react';
import { Camera, ImagePlus, X } from 'lucide-react';
import styles from './ImageUploadZone.module.css';

const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const maxBytes = 5 * 1024 * 1024;

function ImageUploadZone({
  label,
  file,
  error,
  onFileChange,
  onRemove,
  compact = false,
}) {
  const inputRef = useRef(null);

  const validateAndSend = (candidate) => {
    if (!candidate) {
      onFileChange(null, 'Please upload at least one clear image of your item');
      return;
    }

    if (!allowedTypes.includes(candidate.type)) {
      onFileChange(null, 'Only JPG, JPEG, PNG, and WEBP files are allowed');
      return;
    }

    if (candidate.size > maxBytes) {
      onFileChange(null, 'Image size must be 5MB or less');
      return;
    }

    onFileChange(candidate, '');
  };

  const handleDrop = (event) => {
    event.preventDefault();
    validateAndSend(event.dataTransfer.files?.[0]);
  };

  const handleFileInput = (event) => {
    validateAndSend(event.target.files?.[0]);
  };

  return (
    <div className={compact ? styles.compactWrapper : styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <div
        className={[
          styles.zone,
          compact ? styles.compact : '',
          error ? styles.errorBorder : '',
        ].join(' ')}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      >
        {!file && (
          <>
            {compact ? <ImagePlus size={20} color="#f97316" /> : <Camera size={28} color="#f97316" />}
            {!compact && (
              <>
                <p className={styles.mainText}>Drag & drop your item photo here</p>
                <p className={styles.subText}>or click to browse - JPG, PNG, WEBP up to 5MB</p>
              </>
            )}
          </>
        )}

        {file && (
          <div className={styles.previewWrap}>
            <img src={URL.createObjectURL(file)} alt="preview" className={styles.preview} />
            <button
              type="button"
              className={styles.removeBtn}
              onClick={(event) => {
                event.stopPropagation();
                onRemove();
              }}
            >
              <X size={14} />
            </button>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          className={styles.hiddenInput}
          onChange={handleFileInput}
        />
      </div>
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
}

export default ImageUploadZone;
