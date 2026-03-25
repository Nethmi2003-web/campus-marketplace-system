import React, { useState, useEffect } from "react";
import axios from "axios";
import { cn } from '../lib/utils';
import { 
  Heart, ShoppingCart, Trash2, Tag, Clock, 
  PackageSearch, Loader2, X 
} from "lucide-react";
import { Button } from "./MarketplaceUI"; // Reuse the premium Button

export function UserWishlistTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem("std_userInfo") || "{}");
      if (!userInfo.token) {
        setError("Please login to view your wishlist.");
        setLoading(false);
        return;
      }

      const response = await axios.get("/api/wishlist", {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });

      if (response.data.success && response.data.data) {
        console.log("Wishlist data fetched:", response.data.data);
        const products = response.data.data.products || [];
        setItems(products);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      setError("Failed to load your wishlist.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("std_userInfo") || "{}");
      await axios.delete(`/api/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setItems(prev => prev.filter(item => item._id !== productId));
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      alert("Failed to remove item.");
    }
  };

  const addToCart = async (productId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("std_userInfo") || "{}");
      await axios.post("/api/cart", 
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      alert("Item added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add to cart.");
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xl font-bold text-primary animate-pulse tracking-tight text-lg">Loading your favorites...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center shadow-xl shadow-red-100">
          <X className="w-10 h-10" />
        </div>
        <div className="space-y-2 max-w-sm">
          <h1 className="text-3xl font-black text-red-500 mb-2 tracking-tight">Wishlist Issue</h1>
          <p className="text-muted-foreground font-medium">{error}</p>
        </div>
        <Button onClick={fetchWishlist} className="rounded-2xl shadow-lg shadow-primary/20">Retry</Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-24 h-24 bg-muted/50 rounded-[2rem] flex items-center justify-center text-red-500/20 shadow-inner">
          <Heart size={48} />
        </div>
        <div className="space-y-2 max-w-sm">
          <h1 className="text-4xl font-black text-primary mb-2 tracking-tight">Your wishlist is empty</h1>
          <p className="text-muted-foreground font-medium">Save items you love and they will appear here!</p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-8 py-3 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 transition-all uppercase tracking-widest text-xs"
        >
          Browse Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-4xl font-black text-primary tracking-tight mb-2">My Wishlist</h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Heart size={16} className="text-red-500" />
            You have {items.length} saved items
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {items.map(item => (
          <div key={item._id} className="group overflow-hidden border-2 border-white backdrop-blur-xl hover:border-primary/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-700 bg-card/40 rounded-[2.5rem] flex flex-col text-card-foreground shadow-xl shadow-black/5">
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden rounded-t-[2.5rem]">
              <img
                src={item.imageUrl || "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=500&auto=format&fit=crop"}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
              
              <button 
                onClick={() => removeFromWishlist(item._id)}
                className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-2xl text-red-500 shadow-xl hover:bg-red-500 hover:text-white transition-all hover:scale-110"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Content Section */}
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-black text-xl text-primary tracking-tight line-clamp-1 group-hover:text-secondary transition-colors">
                  {item.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 mb-6 text-xs text-muted-foreground">
                 <div className="flex items-center gap-1.5 bg-primary/5 px-2.5 py-1 rounded-xl text-secondary font-bold border border-primary/10">
                    <Tag size={12} />
                    <span>{item.condition || "New"}</span>
                 </div>
              </div>

              <div className="mt-auto pt-5 border-t border-dashed border-muted-foreground/20 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Price</p>
                  <p className="text-2xl font-black text-primary">LKR {item.price?.toLocaleString()}</p>
                </div>
                
                <Button 
                  size="default" 
                  className="rounded-2xl gap-2 shadow-xl shadow-primary/20 hover:scale-110 active:scale-95 transition-all bg-primary"
                  onClick={() => addToCart(item._id)}
                >
                  <ShoppingCart size={16} />
                  <span className="font-black text-xs uppercase tracking-widest">Add</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
