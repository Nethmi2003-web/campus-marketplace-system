import React from "react";
import { cn } from "../../lib/utils";

// --- BUTTON ---
export const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border-2 border-primary/20 bg-background hover:bg-accent hover:text-accent-foreground shadow-sm",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-lg shadow-secondary/20",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };
  const sizes = {
    default: "h-11 px-6 py-2",
    sm: "h-9 rounded-xl px-3 text-xs",
    lg: "h-14 rounded-2xl px-10 text-lg",
    icon: "h-11 w-11 rounded-xl",
  };
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-black uppercase tracking-widest ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});
Button.displayName = "Button";

// --- INPUT ---
export const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-2xl border-2 border-transparent bg-muted/30 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/5 focus:bg-white focus:border-primary/20 transition-all disabled:cursor-not-allowed disabled:opacity-50 font-medium",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

// --- BADGE ---
export const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "border-transparent bg-primary text-white hover:bg-primary/80 shadow-md",
    secondary: "border-transparent bg-secondary text-white hover:bg-secondary/80 shadow-md",
    destructive: "border-transparent bg-destructive text-white hover:bg-destructive/80 shadow-md",
    outline: "border-primary/20 text-primary bg-primary/5",
  };
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

// --- CARD ---
export const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      "rounded-[2.5rem] border-2 border-white bg-card/40 backdrop-blur-xl text-card-foreground shadow-xl shadow-black/5 overflow-hidden", 
      className
    )} 
    {...props} 
  />
))
Card.displayName = "Card"

export const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-8", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

export const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className="text-3xl font-black text-primary tracking-tight leading-none mb-1 {className}" {...props} />
))
CardTitle.displayName = "CardTitle"

export const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground font-medium", className)} {...props} />
))
CardDescription.displayName = "CardDescription"

export const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-8 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

export const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-8 pt-0", className)} {...props} />
))
CardFooter.displayName = "CardFooter"
