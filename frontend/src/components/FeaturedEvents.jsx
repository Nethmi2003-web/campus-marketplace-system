import React from "react";
import { cn } from '../lib/utils';
import { useState } from "react";
import { Sparkles, ArrowRight, Calendar, Users, TrendingUp } from "lucide-react";


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


const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});
Button.displayName = "Button";

// Replaced local ui import
// Replaced local ui import
// Replaced local ui import

export function FeaturedEvents({ events }) {
  if (events.length === 0) return null;

  const mainEvent = events[0];
  const sideEvents = events.slice(1, 3);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Featured Events</h2>
            <p className="text-sm text-muted-foreground">Don't miss these trending events</p>
          </div>
        </div>
        <Button variant="outline" className="gap-2 hidden md:flex">
          View All
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 overflow-hidden group hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/30">
          <div className="relative h-80">
            <img
              src={mainEvent.imageUrl}
              alt={mainEvent.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-secondary text-white border-0 shadow-lg">
                  ⭐ Featured
                </Badge>
                <Badge className="bg-primary/80 backdrop-blur-sm text-white border-0">
                  {mainEvent.category}
                </Badge>
              </div>
              <h3 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">
                {mainEvent.title}
              </h3>
              <p className="text-white/90 mb-4 line-clamp-2 max-w-2xl">
                {mainEvent.description}
              </p>
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2 text-white">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">{mainEvent.date}</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">{mainEvent.attendees}+ attendees</span>
                </div>
                <div className="flex items-center gap-2 text-secondary">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Trending</span>
                </div>
              </div>
              <Button className="bg-secondary hover:bg-secondary/90 w-fit shadow-xl">
                Register Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          {sideEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden group hover:shadow-xl transition-all duration-500 border-2 hover:border-primary/30">
              <div className="relative h-40">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                  <Badge className="bg-primary/80 backdrop-blur-sm text-white border-0 w-fit mb-2">
                    {event.category}
                  </Badge>
                  <h4 className="font-semibold text-white mb-2 line-clamp-2">
                    {event.title}
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/90 text-sm">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{event.date}</span>
                    </div>
                    <Button size="sm" className="bg-secondary hover:bg-secondary/90 h-8">
                      Register
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
