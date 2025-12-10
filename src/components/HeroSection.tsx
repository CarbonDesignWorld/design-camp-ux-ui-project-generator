import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden gradient-hero">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="container relative z-10 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full glass animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">AI-Powered Project Recommendations</span>
          </div>

          {/* Main heading */}
          <h1 
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            Build Portfolio Projects
            <br />
            <span className="text-gradient">That Get You Hired</span>
          </h1>

          {/* Subheading */}
          <p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            Get personalized project recommendations tailored to current job market trends. 
            From micro-interactions to full UX case studies—stand out from the crowd.
          </p>

          {/* CTA buttons */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <Button variant="hero" size="xl">
              Get Recommendations
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="glass" size="lg">
              Browse All Projects
            </Button>
          </div>

          {/* Stats */}
          <div 
            className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-border/50 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            {[
              { value: "500+", label: "Curated Projects" },
              { value: "94%", label: "Interview Success" },
              { value: "2.5k", label: "Designers Hired" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">{stat.value}</div>
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
