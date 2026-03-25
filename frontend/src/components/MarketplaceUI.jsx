import React, { useState, useEffect } from "react";
import { Search, SlidersHorizontal, PackageSearch, X, Heart, ShoppingCart, User, Tag, Clock, CheckCircle, Loader2 } from "lucide-react";
import axios from "axios";
import { cn } from "../lib/utils";

// --- INLINE UI COMPONENTS --- //

export const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
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

export const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
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

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

function InlineItemCard({
  id,
  title,
  price,
  category,
  condition,
  imageUrl,
  seller,
  status = "Available",
  stockQuantity = 0,
  isFeatured = false,
  onAddToCart,
  onToggleWishlist,
  isLiked: initialLiked = false
}) {
  const [isLiked, setIsLiked] = useState(initialLiked);


  React.useEffect(() => {
    setIsLiked(initialLiked);
  }, [initialLiked]);

  const handleLikeClick = (e) => {
    e.stopPropagation();
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    onToggleWishlist(id, newLikedState);
  };

  return (
    <div className="group overflow-hidden border-2 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 bg-card rounded-3xl flex flex-col text-card-foreground shadow-sm">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={imageUrl || "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=500&auto=format&fit=crop"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
           {isFeatured && (
             <Badge className="bg-secondary text-white border-none shadow-lg px-3 py-1">
               🔥 HOT DEAL
             </Badge>
           )}
           <Badge className="bg-primary/80 backdrop-blur-md text-white border-none px-3 py-1">
             {category}
           </Badge>
        </div>

        <Badge 
          variant="outline" 
          className={cn(
            "absolute top-4 right-4 backdrop-blur-md border-none px-3 py-1 font-bold",
            stockQuantity > 0 ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white"
          )}
        >
          {stockQuantity > 0 ? "Available" : "Sold Out"}
        </Badge>

        {/* Action Buttons (Overlay) */}
        <div className="absolute bottom-4 right-4 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <Button 
              size="icon" 
              variant="secondary" 
              className={cn("rounded-full w-10 h-10 shadow-xl border bg-white/80 backdrop-blur-sm transition-all", isLiked ? "bg-red-500 text-white border-red-600 shadow-red-500/20" : "text-muted-foreground hover:bg-white hover:text-red-500")}
              onClick={handleLikeClick}
            >
              <Heart size={18} className={cn(isLiked && "fill-current")} />
            </Button>
           <Button 
             size="icon" 
             className={cn(
               "rounded-full w-10 h-10 shadow-xl transition-all",
               stockQuantity > 0 
                 ? "bg-white text-primary hover:bg-primary hover:text-white" 
                 : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
             )}
             onClick={() => stockQuantity > 0 && onAddToCart(id)}
             disabled={stockQuantity === 0}
           >
             <ShoppingCart size={18} />
           </Button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
           <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
              <Tag size={12} />
              <span>{condition}</span>
           </div>
           <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
              <Clock size={12} />
              <span>2 days ago</span>
           </div>
           <div className={cn(
             "flex items-center gap-1 px-2 py-1 rounded-md font-bold",
             stockQuantity > 0 ? "bg-primary/10 text-primary" : "bg-red-100 text-red-600"
           )}>
              <PackageSearch size={12} />
              <span>{stockQuantity > 0 ? `${stockQuantity} In Stock` : "Out of Stock"}</span>
           </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Price</p>
            <p className="text-2xl font-black text-primary">LKR {price.toLocaleString()}</p>
          </div>
          
          <div className="flex flex-col items-end">
             <div className="flex items-center gap-1.5 mb-1 cursor-pointer hover:opacity-80 transition-opacity">
                <span className="text-[11px] font-medium text-foreground">{seller || "Anonym"}</span>
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border">
                   <User size={14} className="text-muted-foreground" />
                </div>
             </div>
             <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold">
                <CheckCircle size={10} />
                <span>Verified Seller</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- MAIN PAGE COMPONENT --- //

const CATEGORIES = [
  { id: "all", name: "All Items" },
  { id: "Books", name: "Books" },
  { id: "Electronics", name: "Electronics" },
  { id: "Lab Equipment", name: "Lab Equipment" },
  { id: "Clothing & Uniforms", name: "Clothing & Uniforms" },
  { id: "Sports & Fitness", name: "Sports & Fitness" },
  { id: "Services & Tutoring", name: "Services & Tutoring" },
  { id: "Other", name: "Other" },
];

export default function MarketplaceUI() {
  const [items, setItems] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      
      // Fetch Marketplace Items
      const itemsRes = await axios.get("/api/items");
      if (itemsRes.data.success) {
        setItems(itemsRes.data.data);
      }

      // Fetch User Wishlist to show already liked items
      if (userInfo.token) {
        try {
          const wishlistRes = await axios.get("/api/wishlist", {
            headers: { Authorization: `Bearer ${userInfo.token}` }
          });
          if (wishlistRes.data.success) {
            const ids = new Set(wishlistRes.data.data.products.map(p => p._id || p));
            setWishlistIds(ids);
          }
        } catch (wishErr) {
          console.warn("Wishlist fetch failed:", wishErr);
          // Non-critical error, proceed with items only
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching marketplace data:", err);
      setError("Failed to load items. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleWishlist = async (productId, isLiked) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      if (!userInfo.token) {
        alert("Please login to save items to your wishlist.");
        return;
      }

      if (isLiked) {
        await axios.post("/api/wishlist", { productId }, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        setWishlistIds(prev => new Set(prev).add(productId));
      } else {
        await axios.delete(`/api/wishlist/${productId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        setWishlistIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err);
      // Revert local state if needed
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      if (!userInfo.token) {
        alert("Please login to add items to your cart.");
        return;
      }

      const response = await axios.post("/api/cart", 
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );

      if (response.data.success) {
        alert("Item added to cart successfully!");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert(err.response?.data?.message || "Failed to add item to cart.");
    }
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Fetching handled implicitly by rendering filteredItems or empty state

  if (error) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-start pt-32 space-y-4">
        <X className="w-12 h-12 text-red-500" />
        <p className="text-red-500 font-bold text-lg">{error}</p>
        <Button onClick={() => fetchData()} className="px-8 py-3 bg-primary text-white rounded-2xl font-black shadow-lg">Retry Sync</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-4 md:p-6 pb-24 md:pb-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black text-primary tracking-tight">Campus Marketplace</h1>
            <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20 font-black px-3 py-1">
              {filteredItems.length} Items Live
            </Badge>
          </div>
          <p className="text-muted-foreground font-medium text-lg">Discover the best deals from your fellow students</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
           <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search items..." 
                className="pl-9 rounded-xl border-muted focus:border-primary transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
                  <X size={14} />
                </button>
              )}
           </div>
           <Button variant="outline" className="rounded-xl gap-2 border-muted hover:border-primary/30">
              <SlidersHorizontal size={16} />
              <span className="hidden sm:inline">Filters</span>
           </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              "px-5 py-2 rounded-full text-xs font-bold transition-all border-2 whitespace-nowrap",
              selectedCategory === cat.id
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                : "bg-muted/50 text-muted-foreground border-transparent hover:border-muted hover:text-primary"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredItems.map(item => (
            <InlineItemCard 
              key={item._id} 
              id={item._id}
              {...item} 
              seller={item.seller?.firstName ? `${item.seller.firstName} ${item.seller.lastName}` : "Anonymous"}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              isLiked={wishlistIds.has(item._id)}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 bg-muted/20 rounded-[3rem] border-2 border-dashed border-muted">
           <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
              <PackageSearch size={40} className="text-muted-foreground" />
           </div>
           <div>
              <h3 className="text-xl font-bold text-primary">No items found</h3>
              <p className="text-muted-foreground">Try adjusting your search or category filters</p>
           </div>
           <Button variant="link" onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}>
              Clear all filters
           </Button>
        </div>
      )}
    </div>
  );
}
