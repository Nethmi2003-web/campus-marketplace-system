import React from "react";
import { Search, Bell, User, ShoppingCart } from "lucide-react";
import { cn } from "../../lib/utils";

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground",
  };
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

export function Navbar({ isSidebarExpanded }) {
  return (
    <nav className={cn(
      "h-20 fixed top-0 right-0 left-0 z-30 transition-all duration-300 backdrop-blur-md bg-background/60 border-b border-border/40",
      isSidebarExpanded ? "lg:left-64" : "lg:left-24"
    )}>
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search Bar */}
        <div className="hidden md:flex relative max-w-md w-full ml-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search items, categories..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
          />
        </div>

        {/* Brand (Mobile Only) */}
        <div className="lg:hidden flex items-center gap-2">
           <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CM</span>
           </div>
           <span className="font-bold text-primary">CampusMarket</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-muted-foreground hover:bg-muted rounded-xl transition-colors">
            <ShoppingCart size={20} />
            <Badge className="absolute -top-1 -right-1 bg-secondary text-[8px] min-w-[15px] h-[15px] flex items-center justify-center p-0">3</Badge>
          </button>
          
          <button className="relative p-2 text-muted-foreground hover:bg-muted rounded-xl transition-colors">
            <Bell size={20} />
            <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
          </button>

          <div className="h-8 w-[1px] bg-border mx-1" />

          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Admin User</p>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Student ID: IT210000</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <User className="text-white" size={20} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
