import React, { useMemo, useState } from "react";
import { cn } from '../lib/utils';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { 
  Users, ShoppingBag, AlertTriangle, TrendingUp, ShieldCheck, 
  ArrowUpRight, ArrowDownRight, LayoutDashboard,
  LogOut, Bell, Settings, Activity, Receipt, BadgeDollarSign, Calendar,
  Menu, X, Search, Filter
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
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
              <p className="text-muted-foreground font-medium">Review flagged content and reported listings</p>
              <div className="rounded-2xl border bg-card shadow-xl p-6 space-y-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={moderationSearch}
                    onChange={(event) => setModerationSearch(event.target.value)}
                    placeholder="Search flagged listings"
                    className="w-full rounded-xl border bg-background pl-9 pr-3 h-11 text-sm"
                  />
                </div>

                {dashboardLoading && <div className="h-48 rounded-xl bg-muted animate-pulse" />}

                {!dashboardLoading && filteredModerationQueue.length === 0 && (
                  <EmptyState
                    icon={AlertTriangle}
                    title="No flagged listings"
                    description="Moderation queue is empty right now."
                  />
                )}

                {!dashboardLoading && filteredModerationQueue.length > 0 && (
                  <div className="space-y-3">
                    {filteredModerationQueue.map((entry) => (
                      <div key={entry._id} className="border rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-3 justify-between">
                        <div>
                          <p className="font-bold text-primary">{entry.title}</p>
                          <p className="text-xs text-muted-foreground">{entry.category} - {entry.reason}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={!isAdmin}
                            onClick={() => handleModerationAction(entry._id)}
                            className={cn('px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white', !isAdmin && 'opacity-60 cursor-not-allowed')}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            disabled={!isAdmin}
                            onClick={() => handleModerationAction(entry._id)}
                            className={cn('px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600 text-white', !isAdmin && 'opacity-60 cursor-not-allowed')}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
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
