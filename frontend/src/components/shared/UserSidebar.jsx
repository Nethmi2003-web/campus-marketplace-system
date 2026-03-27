import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ShoppingCart, 
  Package,
  Heart, 
  ClipboardList,
  PlusCircle, 
  Tag,
  CreditCard,
  BarChart2, 
  Calendar,
  User, 
  LogOut
} from "lucide-react";

export function UserSidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("std_userInfo");
    navigate("/");
  };

  const sections = [
    {
      title: "MAIN",
      items: [
        { id: "overview", label: "Dashboard Home", icon: LayoutDashboard },
      ]
    },
    {
      title: "BUYING",
      items: [
        { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
        { id: "cart", label: "My Cart", icon: ShoppingCart },
        { id: "purchases", label: "My Purchases", icon: Package },
        { id: "wishlist", label: "Wishlist", icon: Heart },
      ]
    },
    {
      title: "SELLING",
      items: [
        { id: "listings", label: "My Listings", icon: ClipboardList },
        { id: "add_item", label: "Add Item", icon: PlusCircle },
        { id: "sales", label: "My Sales / Orders", icon: Tag },
      ]
    },
    {
      title: "ACTIVITY",
      items: [
        { id: "transactions", label: "Transactions", icon: CreditCard },
        { id: "analytics", label: "My Analytics", icon: BarChart2 },
      ]
    },
    {
      title: "CAMPUS",
      items: [
        { id: "events", label: "Campus Events", icon: Calendar },
      ]
    },
    {
      title: "ACCOUNT",
      items: [
        { id: "profile", label: "Profile Settings", icon: User },
      ]
    }
  ];

  return (
    <aside className="w-64 fixed left-0 top-20 bottom-0 bg-gradient-to-b from-[#001f5c] to-[#002a7a] p-4 flex-col hidden lg:flex rounded-tr-3xl overflow-y-auto pb-6 gap-6">
      <div className="flex-1 mt-2 space-y-6">
        {sections.map((section, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            <h3 className="px-4 text-[11px] font-black tracking-widest text-white/40 mb-1">{section.title}</h3>
            {section.items.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                   "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-bold text-[13px] group text-left",
                   tab.id === activeTab 
                     ? "bg-gradient-to-r from-secondary to-secondary/80 text-white shadow-lg shadow-secondary/20" 
                     : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <tab.icon size={18} className={cn(tab.id === activeTab ? "text-white" : "text-white/50 group-hover:text-white transition-colors")} />
                {tab.label}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-auto pt-4 border-t border-white/10 shrink-0">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/50 hover:bg-red-500/20 hover:text-red-400 transition-all font-bold text-[13px]">
          <LogOut size={18} /> Logout Session
        </button>
      </div>
    </aside>
  );
}
