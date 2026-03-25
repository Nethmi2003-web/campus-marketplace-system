import { cn } from '../lib/utils';
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/shared/UI";

// UI Components removed, now using shared UI library from ../components/shared/UI


function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5001/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok) {
         throw new Error(data.message || "Login failed");
      }

      // Save token & user into role-specific keys to allow concurrent multi-role sessions
      if (data.role === 'admin') {
         localStorage.setItem("admin_userInfo", JSON.stringify(data));
         navigate("/admin-dashboard");
      } else {
         localStorage.setItem("std_userInfo", JSON.stringify(data));
         navigate("/user-dashboard");
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md rounded-[2rem] shadow-2xl border-none p-4">
        <CardHeader className="text-center">
          <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
             <ShieldCheck size={32} />
          </div>
          <CardTitle className="text-3xl font-black text-primary">Welcome Back</CardTitle>
          <CardDescription className="text-muted-foreground font-medium">Please login with your university email</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-100 rounded-lg text-center font-medium">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Email Address</label>
              <Input 
                 type="email" 
                 value={formData.email}
                 onChange={(e) => setFormData({...formData, email: e.target.value})}
                 required
                 placeholder="admin@my.sliit.lk" 
                 className="rounded-xl h-12 border-muted bg-muted/30 focus:bg-white transition-all" 
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                 <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</label>
                 <Link to="#" className="text-[10px] font-bold text-primary hover:underline">Forgot Password?</Link>
              </div>
              <Input 
                 type="password" 
                 value={formData.password}
                 onChange={(e) => setFormData({...formData, password: e.target.value})}
                 required
                 placeholder="••••••••" 
                 className="rounded-xl h-12 border-muted bg-muted/30 focus:bg-white transition-all" 
              />
            </div>
            <Button disabled={loading} type="submit" className="w-full h-12 rounded-xl text-md font-bold shadow-lg shadow-primary/20 mt-2">
               {loading ? "Authenticating..." : "Login to Account"}
            </Button>
          </CardContent>
        </form>

        <CardFooter className="flex flex-col gap-4">
          <p className="text-sm text-center text-muted-foreground font-medium">
             Don't have an account? <Link to="/register" className="text-secondary font-bold hover:underline">Sign Up</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
export default LoginPage;
