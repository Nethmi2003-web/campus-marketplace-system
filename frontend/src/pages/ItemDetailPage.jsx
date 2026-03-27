import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getItemById } from '../services/itemService';
import styles from './ItemDetailPage.module.css';

const statusClassMap = {
  Available: styles.statusAvailable,
  Sold: styles.statusSold,
  Reserved: styles.statusReserved,
};

const placeholderImage =
  'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=900&q=80';

function buildSellerName(seller) {
  if (!seller) {
    return 'Unknown Seller';
  }
  return `${seller.firstName || ''} ${seller.lastName || ''}`.trim() || seller.universityEmail || 'Unknown Seller';
}

function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const loadItem = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getItemById(id);
      setItem(response);
      setActiveImage(0);
    } catch (error) {
      setItem(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadItem();
  }, [loadItem]);

  const images = useMemo(() => {
    if (!item?.images || item.images.length === 0) {
      return [placeholderImage];
    }
    return item.images;
  }, [item]);

  const sellerName = buildSellerName(item?.seller);
  const sellerInitials = sellerName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'SL';

  if (loading) {
    return <div className={styles.loading}>Loading item details...</div>;
  }

  if (!item) {
    return <div className={styles.loading}>Item not found.</div>;
  }

  return (
    <div className={styles.page}>
      <button type="button" className={styles.backBtn} onClick={() => navigate('/marketplace')}>
        <ArrowLeft size={16} /> Back to Marketplace
      </button>

      <div className={styles.layout}>
        <section className={styles.galleryCard}>
          <img src={images[activeImage]} alt={item.title} className={styles.mainImage} />
          <div className={styles.thumbnailRow}>
            {images.map((imageUrl, index) => (
              <button
                key={`${imageUrl}-${index}`}
                type="button"
                className={`${styles.thumbnailBtn} ${index === activeImage ? styles.thumbnailActive : ''}`}
                onClick={() => setActiveImage(index)}
              >
                <img src={imageUrl} alt={`Item image ${index + 1}`} className={styles.thumbnail} />
              </button>
            ))}
          </div>
        </section>

        <section className={styles.detailCard}>
          <h1 className={styles.title}>{item.title}</h1>
          <p className={styles.price}>LKR {Number(item.price || 0).toLocaleString()}</p>

          <div className={styles.badgeRow}>
            <span className={styles.categoryBadge}>{item.category}</span>
            <span className={`${styles.statusBadge} ${statusClassMap[item.status] || styles.statusAvailable}`}>
              {item.status.toUpperCase()}
            </span>
          </div>

          <p className={styles.description}>{item.description}</p>

          <div className={styles.sellerCard}>
            <div className={styles.avatar}>{sellerInitials}</div>
            <div className={styles.sellerInfo}>
              <p className={styles.sellerName}>{sellerName}</p>
              <p className={styles.sellerMail}>{item.seller?.universityEmail || 'No email provided'}</p>
            </div>
            <button type="button" className={styles.contactBtn}>
              Contact Seller
            </button>
          </div>

          <button
            type="button"
            className={styles.cartBtn}
            disabled={item.status !== 'Available'}
            onClick={() => window.alert('Add to Cart integration placeholder')}
          >
            Add to Cart
          </button>
        </section>
      </div>
    </div>
  );
}

export default ItemDetailPage;
