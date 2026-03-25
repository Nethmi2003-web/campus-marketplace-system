import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ShoppingCart, 
  PlusCircle, 
  History, 
  BarChart2, 
  FileText, 
  Heart, 
  User, 
  LogOut,
  Calendar 
} from "lucide-react";

export function UserSidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("std_userInfo");
    navigate("/");
  };

  const tabs = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
    { id: "cart", label: "My Cart", icon: ShoppingCart },
    { id: "transactions", label: "Transactions", icon: History },
    { id: "analytics", label: "My Analytics", icon: BarChart2 },
    { id: "reports", label: "My Reports", icon: FileText },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "events", label: "Campus Events", icon: Calendar },
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
