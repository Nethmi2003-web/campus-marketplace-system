import { cn } from '../lib/utils';
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// Replaced ui folder import
// Replaced ui folder import
// Replaced ui folder import
import { UserPlus } from "lucide-react";


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


const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";


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


function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    faculty: "",
    universityEmail: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5001/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Store user token/details securely
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/user-dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-lg rounded-[2.5rem] shadow-2xl border-none p-6">
        <CardHeader className="text-center">
          <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
             <UserPlus size={32} />
          </div>
          <CardTitle className="text-3xl font-black text-primary">Create Account</CardTitle>
          <CardDescription className="text-muted-foreground font-medium">Join the SLIIT student marketplace community</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {error && (
              <div className="md:col-span-2 p-3 text-sm text-red-500 bg-red-100 rounded-lg text-center font-medium">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">First Name</label>
              <Input required name="firstName" value={formData.firstName} onChange={handleChange} type="text" placeholder="John" className="rounded-xl h-12 border-muted bg-muted/30 focus:bg-white transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Last Name</label>
              <Input required name="lastName" value={formData.lastName} onChange={handleChange} type="text" placeholder="Doe" className="rounded-xl h-12 border-muted bg-muted/30 focus:bg-white transition-all" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Faculty</label>
              <Input required name="faculty" value={formData.faculty} onChange={handleChange} type="text" placeholder="e.g. Computing, Engineering" className="rounded-xl h-12 border-muted bg-muted/30 focus:bg-white transition-all" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">University Email</label>
              <Input required name="universityEmail" value={formData.universityEmail} onChange={handleChange} type="email" placeholder="it21xxxx@my.sliit.lk" className="rounded-xl h-12 border-muted bg-muted/30 focus:bg-white transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Password</label>
              <Input required name="password" value={formData.password} onChange={handleChange} type="password" placeholder="••••••••" className="rounded-xl h-12 border-muted bg-muted/30 focus:bg-white transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Confirm Password</label>
              <Input required name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password" placeholder="••••••••" className="rounded-xl h-12 border-muted bg-muted/30 focus:bg-white transition-all" />
            </div>
            <div className="md:col-span-2 pt-2">
              <Button disabled={loading} type="submit" className="w-full h-12 rounded-xl text-md font-bold shadow-lg shadow-primary/20 bg-primary">
                {loading ? "Creating Account..." : "Create Student Account"}
              </Button>
            </div>
          </CardContent>
        </form>

        <CardFooter className="flex flex-col gap-4 pt-4">
          <p className="text-sm text-center text-muted-foreground font-medium">
            Already have an account? <Link to="/" className="text-primary font-bold hover:underline">Login</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
export default RegisterPage;
