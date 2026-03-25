import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import {
  LayoutDashboard,
  ShoppingBag,
  PlusCircle,
  History,
  ShieldCheck,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from "lucide-react";

const navigationItems = [
  {
    id: "/user-dashboard",
    name: "Dashboard",
    icon: LayoutDashboard,
    description: "Overview & stats"
  },
  {
    id: "/items",
    name: "Marketplace",
    icon: ShoppingBag,
    description: "Browse all items"
  },
  {
    id: "/items/new",
    name: "Sell Item",
    icon: PlusCircle,
    description: "List a new item"
  },
  {
    id: "/trust",
    name: "Trust & Security",
    icon: ShieldCheck,
    description: "Verification & reports"
  },
  {
    id: "/profile",
    name: "Profile",
    icon: User,
    description: "User settings"
  },
  {
    id: "/admin-dashboard",
    name: "Admin Hub",
    icon: ShieldCheck,
    description: "System management"
  },
];

export function Sidebar({ isExpanded, setIsExpanded }) {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  if (isMobile) return null;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen transition-all duration-300 z-50 p-4",
        isExpanded ? "w-64" : "w-24"
      )}
    >
      <div className={cn(
        "h-full flex flex-col shadow-2xl border border-white/10 overflow-hidden relative rounded-[2rem] transition-all duration-300",
        "bg-gradient-to-b from-[#001f5c] via-[#001f5c] to-[#002a7a]"
      )}>
        {/* Toggle Button - Refined Position */}
        <button
          onClick={handleToggle}
          className="absolute right-4 top-10 w-8 h-8 flex items-center justify-center bg-secondary/20 hover:bg-secondary/40 text-white rounded-full backdrop-blur-md transition-all z-50 border border-white/10"
        >
          {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* Logo Section */}
        <div className="p-8 flex flex-col items-center">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-2xl mb-4 p-2 rotate-3 hover:rotate-0 transition-transform">
            <div className="bg-primary w-full h-full rounded-xl flex items-center justify-center text-white font-black text-xl shadow-inner">
              S
            </div>
          </div>
          {isExpanded && (
            <div className="text-center animate-in fade-in slide-in-from-top-2 duration-500">
              <h2 className="text-white font-black text-lg tracking-tight">SLIIT EMS</h2>
              <p className="text-secondary text-[10px] uppercase font-bold tracking-[0.2em] leading-none mt-1">
                Marketplace
              </p>
            </div>
          )}
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 space-y-3 mt-4 overflow-y-auto scrollbar-hide">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.id;

            return (
              <Link
                key={item.id}
                to={item.id}
                className={cn(
                  "relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group overflow-hidden",
                  isActive
                    ? "bg-gradient-to-r from-secondary to-secondary/80 text-white shadow-lg shadow-secondary/25 scale-105"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 flex-shrink-0 transition-colors",
                  isActive ? "text-white" : "text-white/50 group-hover:text-white"
                )} />

                {isExpanded && (
                  <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
                    <span className="font-bold text-sm whitespace-nowrap">{item.name}</span>
                    {isActive && (
                      <span className="text-[10px] text-white/70 leading-none mt-0.5">{item.description}</span>
                    )}
                  </div>
                )}

                {/* Tooltip for collapsed state */}
                {!isExpanded && (
                  <div className="absolute left-full ml-6 px-4 py-2 bg-[#001f5c] border border-white/10 text-white text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 whitespace-nowrap shadow-2xl translate-x-2 group-hover:translate-x-0">
                    {item.name}
                    <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-[#001f5c] rotate-45 border-l border-b border-white/10" />
                  </div>
                )}

                {isActive && (
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/20" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile / Footer Section */}
        <div className="p-6 mt-auto border-t border-white/5 bg-white/5 backdrop-blur-md">
          <div className={cn(
            "flex items-center gap-4 transition-all",
            !isExpanded && "justify-center"
          )}>
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-white font-bold shadow-lg">
              AD
            </div>
            {isExpanded && (
              <div className="flex flex-col">
                <span className="text-white text-sm font-bold truncate max-w-[120px]">Admin User</span>
                <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest">IT210000</span>
              </div>
            )}
          </div>
          <button className="w-full mt-4 flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:bg-destructive/10 hover:text-destructive transition-all group">
            <LogOut size={18} className="group-hover:scale-110 transition-transform" />
            {isExpanded && <span className="text-xs font-bold uppercase tracking-widest">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
