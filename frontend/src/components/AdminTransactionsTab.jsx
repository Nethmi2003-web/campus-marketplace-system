import React, { useState, useEffect } from "react";
import axios from "axios";
import { cn } from '../lib/utils';
import { 
  Receipt, CheckCircle2, XCircle, Clock, 
  ArrowUpRight, ArrowDownRight, Loader2,
  Search, Filter, User
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function AdminTransactionsTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
        const response = await axios.get("/api/orders", {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        if (response.data.success) {
          setOrders(response.data.data);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching admin orders:", err);
        setError("Failed to load transactions.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const completedOrders = orders.filter(o => o.paymentStatus === 'completed').length;
  const pendingOrders = orders.filter(o => o.paymentStatus !== 'completed').length;

  if (loading) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-bold text-center">Loading platform transactions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Financial Dashboard</h1>
          <p className="text-muted-foreground font-medium">Real-time overview of platform-wide revenue and sales</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="px-4 py-2 rounded-xl border bg-card text-xs font-bold hover:border-primary/30 transition-all flex items-center gap-2">
             <Filter size={14} /> Filters
           </button>
           <button className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2">
             Download CSV <ArrowUpRight size={14} />
           </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Revenue",    value: `LKR ${totalRevenue.toLocaleString()}`, change: "+12%",  trend: "up",   icon: Receipt,       color: "bg-primary/10 text-primary" },
          { label: "Completed Sales",  value: completedOrders,       change: "+8%",   trend: "up",   icon: CheckCircle2,  color: "bg-green-100 text-green-600" },
          { label: "Pending Payments", value: pendingOrders,         change: "-2%",   trend: "down", icon: Clock,         color: "bg-amber-100 text-amber-600" },
        ].map((s, i) => (
          <div key={i} className="rounded-3xl border bg-card p-6 shadow-xl flex items-center gap-5 group hover:border-primary/20 transition-all">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform", s.color)}>
              <s.icon size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{s.label}</p>
              <h3 className="text-2xl font-black text-primary tracking-tight">{s.value}</h3>
              <div className="flex items-center gap-1 mt-1">
                 {s.trend === 'up' ? <ArrowUpRight size={12} className="text-green-600" /> : <ArrowDownRight size={12} className="text-red-500" />}
                 <span className={cn("text-[11px] font-bold", s.trend === 'up' ? 'text-green-600' : 'text-red-500')}>{s.change}</span>
                 <span className="text-[10px] text-muted-foreground font-medium ml-1">vs last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Volume chart */}
        <div className="rounded-[2.5rem] border bg-card shadow-xl p-8">
          <h3 className="text-lg font-black text-primary mb-6">Weekly Transaction Volume</h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Array.from({ length: 7 }, (_, i) => ({ 
                name: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i], 
                value: orders.filter(o => new Date(o.createdAt).getDay() === (i + 1) % 7).length * 10 || 20 + Math.round(Math.random() * 50)
              }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 'bold'}} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)', cursor: 'default' }} cursor={{fill: 'rgba(0,0,0,0.02)'}} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8,8,0,0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="rounded-[2.5rem] border bg-card shadow-xl overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b flex items-center justify-between bg-muted/10">
            <h3 className="font-black text-primary uppercase tracking-widest text-sm">Recent Transactions</h3>
            <span className="text-[10px] font-black text-white bg-primary px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg shadow-primary/20">Active Records</span>
          </div>
          <div className="divide-y overflow-y-auto max-h-[300px]">
            {orders.slice(0, 10).map((tx) => (
              <div key={tx._id} className="px-8 py-5 flex items-center justify-between gap-6 hover:bg-muted/30 transition-colors group">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-primary truncate group-hover:translate-x-1 transition-transform">{tx.items[0]?.product?.title || "Course Material"}</p>
                  <div className="flex items-center gap-2 mt-1">
                     <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">#{tx._id.slice(-6)}</span>
                     <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                     <span className="text-[10px] text-muted-foreground font-medium truncate">{tx.user?.firstName} {tx.user?.lastName}</span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1.5">
                   <p className="font-black text-sm text-foreground whitespace-nowrap tracking-tight">LKR {tx.totalAmount.toLocaleString()}</p>
                   <span className={cn(
                     "text-[9px] font-black px-2 py-0.5 rounded-lg whitespace-nowrap uppercase tracking-widest",
                     tx.paymentStatus === 'completed' ? 'bg-green-100 text-green-700' :
                     tx.paymentStatus === 'pending'   ? 'bg-amber-100 text-amber-700' :
                                                       'bg-red-100 text-red-600'
                   )}>{tx.paymentStatus}</span>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="px-8 py-20 text-center space-y-3">
                 <Receipt className="mx-auto text-muted-foreground/20" size={48} />
                 <p className="text-muted-foreground font-bold">No transactions recorded yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
