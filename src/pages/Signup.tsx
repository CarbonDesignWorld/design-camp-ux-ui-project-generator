import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tent, Sparkles, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email is too long"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const from = location.state?.from || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const result = signupSchema.safeParse({ name, email, password });
    if (!result.success) {
      const fieldErrors: { name?: string; email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "name") fieldErrors.name = err.message;
        if (err.path[0] === "email") fieldErrors.email = err.message;
        if (err.path[0] === "password") fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    
    setIsLoading(true);
    const { error } = await signUp(email, password, name);
    setIsLoading(false);
    
    if (error) {
      let description = error.message;
      if (error.message.includes("already registered")) {
        description = "This email is already registered. Try logging in instead.";
      }
      toast({
        title: "Signup failed",
        description,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome to Design Camp!",
        description: "Your account has been created. Let's start creating!",
      });
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Camp
        </Link>
        
        {/* Card */}
        <div className="bg-card rounded-2xl p-8 shadow-medium border border-border">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-secondary/20 mb-4">
              <Tent className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold font-handwritten text-foreground">Join Design Camp!</h1>
            <p className="text-muted-foreground mt-2">Start your creative adventure today</p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="What should we call you?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl h-12"
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl h-12"
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl h-12"
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>
            
            <Button 
              type="submit" 
              variant="camp" 
              size="xl" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Join Camp
                </>
              )}
            </Button>
          </form>
          
          {/* Login link */}
          <div className="text-center mt-6 pt-6 border-t border-border">
            <p className="text-muted-foreground">
              Already a camper?{" "}
              <Link 
                to="/login" 
                state={{ from }}
                className="text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
        
        {/* Playful text */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          🏕️ Pack your creativity — adventure awaits!
        </p>
      </div>
    </div>
  );
};

export default Signup;
