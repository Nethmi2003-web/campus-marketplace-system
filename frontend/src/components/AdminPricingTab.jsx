import React from "react";
import { cn } from '../lib/utils';
import { 
  Tag, Package, Percent, BadgeDollarSign
} from "lucide-react";

export function AdminPricingTab() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black text-primary tracking-tight">Pricing Management</h1>
        <p className="text-muted-foreground font-medium">Set platform fees, discount rules, and category price caps</p>
      </div>

      {/* Fee overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Platform Fee",     value: "5%",     icon: Percent,          color: "bg-primary/10 text-primary" },
          { label: "Avg. Item Price",  value: "Rs. 2,840", icon: Tag,            color: "bg-secondary/10 text-secondary" },
          { label: "Active Categories",value: "12",      icon: Package,          color: "bg-purple-100 text-purple-600" },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl border bg-card p-6 shadow-xl flex items-center gap-4">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0", s.color)}>
              <s.icon size={26} />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{s.label}</p>
              <h3 className="text-2xl font-black text-primary">{s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Category price caps */}
      <div className="rounded-3xl border bg-card shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="font-bold text-primary">Category Price Caps</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Maximum allowed listing price per category</p>
        </div>
        <div className="divide-y">
          {[
            { category: "Textbooks & Notes",     cap: "Rs. 8,000",  fee: "4%" },
            { category: "Electronics",           cap: "Rs. 50,000", fee: "6%" },
            { category: "Lab Equipment",         cap: "Rs. 25,000", fee: "5%" },
            { category: "Clothing & Uniforms",   cap: "Rs. 5,000",  fee: "3%" },
            { category: "Sports & Fitness",      cap: "Rs. 15,000", fee: "5%" },
            { category: "Services & Tutoring",   cap: "Rs. 10,000", fee: "7%" },
          ].map((row, i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-muted/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Tag size={14} className="text-primary" />
                </div>
                <span className="font-bold text-sm text-foreground">{row.category}</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Max Price</p>
                  <p className="font-black text-sm text-primary">{row.cap}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Fee</p>
                  <p className="font-black text-sm text-secondary">{row.fee}</p>
                </div>
                <button className="px-4 py-1.5 rounded-lg border text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Discount rules */}
      <div className="rounded-3xl border bg-card shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div>
            <h3 className="font-bold text-primary">Active Discount Rules</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Platform-wide promotional discounts</p>
          </div>
          <button className="px-4 py-2 bg-secondary text-white rounded-xl text-xs font-bold hover:bg-secondary/90 transition-all">+ Add Rule</button>
        </div>
        <div className="divide-y">
          {[
            { name: "New User Discount",     discount: "10% off",  applies: "First purchase",         status: "Active" },
            { name: "Bulk Buy Discount",     discount: "8% off",   applies: "3+ items in cart",       status: "Active" },
            { name: "Semester Start Promo",  discount: "15% off",  applies: "Textbooks category",     status: "Inactive" },
          ].map((rule, i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-muted/20 transition-colors">
              <div>
                <p className="font-bold text-sm text-foreground">{rule.name}</p>
                <p className="text-xs text-muted-foreground">{rule.applies}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-black text-secondary text-sm">{rule.discount}</span>
                <span className={cn(
                  "text-xs font-bold px-3 py-1 rounded-full",
                  rule.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'
                )}>{rule.status}</span>
                <button className="px-3 py-1.5 rounded-lg border text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
