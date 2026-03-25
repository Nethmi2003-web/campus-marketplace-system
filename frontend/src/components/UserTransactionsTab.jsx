import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, ShoppingBag, Eye, ShoppingCart, Loader2, XCircle } from "lucide-react";
import { cn } from '../lib/utils';
import axios from "axios";

// --- SHARED UI COMPONENTS --- //
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-3xl border bg-card text-card-foreground shadow-xl shadow-black/5 overflow-hidden", className)} {...props} />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-xl font-black leading-none tracking-tight text-primary", className)} {...props} />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground font-medium", className)} {...props} />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground",
    secondary: "border-transparent bg-secondary text-secondary-foreground",
    outline: "border-border bg-background text-foreground",
  };
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});

export function UserTransactionsTab() {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const response = await axios.get("/api/orders/my", {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      if (response.data.success) {
        setOrders(response.data.data);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load your transaction history.");
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  
  const salesData = orders.length > 0 
    ? orders.slice(0, 7).reverse().map((order) => ({
        name: new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'short' }),
        spent: order.totalAmount,
        items: order.items.length
      }))
    : Array.from({ length: 7 }, (_, i) => ({
        name: `Day ${i + 1}`,
        spent: 0,
        items: 0
      }));

  const stats = [
    { label: "Marketplace Activity", value: "Verified", icon: Eye, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Total Spent", value: `Rs. ${totalSpent.toLocaleString()}`, icon: ShoppingCart, color: "text-primary", bg: "bg-primary/5" },
    { label: "Orders Placed", value: orders.length.toString(), icon: ShoppingBag, color: "text-secondary", bg: "bg-green-50" },
  ];

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-start pt-32 space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-muted-foreground font-bold animate-pulse text-lg tracking-wide">Syncing transaction history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-start pt-32 space-y-4">
        <XCircle className="w-12 h-12 text-red-500" />
        <p className="text-red-500 font-bold text-lg">{error}</p>
        <button onClick={fetchOrders} className="px-8 py-3 bg-primary text-white rounded-2xl font-black shadow-lg hover:shadow-primary/20 transition-all hover:scale-105">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-black text-primary tracking-tight">Purchase History & Insights</h2>
          <p className="text-muted-foreground font-medium">Track your campus shopping activity and spending patterns</p>
      </div>

      {/* --- QUICK STATS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 rounded-[2rem] bg-card border-2 border-muted shadow-xl shadow-black/5 flex items-center gap-5 hover:scale-[1.02] transition-transform duration-300">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-colors", stat.bg, stat.color)}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-primary">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* --- ANALYTICS CHARTS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="p-2.5 bg-primary/10 rounded-xl"><TrendingUp size={20} className="text-primary" /></div>
               <CardTitle>Spending Trend</CardTitle>
            </div>
            <Badge variant="secondary">Weekly Activity</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid hsl(var(--border))', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="spent" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorSpent)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="p-2.5 bg-secondary/10 rounded-xl"><ShoppingCart size={20} className="text-secondary" /></div>
               <CardTitle>Item Consumption</CardTitle>
            </div>
            <Badge variant="outline">Quantity Over Time</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                  <Bar dataKey="items" fill="hsl(var(--secondary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- HISTORY TABLE --- */}
      <Card className="bg-white/40 border-2 border-white backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
             <div className="p-3 bg-primary/10 rounded-2xl"><ShoppingCart className="w-6 h-6 text-primary" /></div>
             <div>
               <CardTitle>Recent Purchases</CardTitle>
               <CardDescription>Track your active orders and completed campus transactions</CardDescription>
             </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order._id} className="group flex items-center justify-between p-5 rounded-2xl bg-white/70 border-2 border-white hover:border-primary/20 hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-black text-sm uppercase">
                      {order.items[0]?.product?.category?.slice(0, 2) || "OR"}
                    </div>
                    <div>
                        <p className="font-black text-primary text-base transition-colors group-hover:text-primary/80 line-clamp-1">
                          {order.items.length > 1 ? `${order.items[0]?.product?.title} + ${order.items.length - 1} more` : order.items[0]?.product?.title}
                        </p>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
                          {new Date(order.createdAt).toLocaleDateString()} &bull; {order._id.slice(-8).toUpperCase()}
                        </p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1.5">
                    <p className="font-black text-lg text-foreground">Rs. {order.totalAmount?.toLocaleString()}</p>
                    <Badge variant="outline" className={cn(
                      "font-black border-none px-4 py-1",
                      order.paymentStatus === 'completed' ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'
                    )}>
                        {order.orderStatus}
                    </Badge>
                  </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground font-medium">No purchases yet. Start exploring the marketplace!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
