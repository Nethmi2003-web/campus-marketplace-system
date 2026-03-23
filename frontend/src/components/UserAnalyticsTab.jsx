import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, ShoppingBag, MessageSquare, Eye } from "lucide-react";

export function UserAnalyticsTab() {
  const salesData = Array.from({ length: 7 }, (_, i) => ({
    name: `Day ${i + 1}`,
    sales: 10 + Math.random() * 50,
    views: 100 + Math.random() * 200
  }));

  const stats = [
    { label: "Total Views", value: "1.2k", icon: Eye, color: "text-blue-500" },
    { label: "New Inquiries", value: "24", icon: MessageSquare, color: "text-green-500" },
    { label: "Total Sales", value: "Rs. 15,400", icon: ShoppingBag, color: "text-secondary" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2 mb-6">
          <h2 className="text-2xl font-black text-primary">Sales & Activity</h2>
          <p className="text-muted-foreground font-medium">Track your marketplace performance and item interactions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 rounded-3xl bg-card border shadow-xl shadow-black/5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl bg-muted flex items-center justify-center ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-primary">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 rounded-3xl border bg-card shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-primary" />
            <h3 className="font-bold text-lg">Item Views Trend</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', shadow: 'xl' }} />
                <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-3xl border bg-card shadow-xl">
           <div className="flex items-center gap-2 mb-6">
            <ShoppingBag className="text-secondary" />
            <h3 className="font-bold text-lg">Conversion Rate</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '12px' }} />
                <Bar dataKey="sales" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
