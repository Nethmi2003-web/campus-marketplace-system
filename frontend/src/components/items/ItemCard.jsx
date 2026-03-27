import React from 'react';
import styles from './ItemCard.module.css';

const statusClassMap = {
  Available: styles.statusAvailable,
  Sold: styles.statusSold,
  Reserved: styles.statusReserved,
};

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=900&q=80';

function normalizeImageCandidate(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  return trimmed.replace(/\\/g, '/');
}

function resolveItemImage(item) {
  if (Array.isArray(item?.images)) {
    for (const imageEntry of item.images) {
      const direct = normalizeImageCandidate(imageEntry);
      if (direct) {
        return direct;
      }

      if (imageEntry && typeof imageEntry === 'object') {
        const resolved =
          normalizeImageCandidate(imageEntry.url)
          || normalizeImageCandidate(imageEntry.secure_url)
          || normalizeImageCandidate(imageEntry.imageUrl)
          || normalizeImageCandidate(imageEntry.path)
          || normalizeImageCandidate(imageEntry.src);

        if (resolved) {
          return resolved;
        }
      }
    }
  }

  const singleImage =
    normalizeImageCandidate(item?.imageUrl)
    || normalizeImageCandidate(item?.image)
    || normalizeImageCandidate(item?.thumbnail);

  if (singleImage) {
    return singleImage;
  }

  return PLACEHOLDER_IMAGE;
}

function getSellerName(seller) {
  if (!seller) {
    return 'Unknown Seller';
  }

  const composedName = `${seller.firstName || ''} ${seller.lastName || ''}`.trim();
  if (composedName) {
    return composedName;
  }

  return seller.universityEmail || 'Unknown Seller';
}

function ItemCard({ item, onClick }) {
  const imageUrl = resolveItemImage(item);
  const title = item?.title || 'Untitled Item';
  const category = item?.category || 'Other';
  const statusValue = String(item?.status || 'Available').toLowerCase();
  const status = statusValue === 'sold' ? 'Sold' : statusValue === 'reserved' ? 'Reserved' : 'Available';
  const isAvailable = status === 'Available';

  const handleClick = () => {
    if (!isAvailable) {
      return;
    }
    onClick(item._id);
  };

  return (
    <article
      className={`${styles.card} ${!isAvailable ? styles.cardDisabled : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={isAvailable ? 0 : -1}
      onKeyDown={(event) => {
        if (isAvailable && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          handleClick();
        }
      }}
      aria-disabled={!isAvailable}
    >
      <div className={styles.imageWrapper}>
        <img src={imageUrl} alt={title} className={styles.image} />
        {!isAvailable && (
          <div className={`${styles.diagonalOverlay} ${status === 'Sold' ? styles.overlaySold : styles.overlayReserved}`}>
            {status === 'Sold' ? 'SOLD' : 'RESERVED'}
          </div>
        )}
        <div className={styles.badges}>
          <span className={styles.categoryBadge}>{category}</span>
          <span className={`${styles.statusBadge} ${statusClassMap[status] || styles.statusAvailable}`}>
            {status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.price}>LKR {Number(item?.price || 0).toLocaleString()}</p>
        <p className={styles.seller}>Sold by {getSellerName(item?.seller)}</p>
      </div>
    </article>
  );
}

export default ItemCard;
