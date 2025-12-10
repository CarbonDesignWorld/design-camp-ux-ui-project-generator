import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Compass, Sparkles, Laptop, Smartphone, Monitor, Building, ShoppingBag, Heart, Plane } from "lucide-react";

const categories = [
  { id: "micro", label: "Micro-interaction" },
  { id: "landing", label: "Landing Page" },
  { id: "app", label: "Full App" },
  { id: "dashboard", label: "Dashboard" },
  { id: "mobile", label: "Mobile UI" },
];

const skillLevels = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

const platforms = [
  { id: "web", label: "Web", icon: Monitor },
  { id: "mobile", label: "Mobile", icon: Smartphone },
  { id: "desktop", label: "Desktop", icon: Laptop },
];

const industries = [
  { id: "tech", label: "Tech", icon: Laptop },
  { id: "ecommerce", label: "E-commerce", icon: ShoppingBag },
  { id: "health", label: "Healthcare", icon: Heart },
  { id: "travel", label: "Travel", icon: Plane },
  { id: "finance", label: "Finance", icon: Building },
];

const CreateProject = () => {
  const [category, setCategory] = useState("landing");
  const [skill, setSkill] = useState("intermediate");
  const [platform, setPlatform] = useState("web");
  const [industry, setIndustry] = useState("tech");

  return (
    <section className="section-padding bg-background">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="camp-badge mb-4">
              <Compass className="w-4 h-4" />
              Project Generator
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-4">
              Create Your Camp Project
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Customize your creative adventure with our project generator
            </p>
          </div>

          <div className="camp-card">
            {/* Category */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-foreground mb-3">
                Project Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      category === cat.id
                        ? "bg-primary text-primary-foreground shadow-camp"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Skill Level */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-foreground mb-3">
                Skill Level
              </label>
              <div className="flex flex-wrap gap-2">
                {skillLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setSkill(level.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      skill === level.id
                        ? "bg-secondary text-secondary-foreground shadow-camp"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-foreground mb-3">
                Platform
              </label>
              <div className="flex flex-wrap gap-3">
                {platforms.map((plat) => (
                  <button
                    key={plat.id}
                    onClick={() => setPlatform(plat.id)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 border-2 ${
                      platform === plat.id
                        ? "bg-accent/10 border-accent text-accent"
                        : "bg-card border-border text-muted-foreground hover:border-accent/50"
                    }`}
                  >
                    <plat.icon className="w-4 h-4" />
                    {plat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Industry */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-foreground mb-3">
                Industry
              </label>
              <div className="flex flex-wrap gap-3">
                {industries.map((ind) => (
                  <button
                    key={ind.id}
                    onClick={() => setIndustry(ind.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border-2 ${
                      industry === ind.id
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-card border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    <ind.icon className="w-4 h-4" />
                    {ind.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <div className="text-center pt-4">
              <Button variant="camp" size="xl">
                <Sparkles className="w-5 h-5" />
                Generate a Camp Project
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateProject;
