import { cn } from '../lib/utils';
import React from "react";
// Replaced local ui import
import { ArrowDownRight, ArrowUpRight, DollarSign, Package, ShoppingCart } from "lucide-react";


const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
))
CardFooter.displayName = "CardFooter"


const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
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

// Replaced local ui import

export function UserReportsTab() {
  // Isolated data fetching would occur here.
  const mockBuyingData = [
    { id: "B-101", item: "Engineering Mathematics Textbook", date: "2024-03-20", amount: "Rs. 2,500", status: "Completed" },
    { id: "B-102", item: "Lab Coat (Medium)", date: "2024-03-18", amount: "Rs. 1,200", status: "Processing" },
  ];

  const mockSellingData = [
    { id: "S-201", item: "Scientific Calculator FX-991EX", date: "2024-03-21", amount: "Rs. 4,000", status: "Sold" },
    { id: "S-202", item: "Introduction to Algorithms, 3rd Ed", date: "2024-03-15", amount: "Rs. 3,500", status: "Listed" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2 mb-6">
          <h2 className="text-2xl font-black text-primary">Transaction Reports</h2>
          <p className="text-muted-foreground font-medium">Your marketplace activity history</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <Card className="border-none shadow-xl bg-gradient-to-br from-primary to-primary/80 text-white">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-white/80">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-3xl font-black">Rs. 3,700</div>
               <p className="text-xs text-white/60 mt-1 flex items-center gap-1">
                  <ArrowUpRight size={12} className="text-red-400" /> +12% from last month
               </p>
            </CardContent>
         </Card>
         <Card className="border-none shadow-xl bg-gradient-to-br from-secondary to-secondary/80 text-white">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-white/80">Total Earned</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-3xl font-black">Rs. 4,000</div>
               <p className="text-xs text-white/60 mt-1 flex items-center gap-1">
                  <ArrowDownRight size={12} className="text-green-400" /> Steady growth
               </p>
            </CardContent>
         </Card>
         <Card className="border-none shadow-xl">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">Active Listings</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-3xl font-black text-primary">1</div>
               <p className="text-xs text-muted-foreground mt-1">Ready for sale</p>
            </CardContent>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Buying History */}
        <Card className="border-none shadow-xl bg-white/50 backdrop-blur-md">
          <CardHeader>
            <div className="flex items-center gap-2">
               <div className="p-2 bg-primary/10 rounded-lg"><ShoppingCart className="w-5 h-5 text-primary" /></div>
               <div>
                 <CardTitle>Buying History</CardTitle>
                 <CardDescription>Recent purchases and orders</CardDescription>
               </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockBuyingData.map((order) => (
               <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/60 border border-white">
                  <div>
                     <p className="font-bold text-primary text-sm">{order.item}</p>
                     <p className="text-xs text-muted-foreground">{order.date} &bull; {order.id}</p>
                  </div>
                  <div className="text-right">
                     <p className="font-bold text-sm">{order.amount}</p>
                     <Badge variant="outline" className={order.status === 'Completed' ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'}>
                        {order.status}
                     </Badge>
                  </div>
               </div>
            ))}
          </CardContent>
        </Card>

        {/* Selling History */}
        <Card className="border-none shadow-xl bg-white/50 backdrop-blur-md">
          <CardHeader>
            <div className="flex items-center gap-2">
               <div className="p-2 bg-secondary/10 rounded-lg"><Package className="w-5 h-5 text-secondary" /></div>
               <div>
                 <CardTitle>Selling History</CardTitle>
                 <CardDescription>Your listed items and sales</CardDescription>
               </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockSellingData.map((sale) => (
               <div key={sale.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/60 border border-white">
                  <div>
                     <p className="font-bold text-primary text-sm">{sale.item}</p>
                     <p className="text-xs text-muted-foreground">{sale.date} &bull; {sale.id}</p>
                  </div>
                  <div className="text-right">
                     <p className="font-bold text-sm">{sale.amount}</p>
                     <Badge variant="outline" className={sale.status === 'Sold' ? 'text-secondary bg-secondary/10' : 'text-primary bg-primary/10'}>
                        {sale.status}
                     </Badge>
                  </div>
               </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
