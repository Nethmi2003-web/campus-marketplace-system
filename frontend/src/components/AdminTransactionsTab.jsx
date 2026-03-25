import React, { useState, useEffect } from "react";
import axios from "axios";
import { cn } from '../lib/utils';
import { Receipt, CheckCircle2, XCircle, Clock, ArrowUpRight, ArrowDownRight, Loader2,Search, Filter, User } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function AdminTransactionsTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [granularity, setGranularity] = useState("full"); // "full" | "w1" | "w2" | "w3" | "w4"
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

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

  const completedOrdersList = orders.filter(o => o.paymentStatus === 'completed');
  const totalRevenue = completedOrdersList.reduce((sum, order) => sum + order.totalAmount, 0);
  const completedOrdersCount = completedOrdersList.length;
  const pendingOrders = orders.filter(o => o.paymentStatus === 'pending').length;

  // --- Daily Analytics Logic --- //
  const getDailyRevenue = (daysAgo) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - daysAgo);
    const dateStr = targetDate.toDateString();
    
    return completedOrdersList
      .filter(o => new Date(o.createdAt).toDateString() === dateStr)
      .reduce((sum, o) => sum + o.totalAmount, 0);
  };

  const todayRevenue = getDailyRevenue(0);
  const yesterdayRevenue = getDailyRevenue(1);
  const revenueChange = yesterdayRevenue === 0 ? (todayRevenue > 0 ? 100 : 0) : ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;

  // --- Chart Data Logic --- //
  const getChartData = () => {
    const data = [];
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    
    let startDay = 1;
    let endDay = daysInMonth;

    if (granularity === 'w1') { startDay = 1; endDay = 7; }
    else if (granularity === 'w2') { startDay = 8; endDay = 14; }
    else if (granularity === 'w3') { startDay = 15; endDay = 21; }
    else if (granularity === 'w4') { startDay = 22; endDay = daysInMonth; }

    for (let d = startDay; d <= endDay; d++) {
      const date = new Date(selectedYear, selectedMonth, d);
      
      const dailyVal = completedOrdersList
        .filter(o => {
          const oDate = new Date(o.createdAt);
          return oDate.getDate() === d && 
                 oDate.getMonth() === selectedMonth && 
                 oDate.getFullYear() === selectedYear;
        })
        .reduce((sum, o) => sum + o.totalAmount, 0);

      data.push({
        name: String(d),
        value: dailyVal,
        fullDate: date.toLocaleDateString(),
        // Show labels for all days if viewing a week, otherwise every 5 days for full month
        showLabel: granularity !== 'full' || d % 2 !== 0 || d === daysInMonth // Show odd days and the last day
      });
    }
    return data;
  };

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
         <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 rounded-2xl bg-primary text-white text-xs font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
              <ArrowUpRight size={14} /> Export Report
            </button>
         </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
           { label: "Today's Revenue",   value: `LKR ${todayRevenue.toLocaleString()}`, change: `${revenueChange >= 0 ? '+' : ''}${revenueChange.toFixed(1)}%`, trend: revenueChange >= 0 ? "up" : "down", icon: Receipt, color: "bg-primary/10 text-primary" },
           { label: "Total Completed Sales", value: completedOrdersCount,      change: "+8%",   trend: "up",   icon: CheckCircle2,  color: "bg-green-100 text-green-600" },
           { label: "Total Platform Revenue", value: `LKR ${totalRevenue.toLocaleString()}`, change: "+12%",  trend: "up",   icon: ArrowUpRight,  color: "bg-secondary/10 text-secondary" },
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6">
            <div>
              <h3 className="text-xl font-black text-primary uppercase tracking-tight">Revenue Analytics</h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Detailed transaction volume breakdown</p>
            </div>
            
            <div className="flex flex-col gap-3 bg-muted/30 p-3 rounded-[2.2rem] border border-border/50 w-full sm:w-[320px] lg:w-[360px] shadow-2xl shadow-black/5">
              {/* Top Row: Year and Month */}
              <div className="flex items-center gap-2">
                <select 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="flex-1 bg-white border border-border/50 text-primary rounded-2xl px-5 h-12 text-[12px] font-black focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer hover:border-primary/30 transition-all shadow-sm"
                >
                  {[2024, 2025, 2026].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>

                <select 
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="flex-1 bg-white border border-border/50 text-primary rounded-2xl px-5 h-12 text-[12px] font-black focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer hover:border-primary/30 transition-all shadow-sm"
                >
                  {MONTHS.map((m, i) => (
                    <option key={i} value={i}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Bottom Row: Week Buttons */}
              <div className="flex bg-white/70 p-1.5 rounded-2xl border border-border/50 shadow-inner h-12 items-center">
                {[
                  { id: 'full', label: 'Month' },
                  { id: 'w1', label: 'W1' },
                  { id: 'w2', label: 'W2' },
                  { id: 'w3', label: 'W3' },
                  { id: 'w4', label: 'W4' }
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGranularity(g.id)}
                    className={cn(
                      "flex-1 h-full rounded-xl text-[11px] font-black transition-all uppercase tracking-tighter",
                      granularity === g.id 
                        ? "bg-primary text-white shadow-xl shadow-primary/20 scale-105" 
                        : "text-muted-foreground hover:text-primary hover:bg-white/90"
                    )}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  interval={0}
                  tick={(props) => {
                    const { x, y, payload } = props;
                    const item = getChartData()[payload.index];
                    if (!item?.showLabel) return null;
                    return (
                      <text x={x} y={y + 16} fill="hsl(var(--muted-foreground))" fontSize={10} fontWeight="bold" textAnchor="middle">
                        {payload.value}
                      </text>
                    );
                  }}
                />
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
          <div className="divide-y overflow-y-auto max-h-[340px] flex-1">
            {orders.slice(0, 15).map((tx) => (
              <div key={tx._id} className="px-8 py-4 flex items-center justify-between gap-6 hover:bg-muted/30 transition-colors group">
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
