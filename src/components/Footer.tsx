import { Tent, Twitter, Instagram, Linkedin, Github, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [email, setEmail] = useState("");

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
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-full bg-secondary-foreground/10 border border-secondary-foreground/20 text-secondary-foreground placeholder:text-secondary-foreground/50 focus:outline-none focus:border-primary"
              />
              <Button variant="camp" className="rounded-full">
                <Send className="w-4 h-4" />
                Subscribe
              </Button>
            </div>
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
              <li><a href="#challenge" className="text-secondary-foreground/80 hover:text-primary transition-colors">Daily Challenge</a></li>
              <li><a href="#projects" className="text-secondary-foreground/80 hover:text-primary transition-colors">Project Generator</a></li>
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
