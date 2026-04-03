import React, { useMemo, useState } from "react";
import { cn } from '../lib/utils';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { 
  Users, ShoppingBag, AlertTriangle, TrendingUp, ShieldCheck, 
  ArrowUpRight, ArrowDownRight, LayoutDashboard,
  LogOut, Bell, Settings, Activity, Receipt, BadgeDollarSign, Calendar,
  Menu, X, Search, Filter, ChevronDown, Info, Eye, Trash2, ShieldAlert
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";
import { AdminPricingTab } from "../components/AdminPricingTab";
import { AdminTransactionsTab } from "../components/AdminTransactionsTab";
import { AdminListingsTab } from "../components/AdminListingsTab";
import { AdminEventsTab } from "../components/AdminEventsTab";

// Removed IoT specific chart imports

// -------------------------------------------------------------
// STANDALONE ADMIN NAVBAR
// -------------------------------------------------------------
function AdminNavbar({ user, onMenuClick, notifications, notificationOpen, onToggleNotifications }) {
  return (
    <nav className="h-20 bg-background/95 backdrop-blur-md border-b fixed top-0 left-0 right-0 z-40 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 inline-flex items-center justify-center rounded-xl border bg-card text-muted-foreground hover:text-primary"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff6b35] to-[#f7931e] flex items-center justify-center">
          <ShoppingBag className="w-5 h-5 text-white" />
        </div>
        <h2 className="hidden md:block font-black text-xl text-primary tracking-tight">Admin<span className="text-secondary">Dashboard</span></h2>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative">
          <button
            type="button"
            onClick={onToggleNotifications}
            className="relative"
            aria-label="Toggle notifications"
          >
            <Bell className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
          </button>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          {notificationOpen && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl border bg-card shadow-2xl p-3 z-50">
              <div className="flex items-center justify-between px-2 py-1.5 border-b">
                <p className="text-xs font-black text-primary uppercase tracking-widest">Notifications</p>
                <span className="text-[10px] font-bold text-muted-foreground">{notifications.length}</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y">
                {notifications.length === 0 && (
                  <div className="py-8 text-center text-sm text-muted-foreground">No notifications right now.</div>
                )}
                {notifications.map((note) => (
                  <div key={note.id} className="px-2 py-2.5">
                    <p className="text-sm font-bold text-foreground">{note.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{note.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-foreground">{user?.firstName || 'System Admin'}</p>
            <p className="text-[10px] text-secondary font-black uppercase tracking-widest">{user?.role === 'admin' ? 'System Administrator' : user?.role || 'Administrator'}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shadow-lg">
             <span className="text-white font-bold">{user?.firstName?.charAt(0) || 'A'}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

function AdminSidebar({ activeTab, setActiveTab, onClose, isMobile }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin_userInfo");
    navigate("/");
  };

  const tabs = [
    { id: "overview",     label: "System Overview",     icon: LayoutDashboard },
    { id: "users",        label: "Manage Users",         icon: Users },
    { id: "listings",     label: "Active Listings",      icon: ShoppingBag },
    { id: "transactions", label: "Transactions",         icon: Receipt },
    { id: "pricing",      label: "Pricing Management",   icon: BadgeDollarSign },
    { id: "events",       label: "Campus Events",        icon: Calendar },
    { id: "moderation",   label: "Trust & Safety",       icon: AlertTriangle },
    { id: "settings",     label: "Platform Settings",    icon: Settings },
  ];

  return (
    <aside className={cn(
      "w-64 fixed left-0 top-20 bottom-0 border-r bg-card/90 backdrop-blur-3xl p-4 flex flex-col overflow-y-auto z-40",
      isMobile ? "flex" : "hidden lg:flex"
    )}>
      {isMobile && (
        <button
          type="button"
          onClick={onClose}
          className="mb-3 w-10 h-10 inline-flex items-center justify-center rounded-xl border bg-card self-end"
          aria-label="Close sidebar menu"
        >
          <X size={18} />
        </button>
      )}
      <div className="space-y-1 flex-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              if (isMobile) {
                onClose();
              }
            }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold",
              tab.id === activeTab
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>
      <button onClick={handleLogout} className="mt-auto w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-bold">
        <LogOut size={18} /> Logout Session
      </button>
    </aside>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-xl shadow-black/5 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-xl bg-muted" />
        <div className="w-16 h-6 rounded-full bg-muted" />
      </div>
      <div className="h-9 w-24 rounded-md bg-muted" />
      <div className="h-4 w-32 rounded-md bg-muted mt-2" />
    </div>
  );
}

function ChartSkeleton() {
  return <div className="h-[300px] w-full rounded-2xl bg-muted animate-pulse" />;
}

function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="rounded-2xl border bg-card shadow-xl p-10 text-center">
      <Icon className="mx-auto mb-3 text-muted-foreground/50" size={40} />
      <h3 className="text-lg font-black text-primary">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  );
}

function RatingStars({ value }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-500" aria-label={`Rating ${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className={index < value ? 'opacity-100' : 'opacity-20'}>★</span>
      ))}
    </div>
  );
}

function ConfirmDialog({ open, title, description, confirmLabel, confirmTone = 'danger', onConfirm, onCancel }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md rounded-3xl border bg-card p-6 shadow-2xl">
        <h3 className="text-xl font-black text-primary">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-xl border text-sm font-bold bg-background">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-bold text-white',
              confirmTone === 'danger' && 'bg-red-600',
              confirmTone === 'warning' && 'bg-orange-600',
              confirmTone === 'primary' && 'bg-primary'
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function DropdownMenu({ open, items, onClose }) {
  if (!open) {
    return null;
  }

  return (
    <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border bg-card shadow-2xl z-30 overflow-hidden">
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          disabled={item.disabled}
          onClick={() => {
            if (!item.disabled) {
              item.onClick();
            }
            onClose();
          }}
          className={cn(
            'w-full px-4 py-3 text-left text-sm font-semibold flex items-center gap-2 hover:bg-muted transition-colors',
            item.variant === 'danger' && 'text-red-600 hover:bg-red-50',
            item.disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
}

// -------------------------------------------------------------
// MAIN ADMIN DASHBOARD
// -------------------------------------------------------------
export default function AdminDashboard() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("admin_userInfo") || "{}");
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState('');
  const [sessionError, setSessionError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [blockedIds, setBlockedIds] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [moderationSearch, setModerationSearch] = useState('');
  const [moderationQueue, setModerationQueue] = useState([]);
  const [feedbackTab, setFeedbackTab] = useState('all-reviews');
  const [feedbackSearch, setFeedbackSearch] = useState('');
  const [feedbackStatusFilter, setFeedbackStatusFilter] = useState('all');
  const [feedbackSentimentFilter, setFeedbackSentimentFilter] = useState('all');
  const [feedbackRatingFilter, setFeedbackRatingFilter] = useState('all');
  const [feedbackDateRange, setFeedbackDateRange] = useState('30d');
  const [reviewMenuOpenId, setReviewMenuOpenId] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [expandedReviewIds, setExpandedReviewIds] = useState([]);
  const [profileModalUser, setProfileModalUser] = useState(null);
  const [confirmState, setConfirmState] = useState({ open: false, action: null, review: null });
  const [highlightedSellerIds, setHighlightedSellerIds] = useState([]);
  const [feedbackReviews, setFeedbackReviews] = useState([
    {
      _id: 'review-1',
      userId: 'u-101',
      itemId: 'item-201',
      sellerId: 'seller-11',
      rating: 5,
      comment: 'Great price and fast pickup. Seller replied quickly.',
      sentiment: 'positive',
      isFlagged: false,
      status: 'approved',
      reportReason: '',
      createdAt: '2026-04-01T08:45:00.000Z',
    },
    {
      _id: 'review-2',
      userId: 'u-102',
      itemId: 'item-202',
      sellerId: 'seller-12',
      rating: 2,
      comment: 'Pricing felt unfair and the listing description was misleading. Delivery was late.',
      sentiment: 'negative',
      isFlagged: true,
      status: 'flagged',
      reportReason: 'Spam and Toxic Language',
      createdAt: '2026-04-02T11:20:00.000Z',
    },
    {
      _id: 'review-3',
      userId: 'u-103',
      itemId: 'item-203',
      sellerId: 'seller-11',
      rating: 4,
      comment: 'Good quality overall. Pickup took longer than expected but item condition was okay.',
      sentiment: 'neutral',
      isFlagged: false,
      status: 'approved',
      reportReason: '',
      createdAt: '2026-04-02T16:10:00.000Z',
    },
    {
      _id: 'review-4',
      userId: 'u-104',
      itemId: 'item-204',
      sellerId: 'seller-13',
      rating: 1,
      comment: 'Fake looking review text copied many times with abusive wording.',
      sentiment: 'negative',
      isFlagged: true,
      status: 'flagged',
      reportReason: 'Duplicate and Fake Review',
      createdAt: '2026-04-03T06:15:00.000Z',
    },
  ]);
  const [settingsState, setSettingsState] = useState(() => {
    const saved = localStorage.getItem('admin_platform_settings');
    if (!saved) {
      return { discountRule: 0, aiAutoModeration: true, maintenanceMode: false };
    }
    try {
      return JSON.parse(saved);
    } catch (_err) {
      return { discountRule: 0, aiAutoModeration: true, maintenanceMode: false };
    }
  });
  const isAdmin = userInfo.role === 'admin';

  const stats = useMemo(() => {
    const availableListings = items.filter((item) => String(item.status || '').toLowerCase() === 'available').length;
    const reports = moderationQueue.length;
    const trustBase = items.length > 0 ? Math.max(80, 100 - (reports / items.length) * 100) : 100;
    return {
      totalUsers: users.length,
      activeListings: availableListings,
      reports,
      platformTrust: `${trustBase.toFixed(1)}%`,
    };
  }, [items, moderationQueue, users.length]);

  const trafficData = useMemo(() => {
    const result = [];
    for (let i = 11; i >= 0; i -= 1) {
      const target = new Date();
      target.setDate(target.getDate() - i);
      const dayKey = target.toDateString();
      const activity = orders.filter((order) => new Date(order.createdAt).toDateString() === dayKey).length;
      const value = activity * 70 + 150;
      result.push({ name: target.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }), value });
    }
    return result;
  }, [orders]);

  const notifications = useMemo(() => {
    const pendingOrders = orders.filter((order) => order.paymentStatus === 'pending').length;
    const soldOut = items.filter((item) => Number(item.stockQuantity || 0) === 0).length;
    return [
      { id: '1', title: 'Pending Orders', description: `${pendingOrders} orders need attention.` },
      { id: '2', title: 'Moderation Queue', description: `${moderationQueue.length} listings awaiting review.` },
      { id: '3', title: 'Low Inventory', description: `${soldOut} listings reached zero stock.` },
    ];
  }, [items, moderationQueue.length, orders]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
      const email = String(user.universityEmail || '').toLowerCase();
      const role = String(user.role || '').toLowerCase();
      const q = userSearch.toLowerCase();
      const searchMatch = !q || fullName.includes(q) || email.includes(q);
      const roleMatch = userRoleFilter === 'all' || role === userRoleFilter;
      return searchMatch && roleMatch;
    });
  }, [userSearch, userRoleFilter, users]);

  const filteredModerationQueue = useMemo(() => {
    const q = moderationSearch.toLowerCase();
    return moderationQueue.filter((entry) => {
      const title = String(entry.title || '').toLowerCase();
      const category = String(entry.category || '').toLowerCase();
      return !q || title.includes(q) || category.includes(q);
    });
  }, [moderationQueue, moderationSearch]);

  const reviewRows = useMemo(() => {
    return feedbackReviews.map((review) => {
      const reviewer = users.find((user) => user._id === review.userId);
      const item = items.find((listing) => listing._id === review.itemId);
      const seller = users.find((user) => user._id === review.sellerId);
      const reviewerName = reviewer ? `${reviewer.firstName || ''} ${reviewer.lastName || ''}`.trim() : review.userId;
      const itemName = item?.title || review.itemId;
      const sellerName = seller ? `${seller.firstName || ''} ${seller.lastName || ''}`.trim() : review.sellerId;

      return {
        ...review,
        reviewerName: reviewerName || 'Unknown Buyer',
        itemName,
        sellerName: sellerName || 'Unknown Seller',
      };
    });
  }, [feedbackReviews, items, users]);

  const filteredReviews = useMemo(() => {
    const dateCutoff = feedbackDateRange === 'all'
      ? null
      : (() => {
          const now = new Date();
          const days = feedbackDateRange === '7d' ? 7 : feedbackDateRange === '30d' ? 30 : 90;
          now.setDate(now.getDate() - days);
          return now;
        })();

    const q = feedbackSearch.toLowerCase();
    return reviewRows.filter((review) => {
      const reviewDate = new Date(review.createdAt);
      const statusMatch = feedbackStatusFilter === 'all' || review.status === feedbackStatusFilter;
      const sentimentMatch = feedbackSentimentFilter === 'all' || review.sentiment === feedbackSentimentFilter;
      const ratingMatch = feedbackRatingFilter === 'all' || Number(review.rating) === Number(feedbackRatingFilter);
      const dateMatch = !dateCutoff || reviewDate >= dateCutoff;
      const matchesSearch = !q
        || review.reviewerName.toLowerCase().includes(q)
        || review.itemName.toLowerCase().includes(q)
        || review.comment.toLowerCase().includes(q)
        || review.sellerName.toLowerCase().includes(q);

      if (feedbackTab === 'flagged-reviews') {
        return matchesSearch && statusMatch && sentimentMatch && ratingMatch && dateMatch && (review.isFlagged || review.status === 'flagged');
      }

      return matchesSearch && statusMatch && sentimentMatch && ratingMatch && dateMatch;
    });
  }, [feedbackDateRange, feedbackRatingFilter, feedbackSearch, feedbackSentimentFilter, feedbackStatusFilter, feedbackTab, reviewRows]);

  const paginatedReviews = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredReviews.slice(start, start + pageSize);
  }, [filteredReviews, page, pageSize]);

  const feedbackStats = useMemo(() => {
    const total = reviewRows.length;
    const sentimentBuckets = reviewRows.reduce((acc, review) => {
      acc[review.sentiment] = (acc[review.sentiment] || 0) + 1;
      return acc;
    }, { positive: 0, neutral: 0, negative: 0 });

    const averageRating = total > 0
      ? reviewRows.reduce((sum, review) => sum + Number(review.rating || 0), 0) / total
      : 0;

    const flaggedCount = reviewRows.filter((review) => review.isFlagged || review.status === 'flagged').length;

    return {
      total,
      averageRating,
      flaggedCount,
      sentimentBuckets,
    };
  }, [reviewRows]);

  const sellerFeedback = useMemo(() => {
    const grouped = new Map();

    reviewRows.forEach((review) => {
      const current = grouped.get(review.sellerId) || {
        sellerId: review.sellerId,
        sellerName: review.sellerName,
        totalReviews: 0,
        ratingSum: 0,
        positiveCount: 0,
        neutralCount: 0,
        negativeCount: 0,
        flaggedCount: 0,
      };

      current.totalReviews += 1;
      current.ratingSum += Number(review.rating || 0);
      current[`${review.sentiment}Count`] += 1;
      if (review.isFlagged || review.status === 'flagged') {
        current.flaggedCount += 1;
      }

      grouped.set(review.sellerId, current);
    });

    return Array.from(grouped.values())
      .map((seller) => {
        const averageRating = seller.totalReviews > 0 ? seller.ratingSum / seller.totalReviews : 0;
        const trustScore = Math.max(
          45,
          Math.min(
            100,
            Math.round((averageRating / 5) * 70 + (seller.positiveCount / Math.max(seller.totalReviews, 1)) * 25 - (seller.flaggedCount / Math.max(seller.totalReviews, 1)) * 20)
          )
        );

        return {
          ...seller,
          averageRating,
          trustScore,
          isHighlighted: highlightedSellerIds.includes(seller.sellerId),
        };
      })
      .sort((left, right) => right.trustScore - left.trustScore);
  }, [highlightedSellerIds, reviewRows]);

  const reviewInsights = useMemo(() => {
    const lowerComments = reviewRows.map((review) => review.comment.toLowerCase());
    const keywordBuckets = [
      { label: 'Pricing complaints', keywords: ['price', 'pricing', 'expensive', 'cost'] },
      { label: 'Delivery delays', keywords: ['delivery', 'late', 'delay', 'pickup'] },
      { label: 'Quality issues', keywords: ['quality', 'broken', 'damaged', 'fake'] },
      { label: 'Spam / toxic content', keywords: ['spam', 'toxic', 'abuse', 'fake review'] },
    ];

    return keywordBuckets.map((bucket) => ({
      label: bucket.label,
      count: lowerComments.filter((comment) => bucket.keywords.some((keyword) => comment.includes(keyword))).length,
    })).filter((bucket) => bucket.count > 0);
  }, [reviewRows]);

  const feedbackChartData = useMemo(() => ([
    { name: 'Positive', value: feedbackStats.sentimentBuckets.positive, fill: '#16a34a' },
    { name: 'Neutral', value: feedbackStats.sentimentBuckets.neutral, fill: '#64748b' },
    { name: 'Negative', value: feedbackStats.sentimentBuckets.negative, fill: '#dc2626' },
  ]), [feedbackStats]);

  const complaintData = useMemo(() => {
    return reviewInsights.length > 0
      ? reviewInsights.map((insight) => ({ name: insight.label, value: insight.count }))
      : [{ name: 'No data', value: 0 }];
  }, [reviewInsights]);
  
  React.useEffect(() => {
    if (!userInfo.token || userInfo.role !== 'admin') {
      navigate('/');
      return;
    }

    const verifySession = async () => {
      try {
        const res = await axios.get('/api/users/me', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        if (res.data?.role !== 'admin') {
          setSessionError('Unauthorized access. Admin privileges are required.');
          localStorage.removeItem("admin_userInfo");
          navigate('/');
        }
      } catch (err) {
        console.error('Session validation error:', err);
        setSessionError('Unable to verify admin session. Please sign in again.');
        localStorage.removeItem('admin_userInfo');
        navigate('/');
      }
    };

    verifySession();
  }, [navigate, userInfo.token]);

  React.useEffect(() => {
    if (!userInfo.token || !isAdmin) {
      return;
    }

    const loadDashboardData = async () => {
      setDashboardLoading(true);
      setDashboardError('');
      try {
        const [usersRes, itemsRes, ordersRes] = await Promise.allSettled([
          axios.get('/api/users', { headers: { Authorization: `Bearer ${userInfo.token}` } }),
          axios.get('/api/items'),
          axios.get('/api/orders', { headers: { Authorization: `Bearer ${userInfo.token}` } }),
        ]);

        if (usersRes.status === 'fulfilled') {
          setUsers(Array.isArray(usersRes.value.data) ? usersRes.value.data : []);
        } else {
          setUsers([]);
        }

        if (itemsRes.status === 'fulfilled') {
          const payload = Array.isArray(itemsRes.value.data)
            ? itemsRes.value.data
            : Array.isArray(itemsRes.value.data?.data)
              ? itemsRes.value.data.data
              : [];
          setItems(payload);

          const inferredQueue = payload
            .filter((item) => String(item.status || '').toLowerCase() === 'reserved' || Number(item.stockQuantity || 0) === 0)
            .map((item) => ({
              _id: item._id,
              title: item.title,
              category: item.category,
              status: item.status,
              reason: Number(item.stockQuantity || 0) === 0 ? 'Out of stock and flagged for review' : 'Reserved listing awaiting moderation check',
            }));
          setModerationQueue(inferredQueue);
        } else {
          setItems([]);
          setModerationQueue([]);
        }

        if (ordersRes.status === 'fulfilled') {
          const payload = ordersRes.value.data?.data;
          setOrders(Array.isArray(payload) ? payload : []);
        } else {
          setOrders([]);
        }

        if (usersRes.status === 'rejected' && itemsRes.status === 'rejected' && ordersRes.status === 'rejected') {
          setDashboardError('Failed to load dashboard analytics. Please retry.');
        }
      } catch (error) {
        console.error('Dashboard loading failed:', error);
        setDashboardError('Failed to load dashboard analytics. Please retry.');
      } finally {
        setDashboardLoading(false);
      }
    };

    loadDashboardData();
  }, [isAdmin, userInfo.token]);

  const handleBlockToggle = (userId) => {
    if (!isAdmin) {
      return;
    }
    setBlockedIds((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]));
  };

  const handleModerationAction = (id) => {
    if (!isAdmin) {
      return;
    }
    setModerationQueue((prev) => prev.filter((item) => item._id !== id));
  };

  const updateReview = (reviewId, updater) => {
    setFeedbackReviews((prev) => prev.map((review) => {
      if (review._id !== reviewId) {
        return review;
      }

      const patch = typeof updater === 'function' ? updater(review) : updater;
      return { ...review, ...patch };
    }));
  };

  const handleApproveReview = (reviewId) => {
    if (!isAdmin) {
      return;
    }
    updateReview(reviewId, { status: 'approved', isFlagged: false, reportReason: '' });
  };

  const handleHideReview = (reviewId) => {
    if (!isAdmin) {
      return;
    }
    updateReview(reviewId, { status: 'hidden', isFlagged: true });
  };

  const handleDeleteReview = (reviewId) => {
    if (!isAdmin) {
      return;
    }
    setFeedbackReviews((prev) => prev.filter((review) => review._id !== reviewId));
  };

  const handleWarnUserFromReview = (review) => {
    if (!isAdmin) {
      return;
    }
    handleBlockToggle(review.userId);
    updateReview(review._id, { status: 'flagged', isFlagged: true });
  };

  const handleToggleHighlightSeller = (sellerId) => {
    if (!isAdmin) {
      return;
    }
    setHighlightedSellerIds((prev) => (
      prev.includes(sellerId)
        ? prev.filter((id) => id !== sellerId)
        : [...prev, sellerId]
    ));
  };

  const openConfirm = (action, review) => {
    setConfirmState({ open: true, action, review });
    setReviewMenuOpenId(null);
  };

  const closeConfirm = () => setConfirmState({ open: false, action: null, review: null });

  const executeConfirmedAction = () => {
    if (!confirmState.review || !confirmState.action) {
      return;
    }

    const review = confirmState.review;
    if (confirmState.action === 'delete') {
      handleDeleteReview(review._id);
    }
    if (confirmState.action === 'warn') {
      handleWarnUserFromReview(review);
    }
    if (confirmState.action === 'hide') {
      handleHideReview(review._id);
    }

    closeConfirm();
  };

  const openUserProfile = (userId) => {
    const user = users.find((entry) => entry._id === userId) || { _id: userId, firstName: 'Unknown', lastName: 'User', role: 'student' };
    setProfileModalUser(user);
  };

  const toggleReviewExpanded = (reviewId) => {
    setExpandedReviewIds((prev) => (prev.includes(reviewId) ? prev.filter((id) => id !== reviewId) : [...prev, reviewId]));
  };

  const saveSettings = () => {
    if (!isAdmin) {
      return;
    }
    localStorage.setItem('admin_platform_settings', JSON.stringify(settingsState));
  };

  const adminStats = [
    { title: 'Total Users', value: stats.totalUsers, change: '+Live', trend: 'up', icon: Users },
    { title: 'Active Listings', value: stats.activeListings, change: '+Live', trend: 'up', icon: ShoppingBag },
    { title: 'Reports', value: stats.reports, change: stats.reports > 0 ? 'Needs review' : 'Clear', trend: stats.reports > 0 ? 'down' : 'up', icon: AlertTriangle },
    { title: 'Platform Trust', value: stats.platformTrust, change: '+Live', trend: 'up', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      <AdminNavbar
        user={userInfo}
        onMenuClick={() => setSidebarOpen(true)}
        notifications={notifications}
        notificationOpen={notificationOpen}
        onToggleNotifications={() => setNotificationOpen((prev) => !prev)}
      />

      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 top-20 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu overlay"
        />
      )}
      
      <div className="flex flex-1 min-w-0 pt-20">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onClose={() => setSidebarOpen(false)} isMobile={false} />
        {sidebarOpen && <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onClose={() => setSidebarOpen(false)} isMobile />}
        
        <main className="flex-1 min-w-0 lg:ml-64 p-4 md:p-8 lg:p-10 space-y-8 animate-in fade-in duration-700 overflow-x-hidden">

          {sessionError && (
            <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-red-700 text-sm font-semibold">
              {sessionError}
            </div>
          )}

          {dashboardError && (
            <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-red-700 text-sm font-semibold flex items-center justify-between">
              <span>{dashboardError}</span>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs"
              >
                Retry
              </button>
            </div>
          )}

          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-black text-primary tracking-tight">System Administration</h1>
                  <p className="text-muted-foreground font-medium">Platform-wide overview and management tools</p>
                </div>
                <button className="px-6 py-2.5 bg-secondary text-white rounded-xl font-bold shadow-lg shadow-secondary/20 hover:bg-secondary/90 transition-all">Security Audit</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardLoading && Array.from({ length: 4 }).map((_, idx) => <CardSkeleton key={`stat-skeleton-${idx}`} />)}
                {!dashboardLoading && adminStats.map((stat, i) => (
                  <div key={i} className="rounded-2xl border bg-card p-6 shadow-xl shadow-black/5 hover:scale-[1.02] transition-transform">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center">
                        <stat.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className={cn("flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full", stat.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600')}>
                        {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {stat.change}
                      </div>
                    </div>
                    <h3 className="text-3xl font-black text-primary">{stat.value}</h3>
                    <p className="text-sm font-bold text-foreground mt-1">{stat.title}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 rounded-3xl overflow-hidden border bg-card shadow-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-primary">Platform Traffic</h3>
                      <p className="text-sm text-muted-foreground font-medium">Daily active users and interactions</p>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                      <Activity size={12} /> Live
                    </div>
                  </div>
                  <div className="h-[300px] w-full">
                    {dashboardLoading ? (
                      <ChartSkeleton />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trafficData}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }} />
                        <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                    )}
                  </div>
                </div>
                <div className="p-8 bg-gradient-to-br from-[#001f5c] to-primary/90 rounded-3xl text-white shadow-2xl">
                  <ShieldCheck size={40} className="text-secondary mb-4" />
                  <h3 className="text-2xl font-black leading-tight mb-2">System Integrity</h3>
                  <p className="text-white/70 text-sm mb-6">All core modules operational.</p>
                  <button className="w-full bg-white text-primary py-3 rounded-xl font-bold hover:bg-white/90">Run Diagnostic</button>
                </div>
              </div>
            </div>
          )}

          {/* ── USERS ── */}
          {activeTab === 'users' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-black text-primary">Manage Users</h1>
              <p className="text-muted-foreground font-medium">View, search, and manage registered marketplace users</p>
              <div className="rounded-2xl border bg-card shadow-xl p-6 space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(event) => setUserSearch(event.target.value)}
                      placeholder="Search by name or email"
                      className="w-full rounded-xl border bg-background pl-9 pr-3 h-11 text-sm"
                    />
                  </div>
                  <div className="relative w-full md:w-56">
                    <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <select
                      value={userRoleFilter}
                      onChange={(event) => setUserRoleFilter(event.target.value)}
                      className="w-full rounded-xl border bg-background pl-9 pr-3 h-11 text-sm"
                    >
                      <option value="all">All roles</option>
                      <option value="student">Students</option>
                      <option value="admin">Admins</option>
                    </select>
                  </div>
                </div>

                {dashboardLoading && <div className="h-48 rounded-xl bg-muted animate-pulse" />}

                {!dashboardLoading && filteredUsers.length === 0 && (
                  <EmptyState
                    icon={Users}
                    title="No users found"
                    description="Try changing search keywords or role filter."
                  />
                )}

                {!dashboardLoading && filteredUsers.length > 0 && (
                  <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-muted/40">
                        <tr>
                          <th className="px-4 py-3">User</th>
                          <th className="px-4 py-3">Role</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredUsers.map((user) => {
                          const blocked = blockedIds.includes(user._id);
                          return (
                            <tr key={user._id}>
                              <td className="px-4 py-3">
                                <p className="font-bold text-foreground">{`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unnamed User'}</p>
                                <p className="text-xs text-muted-foreground">{user.universityEmail}</p>
                              </td>
                              <td className="px-4 py-3 capitalize">{user.role || 'student'}</td>
                              <td className="px-4 py-3">
                                <span className={cn('text-xs px-2 py-1 rounded-full font-bold', blocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700')}>
                                  {blocked ? 'Blocked' : 'Active'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button
                                  type="button"
                                  disabled={!isAdmin}
                                  onClick={() => handleBlockToggle(user._id)}
                                  className={cn(
                                    'px-3 py-1.5 rounded-lg text-xs font-bold',
                                    blocked ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white',
                                    !isAdmin && 'opacity-60 cursor-not-allowed'
                                  )}
                                >
                                  {blocked ? 'Unblock' : 'Block'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── LISTINGS ── */}
          {activeTab === 'listings' && <AdminListingsTab />}

          {/* ── TRANSACTIONS ── */}
          {activeTab === 'transactions' && <AdminTransactionsTab />}

          {/* ── PRICING MANAGEMENT ── */}
          {activeTab === 'pricing' && <AdminPricingTab />}

          {/* ── MODERATION ── */}
          {activeTab === 'moderation' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-black text-primary">Trust & Safety</h1>
              <p className="text-muted-foreground font-medium">Feedback management, moderation controls, seller trust, and AI insights</p>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="rounded-2xl border bg-card p-5 shadow-xl shadow-black/5">
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Total Reviews</p>
                  <p className="mt-2 text-3xl font-black text-primary">{feedbackStats.total}</p>
                </div>
                <div className="rounded-2xl border bg-card p-5 shadow-xl shadow-black/5">
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Average Rating</p>
                  <p className="mt-2 text-3xl font-black text-primary">{feedbackStats.averageRating.toFixed(1)}</p>
                </div>
                <div className="rounded-2xl border bg-card p-5 shadow-xl shadow-black/5">
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Flagged Reviews</p>
                  <p className="mt-2 text-3xl font-black text-primary">{feedbackStats.flaggedCount}</p>
                </div>
                <div className="rounded-2xl border bg-card p-5 shadow-xl shadow-black/5">
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Positive Sentiment</p>
                  <p className="mt-2 text-3xl font-black text-primary">{feedbackStats.sentimentBuckets.positive}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all-reviews', label: 'All Reviews' },
                  { id: 'flagged-reviews', label: 'Flagged Reviews' },
                  { id: 'seller-ratings', label: 'Seller Ratings' },
                  { id: 'insights', label: 'Insights' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setFeedbackTab(tab.id);
                      setPage(1);
                    }}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm font-bold transition-all border',
                      feedbackTab === tab.id
                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                        : 'bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/40'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="rounded-2xl border bg-card shadow-xl p-6 space-y-4">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        value={feedbackSearch}
                        onChange={(event) => {
                          setFeedbackSearch(event.target.value);
                          setPage(1);
                        }}
                        placeholder="Search reviews, users, items, or sellers"
                        className="w-full rounded-xl border bg-background pl-9 pr-3 h-11 text-sm"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: 'All', value: 'all' },
                        { label: 'Approved', value: 'approved' },
                        { label: 'Flagged', value: 'flagged' },
                        { label: 'Hidden', value: 'hidden' },
                      ].map((chip) => (
                        <button
                          key={chip.label}
                          type="button"
                          onClick={() => {
                            setFeedbackStatusFilter(chip.value);
                            setPage(1);
                          }}
                          className={cn(
                            'px-3 py-1.5 rounded-full text-xs font-bold border',
                            feedbackStatusFilter === chip.value ? 'bg-primary text-white border-primary' : 'bg-background text-muted-foreground border-border'
                          )}
                        >
                          {chip.label}
                        </button>
                      ))}
                      {['positive', 'neutral', 'negative'].map((sentiment) => (
                        <button
                          key={sentiment}
                          type="button"
                          onClick={() => {
                            setFeedbackSentimentFilter((prev) => (prev === sentiment ? 'all' : sentiment));
                            setPage(1);
                          }}
                          className={cn(
                            'px-3 py-1.5 rounded-full text-xs font-bold border capitalize',
                            feedbackSentimentFilter === sentiment ? 'bg-secondary text-white border-secondary' : 'bg-background text-muted-foreground border-border'
                          )}
                        >
                          {sentiment}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                      Rating
                      <select
                        value={feedbackRatingFilter}
                        onChange={(event) => {
                          setFeedbackRatingFilter(event.target.value);
                          setPage(1);
                        }}
                        className="mt-1 w-full rounded-xl border bg-background px-3 h-11 text-sm normal-case tracking-normal font-normal"
                      >
                        <option value="all">All ratings</option>
                        <option value="5">5 star</option>
                        <option value="4">4 star</option>
                        <option value="3">3 star</option>
                        <option value="2">2 star</option>
                        <option value="1">1 star</option>
                      </select>
                    </label>
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                      Date range
                      <select
                        value={feedbackDateRange}
                        onChange={(event) => {
                          setFeedbackDateRange(event.target.value);
                          setPage(1);
                        }}
                        className="mt-1 w-full rounded-xl border bg-background px-3 h-11 text-sm normal-case tracking-normal font-normal"
                      >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                        <option value="all">All time</option>
                      </select>
                    </label>
                  </div>
                </div>

                {dashboardLoading && <div className="h-48 rounded-xl bg-muted animate-pulse" />}

                {!dashboardLoading && feedbackTab === 'all-reviews' && filteredReviews.length === 0 && (
                  <EmptyState
                    icon={Receipt}
                    title="No reviews found"
                    description="Try another search term or switch filters."
                  />
                )}

                {!dashboardLoading && feedbackTab === 'all-reviews' && filteredReviews.length > 0 && (
                  <>
                    <div className="overflow-x-auto rounded-xl border">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-muted/40">
                          <tr>
                            <th className="px-4 py-3">User</th>
                            <th className="px-4 py-3">Item</th>
                            <th className="px-4 py-3">Rating</th>
                            <th className="px-4 py-3">Review text</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {paginatedReviews.map((review) => {
                            const isExpanded = expandedReviewIds.includes(review._id);
                            return (
                              <tr key={review._id} className="align-top">
                                <td className="px-4 py-3">
                                  <button type="button" onClick={() => openUserProfile(review.userId)} className="font-bold text-foreground hover:text-primary text-left">
                                    {review.reviewerName}
                                  </button>
                                  <p className="text-[11px] text-muted-foreground">Seller: {review.sellerName}</p>
                                </td>
                                <td className="px-4 py-3">{review.itemName}</td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <span className="font-black text-primary">{review.rating}/5</span>
                                    <RatingStars value={review.rating} />
                                  </div>
                                </td>
                                <td className="px-4 py-3 max-w-md">
                                  <p className="text-sm text-foreground">
                                    {isExpanded || review.comment.length <= 95 ? review.comment : `${review.comment.slice(0, 95)}...`}
                                  </p>
                                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                                    <p className="text-[11px] text-muted-foreground capitalize">Sentiment: {review.sentiment}</p>
                                    {(review.reportReason ? review.reportReason.split(' and ') : ['Review']).map((tag) => (
                                      <span key={`${review._id}-${tag}`} className="text-[10px] px-2 py-1 rounded-full bg-muted text-muted-foreground font-bold">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                  {review.comment.length > 95 && (
                                    <button type="button" onClick={() => toggleReviewExpanded(review._id)} className="mt-2 text-xs font-bold text-primary hover:underline">
                                      {isExpanded ? 'Show less' : 'View full review'}
                                    </button>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</td>
                                <td className="px-4 py-3">
                                  <span className={cn(
                                    'text-xs px-2 py-1 rounded-full font-bold capitalize',
                                    review.status === 'approved' && 'bg-green-100 text-green-700',
                                    review.status === 'flagged' && 'bg-red-100 text-red-700',
                                    review.status === 'hidden' && 'bg-slate-100 text-slate-700'
                                  )}>
                                    {review.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <div className="relative inline-block text-left">
                                    <button
                                      type="button"
                                      onClick={() => setReviewMenuOpenId((prev) => (prev === review._id ? null : review._id))}
                                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-primary text-white"
                                    >
                                      Actions
                                      <ChevronDown size={14} />
                                    </button>
                                    <DropdownMenu
                                      open={reviewMenuOpenId === review._id}
                                      onClose={() => setReviewMenuOpenId(null)}
                                      items={[
                                        {
                                          label: review.status === 'approved' ? 'Approved' : 'Approve',
                                          icon: <ShieldCheck size={14} />,
                                          disabled: review.status === 'approved',
                                          onClick: () => handleApproveReview(review._id),
                                        },
                                        {
                                          label: review.status === 'hidden' ? 'Hidden' : 'Hide',
                                          icon: <Eye size={14} />,
                                          disabled: review.status === 'hidden',
                                          onClick: () => openConfirm('hide', review),
                                        },
                                        {
                                          label: 'Warn User',
                                          icon: <ShieldAlert size={14} />,
                                          onClick: () => openConfirm('warn', review),
                                        },
                                        {
                                          label: 'Delete',
                                          icon: <Trash2 size={14} />,
                                          variant: 'danger',
                                          onClick: () => openConfirm('delete', review),
                                        },
                                      ]}
                                    />
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <p className="text-sm text-muted-foreground">
                        Showing {Math.min((page - 1) * pageSize + 1, filteredReviews.length)} - {Math.min(page * pageSize, filteredReviews.length)} of {filteredReviews.length} reviews
                      </p>
                      <div className="flex items-center gap-3">
                        <select
                          value={pageSize}
                          onChange={(event) => {
                            setPageSize(Number(event.target.value));
                            setPage(1);
                          }}
                          className="rounded-xl border bg-background px-3 h-11 text-sm"
                        >
                          <option value={5}>5 / page</option>
                          <option value={10}>10 / page</option>
                          <option value={20}>20 / page</option>
                        </select>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={page === 1}
                            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                            className={cn('px-3 py-2 rounded-xl border text-sm font-bold', page === 1 && 'opacity-50 cursor-not-allowed')}
                          >
                            Prev
                          </button>
                          <button
                            type="button"
                            disabled={page * pageSize >= filteredReviews.length}
                            onClick={() => setPage((prev) => prev + 1)}
                            className={cn('px-3 py-2 rounded-xl border text-sm font-bold', page * pageSize >= filteredReviews.length && 'opacity-50 cursor-not-allowed')}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {!dashboardLoading && feedbackTab === 'flagged-reviews' && filteredReviews.length === 0 && (
                  <EmptyState
                    icon={AlertTriangle}
                    title="No flagged reviews"
                    description="Reported or toxic reviews will appear here for review."
                  />
                )}

                {!dashboardLoading && feedbackTab === 'flagged-reviews' && filteredReviews.length > 0 && (
                  <div className="space-y-3">
                    {filteredReviews.map((review) => (
                      <div key={review._id} className="border rounded-xl p-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-2">
                          <div>
                            <p className="font-bold text-primary">{review.itemName}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <button type="button" onClick={() => openUserProfile(review.userId)} className="text-xs text-muted-foreground hover:text-primary font-semibold">
                                Buyer: {review.reviewerName}
                              </button>
                              <span className="text-xs text-muted-foreground">|</span>
                              <button type="button" onClick={() => openUserProfile(review.sellerId)} className="text-xs text-muted-foreground hover:text-primary font-semibold">
                                Seller: {review.sellerName}
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-foreground">{review.comment}</p>
                          <div className="flex flex-wrap gap-2">
                            {(review.reportReason ? review.reportReason.split(' and ') : ['Flagged by moderation system']).map((tag) => (
                              <span key={`${review._id}-${tag}`} className="text-[10px] px-2 py-1 rounded-full bg-red-100 text-red-700 font-black uppercase tracking-widest">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={!isAdmin || review.status === 'approved'}
                            onClick={() => handleApproveReview(review._id)}
                            className={cn('px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white', (!isAdmin || review.status === 'approved') && 'opacity-60 cursor-not-allowed')}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            disabled={!isAdmin}
                            onClick={() => openConfirm('hide', review)}
                            className={cn('px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-700 text-white', !isAdmin && 'opacity-60 cursor-not-allowed')}
                          >
                            Hide
                          </button>
                          <button
                            type="button"
                            disabled={!isAdmin}
                            onClick={() => openConfirm('warn', review)}
                            className={cn('px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-600 text-white', !isAdmin && 'opacity-60 cursor-not-allowed')}
                          >
                            Warn User
                          </button>
                          <button
                            type="button"
                            disabled={!isAdmin}
                            onClick={() => openConfirm('delete', review)}
                            className={cn('px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600 text-white', !isAdmin && 'opacity-60 cursor-not-allowed')}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!dashboardLoading && feedbackTab === 'seller-ratings' && (
                  <div className="space-y-3">
                    {sellerFeedback.length === 0 && (
                      <EmptyState
                        icon={ShieldCheck}
                        title="No seller feedback yet"
                        description="Seller ratings will populate once buyers leave reviews."
                      />
                    )}
                    {sellerFeedback.map((seller) => (
                      <div key={seller.sellerId} className="border rounded-xl p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-primary">{seller.sellerName}</p>
                            {seller.isHighlighted && <span className="text-[10px] px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-black uppercase tracking-widest">Highlighted</span>}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{seller.totalReviews} reviews | {seller.positiveCount} positive | {seller.flaggedCount} flagged</p>
                        </div>
                        <div className="flex flex-col md:items-end gap-2">
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Average Rating</p>
                              <p className="text-2xl font-black text-primary">{seller.averageRating.toFixed(1)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Trust Score</p>
                              <p className="text-2xl font-black text-primary" title="Based on ratings, flagged reviews, and sentiment mix.">{seller.trustScore}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            disabled={!isAdmin}
                            onClick={() => handleToggleHighlightSeller(seller.sellerId)}
                            className={cn('px-3 py-1.5 rounded-lg text-xs font-bold bg-secondary text-white self-start md:self-end', !isAdmin && 'opacity-60 cursor-not-allowed')}
                          >
                            {seller.isHighlighted ? 'Remove Highlight' : 'Highlight Seller'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!dashboardLoading && feedbackTab === 'insights' && (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <div className="rounded-xl border p-5">
                      <h3 className="font-black text-primary text-lg">Sentiment Breakdown</h3>
                      <div className="mt-4 h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie data={feedbackChartData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={4}>
                              {feedbackChartData.map((entry) => (
                                <Cell key={entry.name} fill={entry.fill} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="rounded-xl border p-5">
                      <h3 className="font-black text-primary text-lg">AI Insights</h3>
                      <div className="mt-4 h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={complaintData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} />
                            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="hsl(var(--primary))" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-5 space-y-3">
                        {reviewInsights.length === 0 && (
                          <p className="text-sm text-muted-foreground">No strong complaint patterns detected yet.</p>
                        )}
                        {reviewInsights.map((insight) => (
                          <div key={insight.label} className="flex items-center justify-between rounded-xl border px-4 py-3">
                            <span className="text-sm font-semibold text-foreground">{insight.label}</span>
                            <span className="text-sm font-black text-primary">{insight.count}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-5 rounded-xl bg-primary/5 p-4 text-sm text-foreground flex items-start gap-2">
                        <Info size={16} className="mt-0.5 shrink-0 text-primary" />
                        <p>Trust score is derived from rating average, flagged review share, and sentiment mix. Repeated flags can reduce trust even when ratings look healthy.</p>
                      </div>
                    </div>
                  </div>
                )}

                <ConfirmDialog
                  open={confirmState.open}
                  title={confirmState.action === 'delete' ? 'Delete review?' : confirmState.action === 'warn' ? 'Warn user?' : 'Hide review?'}
                  description={confirmState.action === 'delete'
                    ? 'This permanently removes the review from the moderation console.'
                    : confirmState.action === 'warn'
                      ? 'This will warn the review author and mark the review as flagged.'
                      : 'This hides the review from public visibility while keeping it available to admins.'}
                  confirmLabel={confirmState.action === 'delete' ? 'Delete' : confirmState.action === 'warn' ? 'Warn User' : 'Hide'}
                  confirmTone={confirmState.action === 'delete' ? 'danger' : 'warning'}
                  onConfirm={executeConfirmedAction}
                  onCancel={closeConfirm}
                />

                {profileModalUser && (
                  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
                    <div className="w-full max-w-lg rounded-3xl border bg-card p-6 shadow-2xl">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Quick User Profile</p>
                          <h3 className="mt-2 text-2xl font-black text-primary">{`${profileModalUser.firstName || 'Unknown'} ${profileModalUser.lastName || 'User'}`.trim()}</h3>
                          <p className="text-sm text-muted-foreground">{profileModalUser.universityEmail || profileModalUser.email || profileModalUser._id}</p>
                        </div>
                        <button type="button" onClick={() => setProfileModalUser(null)} className="w-10 h-10 rounded-xl border bg-background flex items-center justify-center">
                          <X size={16} />
                        </button>
                      </div>
                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-xl border p-4">
                          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Role</p>
                          <p className="mt-2 font-bold text-primary capitalize">{profileModalUser.role || 'student'}</p>
                        </div>
                        <div className="rounded-xl border p-4">
                          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Status</p>
                          <p className="mt-2 font-bold text-primary">{blockedIds.includes(profileModalUser._id) ? 'Blocked' : 'Active'}</p>
                        </div>
                      </div>
                      <div className="mt-5 flex items-center gap-3 justify-end">
                        <button type="button" onClick={() => setProfileModalUser(null)} className="px-4 py-2 rounded-xl border text-sm font-bold bg-background">Close</button>
                        <button type="button" onClick={() => {
                          handleBlockToggle(profileModalUser._id);
                          setProfileModalUser(null);
                        }} className="px-4 py-2 rounded-xl text-sm font-bold bg-red-600 text-white">
                          {blockedIds.includes(profileModalUser._id) ? 'Unblock User' : 'Block User'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── EVENTS ── */}
          {activeTab === 'events' && <AdminEventsTab />}

          {/* ── SETTINGS ── */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-black text-primary">Platform Settings</h1>
              <p className="text-muted-foreground font-medium">Configure global platform behaviour</p>
              <div className="rounded-2xl border bg-card shadow-xl p-6 space-y-5">
                <div>
                  <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Discount Rule (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    disabled={!isAdmin}
                    value={settingsState.discountRule}
                    onChange={(event) => setSettingsState((prev) => ({ ...prev, discountRule: Number(event.target.value) }))}
                    className={cn('mt-1 w-full rounded-xl border bg-background px-3 h-11 text-sm', !isAdmin && 'opacity-60 cursor-not-allowed')}
                  />
                </div>
                <div className="flex items-center justify-between border rounded-xl p-4">
                  <div>
                    <p className="font-bold text-foreground">AI Auto Moderation</p>
                    <p className="text-xs text-muted-foreground">Enable automated moderation assistance for flagged items.</p>
                  </div>
                  <input
                    type="checkbox"
                    disabled={!isAdmin}
                    checked={settingsState.aiAutoModeration}
                    onChange={(event) => setSettingsState((prev) => ({ ...prev, aiAutoModeration: event.target.checked }))}
                  />
                </div>
                <div className="flex items-center justify-between border rounded-xl p-4">
                  <div>
                    <p className="font-bold text-foreground">Maintenance Mode</p>
                    <p className="text-xs text-muted-foreground">Temporarily restrict non-admin platform actions.</p>
                  </div>
                  <input
                    type="checkbox"
                    disabled={!isAdmin}
                    checked={settingsState.maintenanceMode}
                    onChange={(event) => setSettingsState((prev) => ({ ...prev, maintenanceMode: event.target.checked }))}
                  />
                </div>
                <button
                  type="button"
                  disabled={!isAdmin}
                  onClick={saveSettings}
                  className={cn('px-4 py-2 rounded-xl text-sm font-bold bg-primary text-white', !isAdmin && 'opacity-60 cursor-not-allowed')}
                >
                  Save Settings
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
