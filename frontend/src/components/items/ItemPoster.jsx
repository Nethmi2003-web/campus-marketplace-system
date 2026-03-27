import React from 'react';
import styles from './ItemPoster.module.css';

function formatDate(value) {
  const date = value ? new Date(value) : new Date();
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function ItemPoster({ item, currentUser }) {
  const firstImage = item?.images?.[0] || item?.imageUrl || 'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=80';
  const sellerName = item?.seller
    ? `${item.seller.firstName || ''} ${item.seller.lastName || ''}`.trim()
    : `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim() || 'SLIIT Student';
  const faculty = currentUser?.faculty || 'Faculty';

  return (
    <div className={styles.poster}>
      <div className={styles.topStrip} />

      <div className={styles.header}>
        <div>
          <p className={styles.brandTop}>SLIIT MARKETPLACE</p>
          <p className={styles.brandSub}>DIGITAL CAMPUS</p>
        </div>
        <div className={styles.saleTag}>FOR SALE</div>
      </div>

      <div className={styles.divider} />

      <div className={styles.imageSection}>
        <img src={firstImage} alt={item?.title || 'Item image'} className={styles.mainImage} />
      </div>

      <div className={styles.divider} />

      <div className={styles.body}>
        <h1 className={styles.title}>{item?.title || 'Marketplace Item'}</h1>

        <div className={styles.badges}>
          <span className={styles.badge}>{item?.category || 'Other'}</span>
          <span className={styles.badge}>{item?.condition || 'N/A'}</span>
        </div>

        <p className={styles.description}>{item?.description || ''}</p>

        <p className={styles.price}>LKR {Number(item?.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>

        <p className={styles.meta}>Seller: {sellerName} | {faculty}</p>
        <p className={styles.meta}>Status: <span className={styles.statusDot}>●</span> {item?.status || 'Available'}</p>

        <div className={styles.qrPlaceholder}>
          <div className={styles.qrBox} />
          <p>Scan to view full listing on SLIIT Marketplace</p>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.footer}>
        <p>Posted on: {formatDate(item?.createdAt)}</p>
        <p>campus-marketplace.sliit.lk</p>
      </div>
    </div>
  );
}

export default ItemPoster;
