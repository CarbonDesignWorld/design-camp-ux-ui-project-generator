import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tent, Compass, TreePine, Sun, Mountain, Star, Map } from "lucide-react";

const HeroSection = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-cream to-muted pt-16">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Stars */}
        <Star className="absolute top-24 left-1/4 w-4 h-4 text-primary/20 animate-wave" style={{ animationDelay: "0s" }} />
        <Star className="absolute top-32 right-1/3 w-3 h-3 text-accent/30 animate-wave" style={{ animationDelay: "1s" }} />
        <Star className="absolute top-20 right-1/4 w-5 h-5 text-primary/15 animate-wave" style={{ animationDelay: "2s" }} />
        
        {/* Sun */}
        <div className="absolute top-20 right-16 md:right-32">
          <Sun className="w-24 h-24 md:w-32 md:h-32 text-primary/30 animate-wave" />
        </div>
        
        {/* Mountains */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 320" className="w-full h-auto">
            <path fill="hsl(150 35% 35% / 0.15)" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            <path fill="hsl(150 35% 35% / 0.25)" d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,261.3C960,256,1056,224,1152,213.3C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        
        {/* Trees */}
        <TreePine className="absolute bottom-32 left-8 w-16 h-16 text-pine/40 animate-float" style={{ animationDelay: "0s" }} />
        <TreePine className="absolute bottom-40 left-24 w-12 h-12 text-pine/30 animate-float" style={{ animationDelay: "1s" }} />
        <TreePine className="absolute bottom-28 right-12 w-20 h-20 text-pine/40 animate-float" style={{ animationDelay: "2s" }} />
        <TreePine className="absolute bottom-36 right-32 w-14 h-14 text-pine/30 animate-float" style={{ animationDelay: "0.5s" }} />
      </div>

      <div className="container relative z-10 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Camp badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 rounded-full bg-primary/10 border-2 border-primary/20 animate-fade-in">
            <Tent className="w-5 h-5 text-primary" />
            <span className="font-semibold text-primary">Your Daily Creative Retreat</span>
          </div>

          {/* Main heading */}
          <h1 
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-foreground animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            Welcome to{" "}
            <span className="text-gradient-camp font-handwritten text-6xl md:text-8xl">Design Camp</span>
          </h1>

          {/* Subheadline */}
          <p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            Sharpen your UX skills, build your portfolio, and join a global community of designers exploring, creating, and growing together.
          </p>

          {/* Micro-text */}
          <p 
            className="text-sm text-primary/80 font-medium mb-10 animate-fade-in"
            style={{ animationDelay: "0.25s" }}
          >
            Pack your sketchbook. Adventure starts now. 🏕️
          </p>

          {/* CTA buttons */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <Button variant="camp" size="xl" onClick={() => scrollToSection("challenge")}>
              <Sun className="w-5 h-5" />
              Start Today's Challenge
            </Button>
            <Link to="/camp-track">
              <Button variant="pine" size="lg">
                <Map className="w-5 h-5" />
                Customize My Camp Track
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div 
            className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-border animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            {[
              { value: "365", label: "Daily Challenges", icon: Sun },
              { value: "50+", label: "Project Types", icon: Compass },
              { value: "10k+", label: "Happy Campers", icon: Tent },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
