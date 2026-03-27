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
  const status = item?.status || 'Available';

  return (
    <article className={styles.card} onClick={() => onClick(item._id)}>
      <div className={styles.imageWrapper}>
        <img src={imageUrl} alt={title} className={styles.image} />
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
