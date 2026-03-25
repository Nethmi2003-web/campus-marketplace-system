import { cn } from '../lib/utils';
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, ShieldCheck, Mail, Lock, User, Building2 } from "lucide-react";
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/shared/UI";


// UI Components removed, now using shared UI library from ../components/shared/UI


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

      // Store student details securely in isolated key
      localStorage.setItem("std_userInfo", JSON.stringify(data));
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
