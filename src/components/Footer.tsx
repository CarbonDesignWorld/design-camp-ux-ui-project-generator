import { Tent, Twitter, Instagram, Linkedin, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-12 px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & tagline */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Tent className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold font-handwritten">Design Camp</span>
            </div>
            <p className="text-secondary-foreground/80 max-w-sm">
              Your creative summer camp for UX/UI designers. Build skills, create portfolio pieces, and grow with our community.
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

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Camp</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors">Daily Challenge</a></li>
              <li><a href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors">Project Generator</a></li>
              <li><a href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors">Activities</a></li>
              <li><a href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors">Leaderboard</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors">Privacy</a></li>
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
