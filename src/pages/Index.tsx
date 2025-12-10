import { useState, useMemo } from "react";
import HeroSection from "@/components/HeroSection";
import CategoryFilter from "@/components/CategoryFilter";
import ProjectCard from "@/components/ProjectCard";
import { sampleProjects } from "@/data/projects";
import { Lightbulb, Target, Zap } from "lucide-react";

const categoryMap: Record<string, string> = {
  all: "",
  micro: "Micro-Interactions",
  landing: "Landing Pages",
  ux: "UX Case Studies",
  visual: "Visual Design",
};

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "all") return sampleProjects;
    return sampleProjects.filter(
      (p) => p.category === categoryMap[selectedCategory]
    );
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      {/* Projects Section */}
      <section className="py-20 px-6">
        <div className="container max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Recommended Projects
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Handpicked projects based on current hiring trends and skills in demand.
              Each project is designed to showcase abilities employers are actively seeking.
            </p>
          </div>

          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* Projects grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              No projects found in this category. Check back soon!
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 border-t border-border/50">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why These Projects?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every recommendation is backed by real job market data and hiring manager feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Market-Aligned",
                description:
                  "Projects are selected based on current job postings and skills that hiring managers prioritize.",
              },
              {
                icon: Lightbulb,
                title: "Portfolio-Ready",
                description:
                  "Each project is designed to tell a compelling story and demonstrate real problem-solving skills.",
              },
              {
                icon: Zap,
                title: "Skill-Building",
                description:
                  "Progress through difficulty levels while building a diverse, impressive portfolio.",
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="text-center p-8 rounded-2xl gradient-card border border-border/50 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl gradient-primary mb-6">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/50">
        <div className="container max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground text-sm">
            Built to help designers land their dream jobs. © 2024 DesignPath
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
