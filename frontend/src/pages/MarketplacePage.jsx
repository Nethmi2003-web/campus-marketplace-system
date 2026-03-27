import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Heart, Search, ShoppingCart, SlidersHorizontal } from 'lucide-react';
import ItemCard from '../components/items/ItemCard';
import { getAllItems } from '../services/itemService';
import styles from './MarketplacePage.module.css';

const CATEGORIES = [
  'Books',
  'Electronics',
  'Lab Equipment',
  'Clothing & Uniforms',
  'Sports & Fitness',
  'Services & Tutoring',
  'Other',
];

const CATEGORY_PILLS = [
  { label: 'ALL ITEMS', value: 'ALL ITEMS' },
  { label: 'BOOKS', value: 'Books' },
  { label: 'ELECTRONICS', value: 'Electronics' },
  { label: 'LAB EQUIPMENT', value: 'Lab Equipment' },
  { label: 'CLOTHING & UNIFORMS', value: 'Clothing & Uniforms' },
  { label: 'SPORTS & FITNESS', value: 'Sports & Fitness' },
  { label: 'SERVICES & TUTORING', value: 'Services & Tutoring' },
  { label: 'OTHER', value: 'Other' },
];

const getRemainingSearchText = (fullSearch, matchedCategory) => {
  if (!fullSearch || !matchedCategory) {
    return (fullSearch || '').trim();
  }

  const normalizedSearch = fullSearch.toLowerCase().trim();
  const normalizedCategory = matchedCategory.toLowerCase();
  const firstWord = normalizedCategory.split(' ')[0];

  let remaining = normalizedSearch;
  if (remaining.includes(normalizedCategory)) {
    remaining = remaining.replace(normalizedCategory, ' ').trim();
  }
  if (remaining.includes(firstWord)) {
    remaining = remaining.replace(firstWord, ' ').trim();
  }

  return remaining;
};

function MarketplacePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL ITEMS');
  const [autoDetectedCategory, setAutoDetectedCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const data = await getAllItems();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      setItems([]);
      setErrorMessage(error?.response?.data?.message || 'Failed to load items. Please check backend server and API URL.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  useEffect(() => {
    let result = items;
    const normalizedSearch = searchTerm.toLowerCase().trim();

    if (activeCategory !== 'ALL ITEMS') {
      result = result.filter((item) => item.category === activeCategory);
    }

    if (normalizedSearch && autoDetectedCategory) {
      const remaining = getRemainingSearchText(searchTerm, autoDetectedCategory);
      if (remaining) {
        result = result.filter((item) => {
          const title = (item.title || '').toLowerCase();
          const description = (item.description || '').toLowerCase();
          return title.includes(remaining) || description.includes(remaining);
        });
      }
    }

    if (normalizedSearch && !autoDetectedCategory) {
      result = result.filter((item) => {
        const title = (item.title || '').toLowerCase();
        const description = (item.description || '').toLowerCase();
        return title.includes(normalizedSearch) || description.includes(normalizedSearch);
      });
    }

    setFilteredItems(result);
  }, [searchTerm, activeCategory, items, autoDetectedCategory]);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value === '') {
      setActiveCategory('ALL ITEMS');
      setAutoDetectedCategory(null);
      return;
    }

    const matched = CATEGORIES.find(
      (cat) =>
        cat.toLowerCase().includes(value.toLowerCase())
        || value.toLowerCase().includes(cat.toLowerCase().split(' ')[0])
    );

    if (matched) {
      setActiveCategory(matched);
      setAutoDetectedCategory(matched);
    } else {
      setAutoDetectedCategory(null);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setActiveCategory('ALL ITEMS');
    setAutoDetectedCategory(null);
  };

  const handleShowAllMatchingSearch = () => {
    setActiveCategory('ALL ITEMS');
    setAutoDetectedCategory(null);
  };

  const handleCategoryClick = (categoryValue) => {
    setActiveCategory(categoryValue);
    if (categoryValue === 'ALL ITEMS') {
      setAutoDetectedCategory(null);
    } else if (autoDetectedCategory && autoDetectedCategory !== categoryValue) {
      setAutoDetectedCategory(null);
    }
  };

  const handleCardClick = (itemId) => {
    navigate(`/items/${itemId}`);
  };

  const sidebarItems = [
    { label: 'Dashboard', to: '/dashboard', isActive: location.pathname === '/' || location.pathname === '/dashboard' },
    { label: 'Marketplace', to: '/marketplace', isActive: location.pathname === '/marketplace' },
    { label: 'My Cart', to: '/cart', isActive: location.pathname === '/cart' },
    { label: 'My Listings', to: '/items' },
    { label: 'Orders', to: '/orders' },
    { label: 'Messages', to: '/messages' },
  ];

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <h2 className={styles.brand}>SLIIT Marketplace</h2>
        <nav className={styles.navList}>
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`${styles.navItem} ${item.isActive ? styles.activeNav : ''}`}
              onClick={() => navigate(item.to)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className={styles.contentArea}>
        <header className={styles.topBar}>
          <div className={styles.searchBox}>
            <Search size={18} color="#64748b" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={handleSearch}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Clear search"
                style={{
                  border: 0,
                  background: 'transparent',
                  color: '#9ca3af',
                  fontSize: '16px',
                  cursor: 'pointer',
                  lineHeight: 1,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#9ca3af';
                }}
              >
                x
              </button>
            )}
          </div>

          <div className={styles.iconRow}>
            <button type="button" className={styles.iconButton}>
              <ShoppingCart size={18} />
            </button>
            <button type="button" className={styles.iconButton}>
              <Heart size={18} />
            </button>
            <button type="button" className={styles.iconButton}>
              <Bell size={18} />
            </button>
            <div className={styles.avatar}>SM</div>
          </div>
        </header>

        {autoDetectedCategory && searchTerm.trim() && (
          <div
            style={{
              marginTop: '10px',
              background: '#fff7ed',
              borderLeft: '3px solid #f97316',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '13px',
              color: '#6b7280',
            }}
          >
            <span style={{ marginRight: '6px' }}>🔍 Showing results in</span>
            <span style={{ color: '#f97316', fontWeight: 700 }}>{autoDetectedCategory}</span>
            <span style={{ margin: '0 6px' }}>— or</span>
            <button
              type="button"
              onClick={handleShowAllMatchingSearch}
              style={{
                border: 0,
                background: 'transparent',
                color: '#f97316',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '13px',
                padding: 0,
              }}
            >
              View all items matching "{searchTerm}"
            </button>
          </div>
        )}

        <div
          style={{
            marginTop: '16px',
            marginBottom: '16px',
            fontSize: '14px',
            color: '#6b7280',
          }}
        >
          <Link
            to="/dashboard"
            onClick={(e) => {
              e.preventDefault();
              navigate('/dashboard');
            }}
            style={{ color: '#f97316', textDecoration: 'none' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            {'← Dashboard'}
          </Link>
          <span style={{ color: '#6b7280' }}> / </span>
          <span style={{ color: '#0f1b3d' }}>Marketplace</span>
        </div>

        <section className={styles.headerRow}>
          <h1>
            Campus Marketplace
            <span className={styles.countBadge}>{filteredItems.length}</span>
          </h1>
          <div className={styles.headerActions}>
            <button type="button" className={styles.sellBtn} onClick={() => navigate('/items/my-listings')}>
              + Sell My Item
            </button>
            <button type="button" className={styles.filterBtn}>
              <SlidersHorizontal size={16} /> FILTERS
            </button>
          </div>
        </section>

        <section className={styles.pillRow}>
          {CATEGORY_PILLS.map((category) => (
            <button
              key={category.label}
              type="button"
              className={`${styles.pill} ${activeCategory === category.value ? styles.pillActive : ''}`}
              onClick={() => handleCategoryClick(category.value)}
            >
              {category.label}
            </button>
          ))}
        </section>

        {loading && (
          <section className={styles.grid}>
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={`skeleton-${index}`} className={styles.skeletonCard} />
            ))}
          </section>
        )}

        {!loading && errorMessage && <div className={styles.errorState}>{errorMessage}</div>}

        {!loading && !errorMessage && filteredItems.length === 0 && (
          <div className={styles.emptyState}>No items matched your search and category filters.</div>
        )}

        {!loading && !errorMessage && filteredItems.length > 0 && (
          <section className={styles.grid}>
            {filteredItems.map((item) => (
              <ItemCard key={item._id} item={item} onClick={handleCardClick} />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default MarketplacePage;
