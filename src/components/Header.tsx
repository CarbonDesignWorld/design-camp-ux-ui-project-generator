import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tent, Menu, X } from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Tent className="w-7 h-7 text-primary" />
            <span className="text-xl font-bold font-handwritten text-foreground">Design Camp</span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection("challenge")}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Today's Challenge
            </button>
            <button 
              onClick={() => scrollToSection("projects")}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Projects
            </button>
            <button 
              onClick={() => scrollToSection("community")}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Community
            </button>
            <button 
              onClick={() => scrollToSection("how-it-works")}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </button>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm">
              Log In
            </Button>
            <Button variant="camp" size="sm">
              Join Camp
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-4">
              <button 
                onClick={() => scrollToSection("challenge")}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                Today's Challenge
              </button>
              <button 
                onClick={() => scrollToSection("projects")}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                Projects
              </button>
              <button 
                onClick={() => scrollToSection("community")}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                Community
              </button>
              <button 
                onClick={() => scrollToSection("how-it-works")}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                How It Works
              </button>
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button variant="ghost" size="sm" className="flex-1">
                  Log In
                </Button>
                <Button variant="camp" size="sm" className="flex-1">
                  Join Camp
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
