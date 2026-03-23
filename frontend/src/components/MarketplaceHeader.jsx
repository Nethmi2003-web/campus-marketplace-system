import React from "react";
import { Search, Filter, SlidersHorizontal, Sparkles } from "lucide-react";
// Replaced local ui import
// Replaced local ui import
import { useState } from "react";
import { cn } from "../lib/utils";


const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});
Button.displayName = "Button";


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


export function MarketplaceHeader({ 
  onSearch, 
  onCategoryChange, 
  selectedCategory = "all" 
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", name: "All Events", icon: "🎯", count: 24 },
    { id: "tech", name: "Technology", icon: "💻", count: 8 },
    { id: "sports", name: "Sports", icon: "⚽", count: 5 },
    { id: "culture", name: "Cultural", icon: "🎨", count: 6 },
    { id: "academic", name: "Academic", icon: "📚", count: 4 },
    { id: "social", name: "Social", icon: "🤝", count: 3 },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80 p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-secondary" />
            <Badge className="bg-secondary/20 text-white border-secondary/30">
              {categories.find(c => c.id === "all")?.count} Events Available
            </Badge>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Discover Campus Events
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mb-6">
            Explore, register, and participate in exciting events happening at SLIIT
          </p>

          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for events, workshops, seminars..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-32 py-4 rounded-2xl bg-white shadow-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <Button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-secondary hover:bg-secondary/90 shadow-md"
              >
                Search
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex items-center gap-2 flex-shrink-0">
          <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Categories:</span>
        </div>
        
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange?.(category.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 whitespace-nowrap",
                "border-2 shadow-sm hover:shadow-md hover:scale-105",
                selectedCategory === category.id
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
                  : "bg-card text-foreground border-border hover:border-primary/50"
              )}
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.name}</span>
              <Badge 
                className={cn(
                  "ml-1 transition-colors",
                  selectedCategory === category.id
                    ? "bg-white/20 text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {category.count}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {selectedCategory !== "all" && (
        <div className="flex items-center gap-2 p-4 bg-accent/50 rounded-xl border border-border">
          <Filter className="w-4 h-4 text-primary" />
          <span className="text-sm text-foreground">Active filter:</span>
          <Badge className="bg-primary text-white">
            {categories.find(c => c.id === selectedCategory)?.name}
          </Badge>
          <button
            onClick={() => onCategoryChange?.("all")}
            className="ml-auto text-sm text-primary hover:text-primary/80 font-medium"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
