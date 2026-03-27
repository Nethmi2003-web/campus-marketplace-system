import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import ItemPoster from '../components/items/ItemPoster';
import { getItemById } from '../services/itemService';
import styles from './ItemPosterPage.module.css';

const readCurrentUser = () => {
  const studentRaw = localStorage.getItem('std_userInfo');
  if (studentRaw) {
    try {
      return JSON.parse(studentRaw);
    } catch (error) {
      return null;
    }
  }

  const adminRaw = localStorage.getItem('admin_userInfo');
  if (adminRaw) {
    try {
      return JSON.parse(adminRaw);
    } catch (error) {
      return null;
    }
  }

  return null;
};

function ItemPosterPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const posterRef = useRef(null);

  const initialItem = location.state?.item || null;
  const [item, setItem] = useState(initialItem);
  const [loading, setLoading] = useState(!initialItem);
  const [downloading, setDownloading] = useState(false);

  const currentUser = useMemo(() => readCurrentUser(), []);

  useEffect(() => {
    const load = async () => {
      if (item?._id) {
        return;
      }

      try {
        setLoading(true);
        const fetched = await getItemById(id);
        setItem(fetched);
      } catch (error) {
        setItem(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, item]);

  const handleDownload = async () => {
    if (!posterRef.current || !item) {
      return;
    }

    try {
      setDownloading(true);
      const canvas = await html2canvas(posterRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });
      const link = document.createElement('a');
      const safeName = (item.title || 'item-poster').replace(/[^a-zA-Z0-9-_ ]/g, '').trim() || 'item-poster';
      link.download = `${safeName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return <div className={styles.center}>Loading poster...</div>;
  }

  if (!item) {
    return <div className={styles.center}>Unable to load item details for poster.</div>;
  }

  return (
    <div className={styles.page}>
      <div ref={posterRef}>
        <ItemPoster item={item} currentUser={currentUser} />
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.primaryBtn} onClick={handleDownload} disabled={downloading}>
          {downloading ? 'Preparing Download...' : 'Download Poster'}
        </button>
        <button type="button" className={styles.outlineNavyBtn} onClick={() => navigate(`/items/${item._id}`)}>
          View My Listing
        </button>
        <button type="button" className={styles.outlineGrayBtn} onClick={() => navigate('/items/sell')}>
          Sell Another Item
        </button>
      </div>
    </div>
  );
}

export default ItemPosterPage;
