import React from "react";
import { Calendar, Users, TrendingUp, Clock, MapPin } from "lucide-react";
// Replaced local ui import
import { cn } from "../lib/utils";


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


export function StatsOverview() {
  const stats = [
    {
      label: "Upcoming Events",
      value: 24,
      change: "+12%",
      trend: "up",
      icon: Calendar,
      color: "primary",
    },
    {
      label: "Total Registrations",
      value: "2,847",
      change: "+23%",
      trend: "up",
      icon: Users,
      color: "secondary",
    },
    {
      label: "Active Events",
      value: 8,
      change: "+5%",
      trend: "up",
      icon: Clock,
      color: "green",
    },
    {
      label: "Event Categories",
      value: 12,
      change: "+2",
      trend: "up",
      icon: MapPin,
      color: "purple",
    },
  ];

  const colorConfig = {
    primary: {
      bg: "bg-primary/10",
      text: "text-primary",
      ring: "ring-primary/20",
      gradient: "from-primary/20 to-primary/5",
    },
    secondary: {
      bg: "bg-secondary/10",
      text: "text-secondary",
      ring: "ring-secondary/20",
      gradient: "from-secondary/20 to-secondary/5",
    },
    green: {
      bg: "bg-green-500/10",
      text: "text-green-600",
      ring: "ring-green-500/20",
      gradient: "from-green-500/20 to-green-500/5",
    },
    purple: {
      bg: "bg-purple-500/10",
      text: "text-purple-600",
      ring: "ring-purple-500/20",
      gradient: "from-purple-500/20 to-purple-500/5",
    },
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const colors = colorConfig[stat.color];

        return (
          <Card
            key={index}
            className={cn(
              "relative overflow-hidden border-2 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-primary/30 group"
            )}
          >
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-50 group-hover:opacity-70 transition-opacity",
              colors.gradient
            )} />

            <div className="relative p-6">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center mb-4 ring-4 group-hover:scale-110 transition-transform",
                colors.bg,
                colors.ring
              )}>
                <Icon className={cn("w-6 h-6", colors.text)} />
              </div>

              <div className="mb-2">
                <h3 className="text-3xl font-bold text-foreground">{stat.value}</h3>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                {stat.change && (
                  <div className={cn(
                    "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
                    stat.trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  )}>
                    <TrendingUp className={cn(
                      "w-3 h-3",
                      stat.trend === "down" && "rotate-180"
                    )} />
                    {stat.change}
                  </div>
                )}
              </div>

              <div className={cn(
                "absolute -bottom-8 -right-8 w-24 h-24 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500",
                colors.bg
              )} />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
