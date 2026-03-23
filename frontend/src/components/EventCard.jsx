import React from "react";
import { Calendar, Users, MapPin, Clock, Heart, Share2, ExternalLink } from "lucide-react";
// Replaced local ui import
// Replaced local ui import
// Replaced local ui import
import { cn } from "../lib/utils";
import { useState } from "react";


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


export function EventCard({
  id,
  title,
  description,
  date,
  time,
  location,
  attendees,
  maxAttendees,
  category,
  imageUrl,
  price = 0,
  isFeatured = false,
  status = "open",
}) {
  const [isLiked, setIsLiked] = useState(false);
  const attendancePercentage = (attendees / maxAttendees) * 100;

  const statusConfig = {
    open: { color: "bg-green-500", text: "Open for Registration" },
    "filling-fast": { color: "bg-secondary", text: "Filling Fast!" },
    full: { color: "bg-red-500", text: "Fully Booked" },
  };

  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/30 bg-card">
      <div className="relative overflow-hidden h-48">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        {isFeatured && (
          <Badge className="absolute top-3 left-3 bg-secondary text-white border-0 shadow-lg">
            ⭐ Featured
          </Badge>
        )}
        <Badge 
          className={cn(
            "absolute top-3 right-3 text-white border-0 shadow-lg",
            statusConfig[status].color
          )}
        >
          {statusConfig[status].text}
        </Badge>
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={cn(
              "w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform",
              isLiked && "bg-red-500"
            )}
          >
            <Heart className={cn("w-4 h-4", isLiked ? "fill-white text-white" : "text-gray-700")} />
          </button>
          <button className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform">
            <Share2 className="w-4 h-4 text-gray-700" />
          </button>
        </div>
        <Badge className="absolute bottom-3 left-3 bg-primary text-white border-0 shadow-lg">
          {category}
        </Badge>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="font-medium text-foreground truncate">{date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-secondary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="font-medium text-foreground truncate">{time}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm col-span-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="font-medium text-foreground truncate">{location}</p>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-primary" />
              <span className="font-medium text-foreground">
                {attendees} / {maxAttendees} Registered
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{attendancePercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-500 rounded-full",
                attendancePercentage < 50 ? "bg-green-500" :
                attendancePercentage < 80 ? "bg-secondary" : "bg-red-500"
              )}
              style={{ width: `${attendancePercentage}%` }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            {price > 0 ? (
              <div>
                <p className="text-xs text-muted-foreground">Registration Fee</p>
                <p className="text-xl font-semibold text-primary">LKR {price}</p>
              </div>
            ) : (
              <Badge className="bg-green-500/10 text-green-700 border-green-500/20">
                Free Event
              </Badge>
            )}
          </div>
          <Button 
            className={cn(
              "gap-2 shadow-lg transition-all duration-300",
              status === "full" 
                ? "bg-muted text-muted-foreground cursor-not-allowed" 
                : "bg-primary hover:bg-primary/90 hover:scale-105"
            )}
            disabled={status === "full"}
          >
            {status === "full" ? "Full" : "Register"}
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
