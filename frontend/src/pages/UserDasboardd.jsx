import React, { useState, useEffect } from "react";
import axios from "axios";
import { cn } from '../lib/utils';
import { useNavigate, useLocation } from "react-router-dom";
import { Building2, Search, Bell, ShoppingCart, User, Heart, History, PlusCircle} from "lucide-react";
import { UserSidebar } from "../components/shared/UserSidebar";
import { MarketplaceHeader } from "../components/MarketplaceHeader";
import { FeaturedEvents } from "../components/FeaturedEvents";
import { UserAnalyticsTab } from "../components/UserAnalyticsTab";
import { UserReportsTab } from "../components/UserReportsTab";
import { UserCartTab } from "../components/UserCartTab";
import { UserWishlistTab } from "../components/UserWishlistTab";
import { EventCard } from "../components/EventCard";
import MarketplaceUI from "../components/MarketplaceUI";
import { UserEventsTab } from "../components/UserEventsTab";


function UserNavbar({ user, setActiveTab }) {
  return (
    <nav className="h-20 bg-background/95 backdrop-blur-md border-b fixed top-0 left-0 right-0 z-40 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <span className="text-white font-black text-xl">S</span>
        </div>
        <div className="hidden md:flex flex-col cursor-pointer" onClick={() => setActiveTab('overview')}>
           <span className="font-black text-primary leading-tight">SLIIT MARKETPLACE</span>
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

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get("/api/events");
        // Map backend Event model to FeaturedEvents expected props
        const mappedEvents = data.data.map(event => ({
          id: event._id,
          title: event.name,
          date: new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          attendees: Math.floor(Math.random() * 200) + 50, // Realistic placeholder for now
          category: event.category,
          imageUrl: event.imageUrl,
          description: event.description
        }));
        setEvents(mappedEvents);
      } catch (error) {
        console.error("Error fetching live events:", error);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

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


          {activeTab === 'marketplace' && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><MarketplaceUI /></div>}
          {activeTab === 'cart' && <UserCartTab />}

          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <MarketplaceHeader onSearch={() => {}} />
              {loadingEvents ? (
                <div className="flex justify-center py-10">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <FeaturedEvents events={events} onViewAll={() => setActiveTab('events')} />
              )}
            </div>
          )}

          {activeTab === 'analytics' && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><UserAnalyticsTab /></div>}
          {activeTab === 'reports' && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><UserReportsTab /></div>}
          {activeTab === 'events' && <UserEventsTab />}
          
          {/* Placeholder Tabs */}
          {activeTab === 'sell' && (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 bg-muted/20 rounded-[3rem] border-2 border-dashed border-muted">
               <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-primary">
                  <PlusCircle size={40} />
               </div>
                <div>
                   <h1 className="text-3xl font-black text-primary mb-2">List an Item</h1>
                   <p className="text-muted-foreground font-medium">The selling feature is coming soon to the campus marketplace!</p>
                </div>
            </div>
          )}
          
          {activeTab === 'transactions' && (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 bg-muted/20 rounded-[3rem] border-2 border-dashed border-muted">
               <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-primary">
                  <History size={40} />
               </div>
                <div>
                   <h1 className="text-3xl font-black text-primary mb-2">My Transactions</h1>
                   <p className="text-muted-foreground font-medium">Transaction history for your campus deals is coming soon!</p>
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
