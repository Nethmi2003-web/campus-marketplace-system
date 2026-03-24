import React from "react";
import { cn } from '../lib/utils';
import { 
  Receipt, CheckCircle2, XCircle
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function AdminTransactionsTab() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black text-primary tracking-tight">Transactions</h1>
        <p className="text-muted-foreground font-medium">Full history of platform-wide sales and payments</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Revenue",    value: "Rs. 284,500", change: "+18%",  trend: "up",   icon: Receipt,       color: "bg-primary/10 text-primary" },
          { label: "Completed",        value: "1,042",       change: "+12%",  trend: "up",   icon: CheckCircle2,  color: "bg-green-100 text-green-600" },
          { label: "Pending / Failed", value: "37",          change: "-5%",   trend: "down", icon: XCircle,       color: "bg-red-100 text-red-600" },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl border bg-card p-6 shadow-xl flex items-center gap-4">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0", s.color)}>
              <s.icon size={26} />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{s.label}</p>
              <h3 className="text-2xl font-black text-primary">{s.value}</h3>
              <span className={cn("text-xs font-bold", s.trend === 'up' ? 'text-green-600' : 'text-red-500')}>{s.change} vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Volume chart */}
      <div className="rounded-3xl border bg-card shadow-xl p-6">
        <h3 className="text-lg font-bold text-primary mb-4">Weekly Transaction Volume</h3>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={Array.from({ length: 7 }, (_, i) => ({ name: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i], value: 40 + Math.round(Math.random() * 120) }))}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent transactions table */}
      <div className="rounded-3xl border bg-card shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="font-bold text-primary">Recent Transactions</h3>
          <span className="text-xs font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full">Last 5</span>
        </div>
        <div className="divide-y">
          {[
            { id: "TXN-1081", item: "Engineering Textbook",      buyer: "Kasun P.",    amount: "Rs. 2,500", status: "Completed", time: "2m ago" },
            { id: "TXN-1080", item: "Lab Coat (M)",              buyer: "Nimesha R.",  amount: "Rs. 1,200", status: "Completed", time: "14m ago" },
            { id: "TXN-1079", item: "Scientific Calculator",     buyer: "Ashen D.",   amount: "Rs. 4,000", status: "Pending",   time: "32m ago" },
            { id: "TXN-1078", item: "Algorithms Textbook 3rd Ed",buyer: "Dineth M.",  amount: "Rs. 3,500", status: "Completed", time: "1h ago" },
            { id: "TXN-1077", item: "USB-C Hub",                  buyer: "Tharusha W.",amount: "Rs. 1,800", status: "Failed",    time: "2h ago" },
          ].map((tx) => (
            <div key={tx.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-primary truncate">{tx.item}</p>
                <p className="text-xs text-muted-foreground">{tx.id} · {tx.buyer} · {tx.time}</p>
              </div>
              <p className="font-black text-sm text-foreground whitespace-nowrap">{tx.amount}</p>
              <span className={cn(
                "text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap",
                tx.status === 'Completed' ? 'bg-green-100 text-green-700' :
                tx.status === 'Pending'   ? 'bg-amber-100 text-amber-700' :
                                            'bg-red-100 text-red-600'
              )}>{tx.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
