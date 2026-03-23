import React, { useState } from "react";
import { cn } from '../lib/utils';
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Users, ShoppingBag, AlertTriangle, TrendingUp, ShieldCheck, 
  MoreHorizontal, ArrowUpRight, ArrowDownRight, LayoutDashboard,
  LogOut, Menu, Bell, Search, Settings, Activity
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

// Removed IoT specific chart imports

// -------------------------------------------------------------
// STANDALONE ADMIN NAVBAR
// -------------------------------------------------------------
function AdminNavbar({ user }) {
  return (
    <nav className="h-20 bg-background/95 backdrop-blur-md border-b sticky top-0 z-40 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <ShieldCheck className="text-secondary w-8 h-8" />
        <h2 className="hidden md:block font-black text-xl text-primary tracking-tight">Admin<span className="text-secondary">Hub</span></h2>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative">
          <Bell className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-foreground">{user?.firstName || 'System Admin'}</p>
            <p className="text-[10px] text-secondary font-black uppercase tracking-widest">Master Control</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shadow-lg">
             <span className="text-white font-bold">{user?.firstName?.charAt(0) || 'A'}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

// -------------------------------------------------------------
// STANDALONE ADMIN SIDEBAR
// -------------------------------------------------------------
function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const tabs = [
    { id: "overview", label: "System Overview", icon: LayoutDashboard },
    { id: "users", label: "Manage Users", icon: Users },
    { id: "listings", label: "Active Listings", icon: ShoppingBag },
    { id: "moderation", label: "Trust & Safety", icon: AlertTriangle },
    { id: "settings", label: "Platform Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 fixed left-0 top-20 bottom-0 border-r bg-card/50 backdrop-blur-3xl p-4 flex flex-col hidden lg:flex">
      <div className="space-y-2 flex-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold",
              tab.id === 'overview' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted hover:text-foreground"
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

// -------------------------------------------------------------
// MAIN ADMIN DASHBOARD
// -------------------------------------------------------------
export default function AdmnDashboardd() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  
  // Aggressive Session Validation
  React.useEffect(() => {
    if (!userInfo.token) {
      navigate('/');
      return;
    }
    const verifySession = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/users/me", {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        if (res.status === 401) {
          alert('Admin Session Expired: Security mechanism detected a new login. You have been securely signed out.');
          localStorage.removeItem("userInfo");
          navigate('/');
        }
      } catch (err) {
        console.error('Session validation error:', err);
      }
    };
    verifySession();
  }, [navigate, userInfo.token]);

  const adminStats = [
    { title: "Total Users", value: "1,284", change: "+12.5%", trend: "up", icon: Users },
    { title: "Active Listings", value: "452", change: "+5.2%", trend: "up", icon: ShoppingBag },
    { title: "Reports", value: "12", change: "-25%", trend: "down", icon: AlertTriangle },
    { title: "Platform Trust", value: "98.2%", change: "+0.4%", trend: "up", icon: ShieldCheck }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AdminNavbar user={userInfo} />
      
      <div className="flex flex-1">
        <AdminSidebar />
        
        <main className="flex-1 lg:ml-64 p-6 md:p-10 space-y-8 animate-in fade-in duration-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-primary tracking-tight">System Administration</h1>
              <p className="text-muted-foreground font-medium">Platform-wide overview and management tools</p>
            </div>
            <button className="px-6 py-2.5 bg-secondary text-white rounded-xl font-bold shadow-lg shadow-secondary/20 hover:bg-secondary/90 transition-all">
              Security Audit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminStats.map((stat, i) => (
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
                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                    <Activity size={12} /> Live
                  </div>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={Array.from({ length: 12 }, (_, i) => ({ name: `${i*2}h`, value: 200 + Math.random() * 500 }))}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                      itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="space-y-6">
              <div className="p-8 bg-gradient-to-br from-[#001f5c] to-primary/90 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                <ShieldCheck size={40} className="text-secondary mb-4" />
                <h3 className="text-2xl font-black leading-tight mb-2">System Integrity Check</h3>
                <p className="text-white/70 text-sm mb-6">All core modules operational. Security patches up to date.</p>
                <button className="w-full bg-white text-primary py-3 rounded-xl font-bold hover:bg-white/90">Run Diagnostic</button>
              </div>
            </div>
          </div>

          {/* Extended Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="rounded-3xl border bg-card shadow-xl p-6">
                 <h3 className="text-xl font-bold text-primary mb-4">Transaction Volume</h3>
                 <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={Array.from({ length: 7 }, (_, i) => ({ name: `Day ${i+1}`, value: 50 + Math.random() * 100 }))}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                        <YAxis hide />
                        <Tooltip contentStyle={{ borderRadius: '12px' }} />
                        <Line type="monotone" dataKey="value" stroke="hsl(var(--secondary))" strokeWidth={4} dot={{ r: 6, fill: 'hsl(var(--secondary))' }} />
                      </LineChart>
                    </ResponsiveContainer>
                 </div>
              </div>
              <div className="p-8 bg-white border border-secondary/20 rounded-3xl shadow-xl border-l-4 border-l-secondary relative overflow-hidden group hover:scale-[1.01] transition-all">
                 <div className="relative z-10">
                    <TrendingUp size={32} className="text-secondary mb-4" />
                    <h3 className="text-2xl font-black text-primary mb-2">Global Market Pulse</h3>
                    <p className="text-muted-foreground font-medium">Real-time demand map and transaction flow across all campuses.</p>
                    <button className="mt-6 font-bold text-secondary text-sm uppercase tracking-widest hover:underline flex items-center gap-2">
                       Explore Heatmap <ArrowUpRight size={16} />
                    </button>
                 </div>
              </div>
          </div>
        </main>
      </div>
    </div>
  );
}
