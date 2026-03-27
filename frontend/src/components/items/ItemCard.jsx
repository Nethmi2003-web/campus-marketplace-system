import React from 'react';
import styles from './ItemCard.module.css';

const statusClassMap = {
  Available: styles.statusAvailable,
  Sold: styles.statusSold,
  Reserved: styles.statusReserved,
};

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=900&q=80';

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
  const imageUrl = item?.images?.[0] || PLACEHOLDER_IMAGE;
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
