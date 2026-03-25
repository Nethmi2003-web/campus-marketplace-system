import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  TrendingUp, 
  ShoppingBag, 
  CreditCard, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Loader2,
  AlertCircle
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { cn } from "../lib/utils";

const Card = ({ children, className }) => (
  <div className={cn("bg-card/40 backdrop-blur-xl border-2 border-white rounded-[2.5rem] shadow-xl shadow-black/5 overflow-hidden", className)}>
    {children}
  </div>
);

export function UserAnalyticsTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const userInfo = JSON.parse(localStorage.getItem("std_userInfo") || "{}");
        const response = await axios.get("/api/orders/analytics", {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        setData(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to load your spending insights. Please try again later.");
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-xl font-black text-primary animate-pulse tracking-tight">Calculating your insights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-6 text-center px-4">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center shadow-xl shadow-red-100">
          <AlertCircle className="w-10 h-10" />
        </div>
        <div className="max-w-sm">
          <h2 className="text-2xl font-black text-primary mb-2 tracking-tight">Analytics Unavailable</h2>
          <p className="text-muted-foreground font-medium">{error}</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Spent",
      value: `LKR ${data.totalSpent.toLocaleString()}`,
      icon: CreditCard,
      color: "from-blue-500 to-indigo-600",
      description: "Lifetime marketplace spending"
    },
    {
      label: "Items Bought",
      value: data.itemsPurchased,
      icon: ShoppingBag,
      color: "from-emerald-500 to-teal-600",
      description: "Total unique items purchased"
    },
    {
      label: "Platform Fees",
      value: `LKR ${data.platformFees.toLocaleString()}`,
      icon: TrendingUp,
      color: "from-orange-500 to-pink-600",
      description: "Support for the marketplace"
    },
    {
      label: "Pending Orders",
      value: data.pendingOrders,
      icon: Clock,
      color: "from-purple-500 to-violet-600",
      description: "Orders currently in progress"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-black text-primary tracking-tight">My Insights</h1>
        <p className="text-muted-foreground font-medium text-lg text-secondary">Track your spending and item consumption patterns</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="group hover:scale-[1.02] transition-all duration-500 cursor-default">
            <div className="p-6">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform bg-gradient-to-br",
                stat.color
              )}>
                <stat.icon className="text-white w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-2xl font-black text-primary tracking-tight">{stat.value}</h3>
                <p className="text-[10px] font-medium text-muted-foreground leading-relaxed">{stat.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Spending Trend Chart */}
        <Card className="lg:col-span-2 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-primary tracking-tight">Spending Trend</h3>
              <p className="text-xs text-muted-foreground font-medium">Your monthly marketplace activity</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
               <TrendingUp size={12} />
               Active Shopping
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthlySpending}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#001f5c" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#001f5c" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                  tickFormatter={(value) => `LKR ${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    backdropFilter: 'blur(8px)'
                  }}
                  itemStyle={{ color: '#001f5c', fontWeight: 900 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#001f5c" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Breakdown Card */}
        <Card className="p-8 space-y-6">
           <div>
              <h3 className="text-xl font-black text-primary tracking-tight">Monthly Breakdown</h3>
              <p className="text-xs text-muted-foreground font-medium">Spending comparison</p>
           </div>

           <div className="space-y-4">
              {data.monthlySpending.slice(-4).map((m, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-black text-primary uppercase tracking-widest">{m.month}</span>
                    <span className="text-sm font-bold text-secondary">LKR {m.amount.toLocaleString()}</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-1000"
                      style={{ width: `${(m.amount / Math.max(...data.monthlySpending.map(x => x.amount || 1))) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
           </div>

           <div className="pt-6 border-t border-dashed border-muted-foreground/20">
              <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl">
                 <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shrink-0">
                    <ArrowUpRight size={20} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Saving Tip</p>
                    <p className="text-xs font-medium text-primary">Compare prices in "Books" category to save up to 15% this month.</p>
                 </div>
              </div>
           </div>
        </Card>
      </div>

      {/* Completed Orders List */}
      <Card className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-black text-primary tracking-tight">Purchase History</h3>
            <p className="text-xs text-muted-foreground font-medium">All your successfully completed transactions</p>
          </div>
          <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest">
            {data.completedOrders.length} Completed
          </div>
        </div>

        <div className="space-y-4">
          {data.completedOrders.length > 0 ? (
            data.completedOrders.map((order) => (
              <div 
                key={order._id} 
                className="group flex flex-col md:flex-row md:items-center gap-6 p-5 rounded-3xl bg-white transition-all hover:shadow-xl hover:shadow-primary/5 border border-transparent hover:border-primary/10"
              >
                {/* Product Images (Multiple) */}
                <div className="flex -space-x-4">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div 
                      key={idx} 
                      className="w-16 h-16 rounded-2xl border-4 border-white overflow-hidden shadow-lg group-hover:scale-105 transition-transform"
                    >
                      <img 
                        src={item.product?.imageUrl || "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=200"} 
                        alt={item.product?.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-16 h-16 rounded-2xl border-4 border-white bg-primary text-white flex items-center justify-center text-xs font-black shadow-lg">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-black text-primary truncate tracking-tight">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </h4>
                    <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100">
                      Completed
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium truncate">
                    {order.items.map(item => item.product?.title).join(", ")}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                     <span className="flex items-center gap-1"><Clock size={12}/> {new Date(order.createdAt).toLocaleDateString()}</span>
                     <span className="flex items-center gap-1"><CreditCard size={12}/> {order.paymentMethod}</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase font-black tracking-widest mb-1">Total Paid</p>
                  <p className="text-xl font-black text-primary">LKR {order.totalAmount.toLocaleString()}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-muted-foreground font-medium">
              No completed orders found in your history.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
