import React from "react";
import { Calendar, Users, MapPin, Clock, Heart, Share2, ExternalLink } from "lucide-react";
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
    <Card className="group overflow-hidden hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 border-2 border-white backdrop-blur-xl hover:border-primary/20 bg-card/40 rounded-[2.5rem] flex flex-col shadow-xl shadow-black/5">
      <div className="relative overflow-hidden h-52 rounded-t-[2.5rem]">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        {isFeatured && (
          <Badge className="absolute top-4 left-4 bg-secondary text-white border-0 shadow-xl px-4 py-1.5 font-black uppercase tracking-widest text-[10px]">
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
        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={cn(
              "w-10 h-10 rounded-2xl bg-white shadow-xl flex items-center justify-center hover:scale-110 transition-transform",
              isLiked ? "bg-red-500 text-white" : "text-gray-700 hover:text-red-500"
            )}
          >
            <Heart className={cn("w-5 h-5", isLiked && "fill-white")} />
          </button>
          <button className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform">
            <Share2 className="w-4 h-4 text-gray-700" />
          </button>
        </div>
        <Badge className="absolute bottom-3 left-3 bg-primary text-white border-0 shadow-lg">
          {category}
        </Badge>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-black text-primary mb-3 line-clamp-2 group-hover:text-secondary transition-colors tracking-tight leading-tight">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-6 line-clamp-2 font-medium leading-relaxed">
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
        <div className="flex items-center justify-between pt-6 border-t border-dashed border-muted-foreground/20 mt-auto">
          <div>
            {price > 0 ? (
              <div>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Registration Fee</p>
                <p className="text-2xl font-black text-primary tracking-tight">LKR {price.toLocaleString()}</p>
              </div>
            ) : (
              <Badge className="bg-green-50 text-green-600 border-none px-4 py-1.5 font-black uppercase tracking-widest text-[10px]">
                Free Event
              </Badge>
            )}
          </div>
          <button className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all hover:scale-110 active:scale-90 shadow-lg shadow-primary/5">
             <ExternalLink size={20} />
          </button>
        </div>
      </div>
    </Card>
  );
}
