import React, { useState, useEffect } from "react";
import { Search, SlidersHorizontal, PackageSearch, X, Heart, ShoppingCart, Tag, Loader2, Clock } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import { Button, Badge, Input } from "./shared/UI";

// --- INLINE UI COMPONENTS --- //

// Inline components removed, now using shared UI library

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
    onToggleWishlist(id, !isLiked);
  };

  return (
    <div className="group overflow-hidden border-2 border-white backdrop-blur-xl hover:border-primary/20 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 bg-card/40 rounded-[2.5rem] flex flex-col text-card-foreground shadow-xl shadow-black/5">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden rounded-t-[2.5rem]">
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
        <div className="absolute bottom-4 right-4 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <Button 
              size="icon" 
              className={cn("rounded-2xl w-10 h-10 shadow-xl border bg-white backdrop-blur-sm transition-all", isLiked ? "bg-red-500 text-white border-red-600 shadow-red-500/20" : "text-muted-foreground hover:bg-white hover:text-red-500")}
              onClick={handleLikeClick}
            >
              <Heart size={18} className={cn(isLiked && "fill-current")} />
            </Button>
           <Button 
             size="icon" 
             className={cn(
               "rounded-2xl w-10 h-10 shadow-xl transition-all",
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
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-black text-xl text-primary tracking-tight line-clamp-1 group-hover:text-secondary transition-colors leading-tight">
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

        <div className="flex items-center justify-between pt-5 border-t border-dashed border-muted-foreground/20 mt-auto">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Price</p>
            <p className="text-2xl font-black text-primary tracking-tight">LKR {price.toLocaleString()}</p>
          </div>
          <button onClick={() => stockQuantity > 0 && onAddToCart(id)} className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all hover:scale-110 active:scale-90 shadow-lg shadow-primary/5">
             <ShoppingCart size={20} />
          </button>
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
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem("std_userInfo") || "{}");
      
      // Fetch Marketplace Items
      const itemsRes = await axios.get("/api/items");
      const itemsPayload = Array.isArray(itemsRes.data)
        ? itemsRes.data
        : Array.isArray(itemsRes.data?.data)
          ? itemsRes.data.data
          : [];
      setItems(itemsPayload);

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
      const userInfo = JSON.parse(localStorage.getItem("std_userInfo") || "{}");
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
      const userInfo = JSON.parse(localStorage.getItem("std_userInfo") || "{}");
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
           <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search items..." 
                className="pl-12 h-14 rounded-2xl border-white bg-white/50 backdrop-blur-md focus:border-primary/30 transition-all shadow-xl shadow-black/5 font-medium text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                  <X size={18} />
                </button>
              )}
           </div>
           <Button
             onClick={() => navigate('/items/my-listings')}
             className="h-14 rounded-lg px-5 bg-[#f97316] hover:bg-[#ea6c00] text-white font-semibold"
           >
             + Sell My Item
           </Button>
           <Button variant="outline" className="h-14 rounded-2xl gap-2 border-white bg-white/50 backdrop-blur-md hover:border-primary/30 shadow-xl shadow-black/5 px-6">
              <SlidersHorizontal size={20} className="text-primary" />
              <span className="hidden sm:inline font-black text-xs uppercase tracking-widest text-primary">Filters</span>
           </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              "px-6 py-3 rounded-2xl text-[10px] uppercase tracking-widest font-black transition-all border-2 whitespace-nowrap shadow-sm",
              selectedCategory === cat.id
                ? "bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-105"
                : "bg-white/50 backdrop-blur-md text-muted-foreground border-white hover:border-primary/20 hover:text-primary"
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
              seller={item.seller?.firstName ? `${item.seller.firstName} ${item.seller.lastName}` : "Student"}
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
