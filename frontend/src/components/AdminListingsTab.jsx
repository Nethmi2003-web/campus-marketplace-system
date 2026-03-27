import React, { useState, useEffect } from "react";
import axios from "axios";
import { cn } from '../lib/utils';
import { 
  ShoppingBag, Search, Filter, MoreVertical, 
  Trash2, Edit3, Eye, CheckCircle, XCircle,
  AlertCircle, Loader2, ArrowUpRight, Tag
} from "lucide-react";

export function AdminListingsTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/items");
      const itemsPayload = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
          ? response.data.data
          : [];
      setItems(itemsPayload);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching items:", err);
      setError("Failed to load listings.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
      try {
        const userInfo = JSON.parse(localStorage.getItem("admin_userInfo") || "{}");
        await axios.delete(`/api/items/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        setItems(items.filter(item => item._id !== id));
      } catch (err) {
        console.error("Error deleting item:", err);
        alert("Failed to delete item.");
      }
    }
  };

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-bold">Loading active listings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Active Listings</h1>
          <p className="text-muted-foreground font-medium">Monitor and moderate all marketplace listings</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search listings..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border bg-card text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="p-2.5 rounded-xl border bg-card text-muted-foreground hover:text-primary transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Listings", value: items.length, icon: ShoppingBag, color: "bg-primary/10 text-primary" },
          { label: "Total Value", value: `LKR ${items.reduce((sum, item) => sum + item.price, 0).toLocaleString()}`, icon: Tag, color: "bg-secondary/10 text-secondary" },
          { label: "Flagged Items", value: "0", icon: AlertCircle, color: "bg-red-100 text-red-600" },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl border bg-card p-6 shadow-xl flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", s.color)}>
              <s.icon size={22} />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{s.label}</p>
              <h3 className="text-2xl font-black text-primary">{s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Listings Table */}
      <div className="rounded-3xl border bg-card shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Item</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Category</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Price</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Seller</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Stock</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredItems.map((item) => (
                <tr key={item._id} className="hover:bg-muted/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border">
                        <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-primary line-clamp-1">{item.title}</p>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">ID: {item._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-muted text-muted-foreground">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-sm text-foreground">
                    LKR {item.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-foreground">
                      {item.seller?.firstName ? `${item.seller.firstName} ${item.seller.lastName}` : "Anonymous"}
                    </div>
                    <div className="text-[10px] text-muted-foreground">{item.seller?.universityEmail}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                      item.status === 'available' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                      {item.status === 'available' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {item.status}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn(
                      "font-black text-sm",
                      item.stockQuantity === 0 ? "text-red-500" : item.stockQuantity < 3 ? "text-amber-500" : "text-primary"
                    )}>
                      {item.stockQuantity} Qty
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all">
                         <Eye size={18} />
                       </button>
                       <button className="p-2 rounded-lg hover:bg-secondary/10 text-muted-foreground hover:text-secondary transition-all">
                         <Edit3 size={18} />
                       </button>
                       <button 
                         onClick={() => handleDelete(item._id)}
                         className="p-2 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-all"
                       >
                         <Trash2 size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground font-medium">
                    No listings found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
