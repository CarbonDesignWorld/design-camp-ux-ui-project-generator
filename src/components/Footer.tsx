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
        <div className="container py-8 sm:py-12 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              <span className="text-lg sm:text-xl font-bold">Get the Camp Dispatch</span>
            </div>
            <p className="text-sm sm:text-base text-secondary-foreground/80 mb-4 sm:mb-6 px-2">
              Daily prompts, design tips, and community highlights delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto px-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-full bg-secondary-foreground/10 border border-secondary-foreground/20 text-secondary-foreground placeholder:text-secondary-foreground/50 focus:outline-none focus:border-primary text-base"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  variant="camp" 
                  className="rounded-full w-full sm:w-auto"
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

      <div className="container py-8 sm:py-12 px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8">
          {/* Logo & tagline */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Tent className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
              <span className="text-xl sm:text-2xl font-bold font-handwritten">Design Camp</span>
            </div>
            <p className="text-sm sm:text-base text-secondary-foreground/80 max-w-sm">
              Your daily creative retreat for UX/UI designers. Build skills, create portfolio pieces, and grow with our global community.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-4 mt-4 sm:mt-6">
              <a href="#" className="text-secondary-foreground/60 hover:text-primary transition-colors p-1">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-secondary-foreground/60 hover:text-primary transition-colors p-1">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-secondary-foreground/60 hover:text-primary transition-colors p-1">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-secondary-foreground/60 hover:text-primary transition-colors p-1">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Camp Links */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Camp</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li><Link to="/challenges" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">Daily Challenge</Link></li>
              <li><Link to="/projects" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">Project Generator</Link></li>
              <li><Link to="/camp-track" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">Camp Track</Link></li>
              <li><Link to="/community" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">Community</Link></li>
              <li><Link to="/leaderboard" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">Leaderboard</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Resources</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="#how-it-works" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="#" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">Submit Ideas</a></li>
              <li><a href="#" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">Design Resources</a></li>
              <li><a href="#" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="#" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">Terms & Privacy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 mt-8 sm:mt-10 pt-4 sm:pt-6 text-center text-xs sm:text-sm text-secondary-foreground/60">
          © {new Date().getFullYear()} Design Camp. Made with 🏕️ for designers everywhere.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
