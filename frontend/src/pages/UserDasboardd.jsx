import React, { useState } from "react";
import { cn } from '../lib/utils';
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Building2, Search, Bell, ShoppingCart, User, LayoutDashboard,
  ShoppingBag, PlusCircle, History, ShieldCheck, LogOut,
  BarChart2, FileText, Heart
} from "lucide-react";

import { MarketplaceHeader } from "../components/MarketplaceHeader";
import { FeaturedEvents } from "../components/FeaturedEvents";

import { UserAnalyticsTab } from "../components/UserAnalyticsTab";
import { UserReportsTab } from "../components/UserReportsTab";
import { UserCartTab } from "../components/UserCartTab";
import { UserWishlistTab } from "../components/UserWishlistTab";
import { EventCard } from "../components/EventCard";
import MarketplaceUI from "../components/MarketplaceUI";

// -------------------------------------------------------------
// STANDALONE USER NAVBAR
// -------------------------------------------------------------
function UserNavbar({ user, setActiveTab }) {
  return (
    <nav className="h-20 bg-background/95 backdrop-blur-md border-b fixed top-0 left-0 right-0 z-40 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <span className="text-white font-black text-xl">S</span>
        </div>
        <div className="hidden md:flex flex-col cursor-pointer" onClick={() => setActiveTab('overview')}>
           <span className="font-black text-primary leading-tight">SLIIT EMS</span>
           <span className="text-[10px] uppercase font-bold text-secondary tracking-widest">Marketplace</span>
        </div>
      </div>
      
      <div className="hidden md:flex relative max-w-md w-full mx-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input type="text" placeholder="Search items, events, users..." className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-muted/30 border-transparent focus:bg-white focus:border-border focus:ring-2 focus:ring-secondary/20 transition-all" />
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={() => setActiveTab('cart')}
          className="relative p-2 text-muted-foreground hover:bg-muted rounded-xl transition-colors"
        >
          <ShoppingCart size={20} />
          <div className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full" />
        </button>
        <button 
          onClick={() => setActiveTab('wishlist')}
          className="relative p-2 text-muted-foreground hover:bg-muted rounded-xl transition-colors"
        >
          <Heart size={20} />
          <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <button className="relative p-2 text-muted-foreground hover:bg-muted rounded-xl transition-colors">
          <Bell size={20} />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-foreground">{user?.firstName || 'Student'}</p>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{user?.faculty || 'Faculty'}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
             <User className="text-white" size={20} />
          </div>
        </div>
      </div>
    </nav>
  );
}


function UserSidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const tabs = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
    { id: "cart", label: "My Cart", icon: ShoppingCart },
    { id: "sell", label: "Sell Item", icon: PlusCircle },
    { id: "transactions", label: "Transactions", icon: History },
    { id: "analytics", label: "My Analytics", icon: BarChart2 },
    { id: "reports", label: "My Reports", icon: FileText },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "profile", label: "Profile Settings", icon: User },
  ];

  return (
    <aside className="w-64 fixed left-0 top-20 bottom-0 bg-gradient-to-b from-[#001f5c] to-[#002a7a] p-4 flex flex-col hidden lg:flex rounded-tr-3xl">
      <div className="space-y-3 flex-1 mt-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
               "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm group text-left",
               tab.id === activeTab 
                 ? "bg-gradient-to-r from-secondary to-secondary/80 text-white shadow-lg shadow-secondary/20 scale-105" 
                 : "text-white/60 hover:text-white hover:bg-white/5"
            )}
          >
            <tab.icon size={20} className={cn(tab.id === activeTab ? "text-white" : "text-white/50 group-hover:text-white transition-colors")} />
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-auto p-4 border-t border-white/10">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:bg-red-500/20 hover:text-red-400 transition-all font-bold">
          <LogOut size={18} /> Logout Session
        </button>
      </div>
    </aside>
  );
}

// -------------------------------------------------------------
// MAIN USER DASHBOARD
// -------------------------------------------------------------
export default function UserDasboardd() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const [activeTab, setActiveTab] = useState("overview");
  
  // Aggressive Session Validation
  React.useEffect(() => {
    if (!userInfo.token) {
      navigate('/');
      return;
    }
    const verifySession = async () => {
      try {
        const res = await fetch("/api/users/me", {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        if (res.status === 401) {
          alert('Session Expired: You have safely logged in from another device.');
          localStorage.removeItem("userInfo");
          navigate('/');
        }
      } catch (err) {
        console.error('Session validation error:', err);
      }
    };
    verifySession();
  }, [navigate, userInfo.token]);

  const featuredEvents = [
    { id: "f1", title: "Tech Conference", date: "Mar 25", attendees: 450, category: "Technology", imageUrl: "https://images.unsplash.com/photo-1582192904915?w=500" },
    { id: "f2", title: "AI Workshop", date: "Mar 28", attendees: 150, category: "Technology", imageUrl: "https://images.unsplash.com/photo-1591453089816?w=500" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      <UserNavbar user={userInfo} setActiveTab={setActiveTab} />
      
      <div className="flex flex-1 min-w-0 pt-20">
        <UserSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 min-w-0 lg:ml-64 p-4 md:p-8 lg:p-10 space-y-8 animate-in fade-in duration-700 overflow-x-hidden">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex flex-col gap-2">
                  <h1 className="text-3xl font-black text-primary tracking-tight">Welcome, {userInfo?.firstName || 'Student'}!</h1>
                  <p className="text-muted-foreground font-medium">Manage your marketplace activity and campus life</p>
              </div>
          </div>

          <div className="overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0">
            <div className="flex gap-2 p-1 bg-muted/50 rounded-xl w-max">
              <button onClick={() => setActiveTab('overview')} className={cn("px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap", activeTab === 'overview' ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground")}>Overview</button>
              <button onClick={() => setActiveTab('marketplace')} className={cn("px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap", activeTab === 'marketplace' ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground")}>Marketplace</button>
              <button onClick={() => setActiveTab('cart')} className={cn("px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap", activeTab === 'cart' ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground")}>My Cart</button>
              <button onClick={() => setActiveTab('analytics')} className={cn("px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap", activeTab === 'analytics' ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground")}>My Analytics</button>
              <button onClick={() => setActiveTab('reports')} className={cn("px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap", activeTab === 'reports' ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground")}>My Reports</button>
              <button onClick={() => setActiveTab('wishlist')} className={cn("px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap", activeTab === 'wishlist' ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground")}>Wishlist</button>
            </div>
          </div>

          {activeTab === 'marketplace' && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><MarketplaceUI /></div>}
          {activeTab === 'cart' && <UserCartTab />}

          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-2">
                <h2 className="text-2xl font-black text-primary">Discover Campus Events</h2>
                <p className="text-muted-foreground font-medium">Join the latest activities across the university</p>
              </div>
              <MarketplaceHeader onSearch={() => {}} onCategoryChange={() => {}} selectedCategory="all" />
              <FeaturedEvents events={featuredEvents} />
            </div>
          )}

          {activeTab === 'analytics' && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><UserAnalyticsTab /></div>}
          {activeTab === 'reports' && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><UserReportsTab /></div>}
          
          {/* Placeholder Tabs */}
          {activeTab === 'sell' && (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 bg-muted/20 rounded-[3rem] border-2 border-dashed border-muted">
               <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-primary">
                  <PlusCircle size={40} />
               </div>
               <div>
                  <h3 className="text-xl font-bold text-primary">List an Item</h3>
                  <p className="text-muted-foreground">The selling feature is coming soon to the campus marketplace!</p>
               </div>
            </div>
          )}
          
          {activeTab === 'transactions' && (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 bg-muted/20 rounded-[3rem] border-2 border-dashed border-muted">
               <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-primary">
                  <History size={40} />
               </div>
               <div>
                  <h3 className="text-xl font-bold text-primary">Purchase History</h3>
                  <p className="text-muted-foreground">Your transaction history will appear here once you start trading.</p>
               </div>
            </div>
          )}
          
          {activeTab === 'profile' && (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 bg-muted/20 rounded-[3rem] border-2 border-dashed border-muted">
               <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-primary">
                  <User size={40} />
               </div>
               <div>
                  <h3 className="text-xl font-bold text-primary">Profile Settings</h3>
                  <p className="text-muted-foreground">Manage your university faculty and contact details here.</p>
               </div>
            </div>
          )}

          {activeTab === 'wishlist' && <UserWishlistTab />}

        </main>
      </div>
    </div>
  );
}
