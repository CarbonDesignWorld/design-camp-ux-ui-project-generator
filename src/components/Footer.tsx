import { Tent, Twitter, Instagram, Linkedin, Github, Mail, Send, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [challengeReminders, setChallengeReminders] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase.from("newsletter_signups").insert({
        email: email.toLowerCase().trim(),
        challenge_reminders: challengeReminders,
      });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already subscribed!",
            description: "This email is already on our list.",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "You're subscribed to Camp Dispatch!",
          description: challengeReminders 
            ? "You'll also get daily challenge reminders." 
            : "Welcome to the community!",
        });
        setEmail("");
        setChallengeReminders(false);
      }
    } catch (error) {
      console.error("Newsletter signup error:", error);
      toast({
        title: "Signup failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-secondary-foreground/20">
        <div className="container py-12 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Mail className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">Get the Camp Dispatch</span>
            </div>
            <p className="text-secondary-foreground/80 mb-6">
              Daily prompts, design tips, and community highlights delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-full bg-secondary-foreground/10 border border-secondary-foreground/20 text-secondary-foreground placeholder:text-secondary-foreground/50 focus:outline-none focus:border-primary"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  variant="camp" 
                  className="rounded-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {isLoading ? "Subscribing..." : "Subscribe"}
                </Button>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Checkbox
                  id="challenge-reminders"
                  checked={challengeReminders}
                  onCheckedChange={(checked) => setChallengeReminders(checked === true)}
                  className="border-secondary-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label
                  htmlFor="challenge-reminders"
                  className="text-sm text-secondary-foreground/80 cursor-pointer flex items-center gap-1"
                >
                  <Bell className="w-3 h-3" />
                  Send me daily challenge reminders
                </label>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="container py-12 px-6">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Logo & tagline */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Tent className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold font-handwritten">Design Camp</span>
            </div>
            <p className="text-secondary-foreground/80 max-w-sm">
              Your daily creative retreat for UX/UI designers. Build skills, create portfolio pieces, and grow with our global community.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-secondary-foreground/60 hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-secondary-foreground/60 hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-secondary-foreground/60 hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-secondary-foreground/60 hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Camp Links */}
          <div>
            <h4 className="font-semibold mb-4">Camp</h4>
            <ul className="space-y-3">
              <li><Link to="/challenges" className="text-secondary-foreground/80 hover:text-primary transition-colors">Daily Challenge</Link></li>
              <li><Link to="/projects" className="text-secondary-foreground/80 hover:text-primary transition-colors">Project Generator</Link></li>
              <li><Link to="/camp-track" className="text-secondary-foreground/80 hover:text-primary transition-colors">Camp Track</Link></li>
              <li><Link to="/community" className="text-secondary-foreground/80 hover:text-primary transition-colors">Community</Link></li>
              <li><Link to="/leaderboard" className="text-secondary-foreground/80 hover:text-primary transition-colors">Leaderboard</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#how-it-works" className="text-secondary-foreground/80 hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors">Submit Challenge Ideas</a></li>
              <li><a href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors">Design Resources</a></li>
              <li><a href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors">Terms & Privacy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 mt-10 pt-6 text-center text-sm text-secondary-foreground/60">
          © {new Date().getFullYear()} Design Camp. Made with 🏕️ for designers everywhere.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
