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
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
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
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
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
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
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
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-muted-foreground font-bold animate-pulse">Loading your favorites...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <X className="w-12 h-12 text-red-500" />
        <p className="text-red-500 font-bold">{error}</p>
        <Button onClick={fetchWishlist}>Retry</Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center text-muted-foreground/40 text-red-500/40">
          <Heart size={48} />
        </div>
        <div className="space-y-2 max-w-sm">
          <h3 className="text-2xl font-black text-primary">Your wishlist is empty</h3>
          <p className="text-muted-foreground font-medium">Save items you love and they will appear here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-primary tracking-tight">My Wishlist</h2>
          <p className="text-muted-foreground font-medium">You have {items.length} saved items</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {items.map(item => (
          <div key={item._id} className="group overflow-hidden border-2 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 bg-card rounded-3xl flex flex-col text-card-foreground shadow-sm">
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={item.imageUrl || "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=500&auto=format&fit=crop"}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
              
              <button 
                onClick={() => removeFromWishlist(item._id)}
                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 shadow-lg hover:bg-red-500 hover:text-white transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Content Section */}
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
                 <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
                    <Tag size={12} />
                    <span>{item.condition || "New"}</span>
                 </div>
              </div>

              <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Price</p>
                  <p className="text-xl font-black text-primary">LKR {item.price?.toLocaleString()}</p>
                </div>
                
                <Button 
                  size="sm" 
                  className="rounded-xl gap-2 shadow-lg shadow-primary/20"
                  onClick={() => addToCart(item._id)}
                >
                  <ShoppingCart size={14} />
                  <span>Add</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
