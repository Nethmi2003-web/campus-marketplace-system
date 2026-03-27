import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Image as ImageIcon,
  PackageOpen,
  Pencil,
  Trash2,
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Package,
  Heart,
  ClipboardList,
  Tag,
  CreditCard,
  BarChart2,
  Calendar,
  User,
  LogOut,
} from 'lucide-react';
import { getMyListings, updateItem } from '../services/itemService';
import EditItemModal from '../components/items/EditItemModal';
import DeleteConfirmModal from '../components/items/DeleteConfirmModal';
import Toast from '../components/common/Toast';
import { cn } from '../lib/utils';

const tabs = ['All', 'Available', 'Reserved', 'Sold'];

const normalizeStatus = (status = '') => {
  const lowered = String(status || '').toLowerCase();
  if (lowered === 'available') {
    return 'Available';
  }
  if (lowered === 'reserved') {
    return 'Reserved';
  }
  if (lowered === 'sold') {
    return 'Sold';
  }
  return status || 'Available';
};

const getStatusStyles = (status) => {
  const normalized = normalizeStatus(status);
  if (normalized === 'Available') {
    return { background: '#dcfce7', color: '#16a34a' };
  }
  if (normalized === 'Reserved') {
    return { background: '#fef9c3', color: '#ca8a04' };
  }
  return { background: '#f3f4f6', color: '#6b7280' };
};

function MyListingsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [listings, setListings] = useState([]);
  const [stats, setStats] = useState({
    totalCount: 0,
    availableCount: 0,
    soldCount: 0,
    reservedCount: 0,
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [toast, setToast] = useState(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState('');

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadListings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getMyListings();
      const normalizedItems = Array.isArray(data?.items)
        ? data.items.map((item) => ({ ...item, status: normalizeStatus(item.status) }))
        : [];

      setListings(normalizedItems);
      setStats({
        totalCount: normalizedItems.length,
        availableCount: normalizedItems.filter((item) => item.status === 'Available').length,
        soldCount: normalizedItems.filter((item) => item.status === 'Sold').length,
        reservedCount: normalizedItems.filter((item) => item.status === 'Reserved').length,
      });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load your listings.');
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const filteredListings = useMemo(() => {
    if (activeTab === 'All') {
      return listings;
    }
    return listings.filter((listing) => normalizeStatus(listing.status) === activeTab);
  }, [listings, activeTab]);

  const formatPrice = (price) => `LKR ${Number(price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatDate = (dateValue) => {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
      return 'Unknown date';
    }
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const refreshStatsFromListings = (nextListings) => {
    const normalizedListings = nextListings.map((item) => ({
      ...item,
      status: normalizeStatus(item.status),
    }));

    setStats({
      totalCount: normalizedListings.length,
      availableCount: normalizedListings.filter((item) => item.status === 'Available').length,
      reservedCount: normalizedListings.filter((item) => item.status === 'Reserved').length,
      soldCount: normalizedListings.filter((item) => item.status === 'Sold').length,
    });
  };

  const handleItemUpdated = (updated) => {
    const normalizedUpdated = { ...updated, status: normalizeStatus(updated.status) };
    const next = listings.map((item) => (item._id === normalizedUpdated._id ? normalizedUpdated : item));
    setListings(next);
    refreshStatsFromListings(next);
    setEditModalOpen(false);
    setSelectedItem(null);
    showToast('Listing updated successfully!', 'success');
  };

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setSelectedItem(null);
  };

  const handleDeleted = (id) => {
    const next = listings.filter((item) => item._id !== id);
    setListings(next);
    refreshStatsFromListings(next);
    showToast('Listing deleted successfully!', 'success');
  };

  const handleStatusChange = async (listingId, nextStatus) => {
    const target = listings.find((item) => item._id === listingId);
    if (!target) {
      return;
    }

    try {
      setStatusUpdatingId(listingId);
      const payload = new FormData();
      payload.append('status', nextStatus);

      const updated = await updateItem(listingId, payload);
      const normalizedUpdated = { ...updated, status: normalizeStatus(updated.status) };
      const next = listings.map((item) => (item._id === normalizedUpdated._id ? normalizedUpdated : item));
      setListings(next);
      refreshStatsFromListings(next);
      showToast('Availability status updated successfully!', 'success');
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to update availability status.';
      showToast(message, 'error');
    } finally {
      setStatusUpdatingId('');
    }
  };

  const sidebarSections = [
    {
      title: 'MAIN',
      items: [
        {
          id: 'overview',
          label: 'Dashboard Home',
          icon: LayoutDashboard,
          dashboardTab: 'overview',
          isActive: location.pathname === '/dashboard' && location.state?.activeTab === 'overview',
        },
      ],
    },
    {
      title: 'BUYING',
      items: [
        {
          id: 'marketplace',
          label: 'Marketplace',
          icon: ShoppingBag,
          to: '/marketplace',
          isActive: location.pathname === '/marketplace',
        },
        {
          id: 'cart',
          label: 'My Cart',
          icon: ShoppingCart,
          dashboardTab: 'cart',
          isActive: location.pathname === '/dashboard' && location.state?.activeTab === 'cart',
        },
        {
          id: 'purchases',
          label: 'My Purchases',
          icon: Package,
          dashboardTab: 'purchases',
          isActive: location.pathname === '/dashboard' && location.state?.activeTab === 'purchases',
        },
        {
          id: 'wishlist',
          label: 'Wishlist',
          icon: Heart,
          dashboardTab: 'wishlist',
          isActive: location.pathname === '/dashboard' && location.state?.activeTab === 'wishlist',
        },
      ],
    },
    {
      title: 'SELLING',
      items: [
        {
          id: 'listings',
          label: 'My Listings',
          icon: ClipboardList,
          to: '/items/my-listings',
          isActive: location.pathname === '/items/my-listings',
        },
        {
          id: 'add-item',
          label: 'Add Item',
          icon: Tag,
          dashboardTab: 'add_item',
          isActive: location.pathname === '/dashboard' && location.state?.activeTab === 'add_item',
        },
        {
          id: 'sales',
          label: 'My Sales / Orders',
          icon: Tag,
          dashboardTab: 'sales',
          isActive: location.pathname === '/dashboard' && location.state?.activeTab === 'sales',
        },
      ],
    },
    {
      title: 'ACTIVITY',
      items: [
        {
          id: 'transactions',
          label: 'Transactions',
          icon: CreditCard,
          dashboardTab: 'transactions',
          isActive: location.pathname === '/dashboard' && location.state?.activeTab === 'transactions',
        },
        {
          id: 'analytics',
          label: 'My Analytics',
          icon: BarChart2,
          dashboardTab: 'analytics',
          isActive: location.pathname === '/dashboard' && location.state?.activeTab === 'analytics',
        },
      ],
    },
    {
      title: 'CAMPUS',
      items: [
        {
          id: 'events',
          label: 'Campus Events',
          icon: Calendar,
          dashboardTab: 'events',
          isActive: location.pathname === '/dashboard' && location.state?.activeTab === 'events',
        },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        {
          id: 'profile',
          label: 'Profile Settings',
          icon: User,
          dashboardTab: 'profile',
          isActive: location.pathname === '/dashboard' && location.state?.activeTab === 'profile',
        },
      ],
    },
  ];

  const handleSidebarNavigate = (item) => {
    if (item.to) {
      navigate(item.to);
      return;
    }

    if (item.dashboardTab) {
      navigate('/dashboard', { state: { activeTab: item.dashboardTab } });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('std_userInfo');
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f1f5f9', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <aside className="w-64 fixed left-0 top-20 bottom-0 bg-gradient-to-b from-[#001f5c] to-[#002a7a] p-4 flex-col hidden lg:flex rounded-tr-3xl overflow-y-auto pb-6 gap-6">
        <div className="flex-1 mt-2 space-y-6">
          {sidebarSections.map((section) => (
            <div key={section.title} className="flex flex-col gap-1">
              <h3 className="px-4 text-[11px] font-black tracking-widest text-white/40 mb-1">{section.title}</h3>
              {section.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSidebarNavigate(item)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-bold text-[13px] group text-left',
                    item.isActive
                      ? 'bg-gradient-to-r from-secondary to-secondary/80 text-white shadow-lg shadow-secondary/20'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                >
                  <item.icon
                    size={18}
                    className={cn(item.isActive ? 'text-white' : 'text-white/50 group-hover:text-white transition-colors')}
                  />
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-auto pt-4 border-t border-white/10 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/50 hover:bg-red-500/20 hover:text-red-400 transition-all font-bold text-[13px]"
          >
            <LogOut size={18} /> Logout Session
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '22px' }} className="lg:ml-64">
        <div style={{ fontSize: '14px', marginBottom: '16px' }}>
          <Link
            to="/marketplace"
            style={{ color: '#f97316', textDecoration: 'none' }}
            onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
            onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
          >
            {'← Marketplace'}
          </Link>
          <span style={{ color: '#6b7280' }}> / </span>
          <span style={{ color: '#0f1b3d' }}>My Listings</span>
        </div>

        <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <div>
            <h1 style={{ margin: 0, color: '#0f1b3d', fontSize: '28px', fontWeight: 800 }}>My Listings</h1>
            <p style={{ margin: '6px 0 0', color: '#6b7280', fontSize: '14px' }}>Manage your items for sale</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/items/sell')}
            style={{
              border: '1px solid #f97316',
              background: '#f97316',
              color: '#ffffff',
              borderRadius: '8px',
              padding: '10px 14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            + List New Item
          </button>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px', marginTop: '18px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '16px' }}>
            <p style={{ margin: 0, color: '#0f1b3d', fontWeight: 700, fontSize: '13px' }}>Total Listings</p>
            <p style={{ margin: '8px 0 0', color: '#0f1b3d', fontWeight: 800, fontSize: '30px' }}>{stats.totalCount}</p>
          </div>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '16px' }}>
            <p style={{ margin: 0, color: '#0f1b3d', fontWeight: 700, fontSize: '13px' }}>Available</p>
            <p style={{ margin: '8px 0 0', color: '#16a34a', fontWeight: 800, fontSize: '30px' }}>{stats.availableCount}</p>
          </div>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '16px' }}>
            <p style={{ margin: 0, color: '#0f1b3d', fontWeight: 700, fontSize: '13px' }}>Reserved</p>
            <p style={{ margin: '8px 0 0', color: '#ca8a04', fontWeight: 800, fontSize: '30px' }}>{stats.reservedCount}</p>
          </div>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '16px' }}>
            <p style={{ margin: 0, color: '#0f1b3d', fontWeight: 700, fontSize: '13px' }}>Sold</p>
            <p style={{ margin: '8px 0 0', color: '#6b7280', fontWeight: 800, fontSize: '30px' }}>{stats.soldCount}</p>
          </div>
        </section>

        <section style={{ marginTop: '18px', display: 'flex', gap: '20px', borderBottom: '1px solid #e5e7eb' }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                style={{
                  border: 0,
                  borderBottom: isActive ? '3px solid #f97316' : '3px solid transparent',
                  background: 'transparent',
                  color: isActive ? '#f97316' : '#6b7280',
                  fontWeight: isActive ? 600 : 500,
                  padding: '10px 0',
                  cursor: 'pointer',
                }}
              >
                {tab}
              </button>
            );
          })}
        </section>

        <section style={{ marginTop: '16px', display: 'grid', gap: '12px' }}>
          {loading && (
            <>
              <style>
                {`@keyframes listingPulse { 0% { opacity: 1; } 50% { opacity: 0.55; } 100% { opacity: 1; } }`}
              </style>
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  style={{
                    height: '120px',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    background: '#ffffff',
                    animation: 'listingPulse 1.3s ease-in-out infinite',
                  }}
                />
              ))}
            </>
          )}

          {!loading && error && (
            <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '12px', padding: '14px', color: '#be123c' }}>
              {error}
            </div>
          )}

          {!loading && !error && filteredListings.length === 0 && (
            <div
              style={{
                border: '1px dashed #cbd5e1',
                borderRadius: '12px',
                background: '#ffffff',
                minHeight: '240px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '20px',
              }}
            >
              <PackageOpen size={38} color="#94a3b8" />
              <p style={{ margin: '10px 0 4px', color: '#0f1b3d', fontWeight: 700, fontSize: '18px' }}>
                No {activeTab.toLowerCase()} listings yet
              </p>
              <p style={{ margin: '0 0 12px', color: '#6b7280', fontSize: '14px' }}>Items you list for sale will appear here</p>
              <button
                type="button"
                onClick={() => navigate('/items/sell')}
                style={{ border: '1px solid #f97316', background: '#f97316', color: '#fff', borderRadius: '8px', padding: '10px 14px', fontWeight: 600, cursor: 'pointer' }}
              >
                + List Your First Item
              </button>
            </div>
          )}

          {!loading && !error && filteredListings.map((listing) => {
            const statusStyles = getStatusStyles(listing.status);
            const image = listing.images?.[0] || '';

            return (
              <article
                key={listing._id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '90px 1fr auto auto',
                  gap: '14px',
                  alignItems: 'center',
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '14px',
                }}
              >
                <div style={{ width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {image ? (
                    <img src={image} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <ImageIcon size={22} color="#94a3b8" />
                  )}
                </div>

                <div>
                  <p style={{ margin: '0 0 4px', color: '#0f1b3d', fontSize: '18px', fontWeight: 700 }}>{listing.title}</p>
                  <p style={{ margin: '0 0 4px', color: '#6b7280', fontSize: '13px' }}>{listing.category} • {listing.condition}</p>
                  <p style={{ margin: '0 0 4px', color: '#f97316', fontSize: '15px', fontWeight: 700 }}>{formatPrice(listing.price)}</p>
                  <p
                    style={{
                      margin: 0,
                      color: '#6b7280',
                      fontSize: '13px',
                      maxWidth: '620px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {listing.description}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ ...statusStyles, borderRadius: '999px', padding: '5px 10px', fontSize: '12px', fontWeight: 700 }}>
                    {normalizeStatus(listing.status)}
                  </span>
                  <div style={{ marginTop: '8px' }}>
                    <select
                      value={normalizeStatus(listing.status)}
                      disabled={statusUpdatingId === listing._id}
                      onChange={(e) => handleStatusChange(listing._id, e.target.value)}
                      style={{
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        padding: '6px 10px',
                        color: '#0f1b3d',
                        fontSize: '12px',
                        fontWeight: 600,
                        background: '#ffffff',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="Available">Available</option>
                      <option value="Reserved">Reserved</option>
                      <option value="Sold">Sold</option>
                    </select>
                  </div>
                  <p style={{ margin: '8px 0 0', color: '#6b7280', fontSize: '12px' }}>Posted: {formatDate(listing.createdAt)}</p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => handleEditClick(listing)}
                    disabled={statusUpdatingId === listing._id}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#0f1b3d';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.color = '#0f1b3d';
                    }}
                    style={{
                      border: '1px solid #0f1b3d',
                      background: '#ffffff',
                      color: '#0f1b3d',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      cursor: 'pointer',
                      opacity: statusUpdatingId === listing._id ? 0.6 : 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingItem(listing)}
                    disabled={statusUpdatingId === listing._id}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#ef4444';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.color = '#ef4444';
                    }}
                    style={{
                      border: '1px solid #ef4444',
                      background: '#ffffff',
                      color: '#ef4444',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      cursor: 'pointer',
                      opacity: statusUpdatingId === listing._id ? 0.6 : 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      </main>

      {selectedItem && (
        <EditItemModal
          item={selectedItem}
          isOpen={editModalOpen}
          onClose={handleEditClose}
          onUpdated={handleItemUpdated}
        />
      )}

      <DeleteConfirmModal
        item={deletingItem}
        isOpen={Boolean(deletingItem)}
        onClose={() => setDeletingItem(null)}
        onDeleted={handleDeleted}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default MyListingsPage;
