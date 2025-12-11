import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Compass, Sparkles, ArrowRight, Clock } from "lucide-react";

const sampleProjects = [
  { title: "Fitness App Dashboard", type: "UI Design", duration: "2 hours", level: "Intermediate" },
  { title: "E-commerce Checkout Flow", type: "UX Design", duration: "3 hours", level: "Advanced" },
  { title: "Loading Animation", type: "Microinteraction", duration: "15 min", level: "Beginner" },
  { title: "Recipe App Wireframes", type: "Wireframe", duration: "1 hour", level: "Beginner" },
  { title: "Banking App Prototype", type: "Prototype", duration: "4 hours", level: "Advanced" },
  { title: "Social Media Icons", type: "UI Design", duration: "30 min", level: "Intermediate" },
];

const CreateProject = () => {
  return (
    <section id="projects" className="section-padding bg-background">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="camp-badge mb-4">
              <Compass className="w-4 h-4" />
              Camp Projects
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-4">
              Generate Your Camp Project
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Create a personalized project based on your goals and available time. 
              Filter by skill level, project type, platform, and duration.
            </p>
          </div>

          {/* CTA Card */}
          <div className="camp-card text-center mb-12">
            <Sparkles className="w-12 h-12 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">
              Ready to start your next design adventure?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Use our project generator to get a customized project prompt with deliverables, 
              tools, and creative constraints.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/projects">
                <Button variant="camp" size="xl">
                  <Sparkles className="w-5 h-5" />
                  Generate a Camp Project
                </Button>
              </Link>
              <Link to="/projects">
                <Button variant="outline" size="lg" className="gap-2">
                  Explore Camp Projects
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Sample Projects */}
          <div>
            <h3 className="text-xl font-semibold text-foreground text-center mb-6">
              Sample Project Ideas
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleProjects.map((project) => (
                <div
                  key={project.title}
                  className="bg-card rounded-xl p-5 border border-border hover:border-primary/30 hover:shadow-camp transition-all duration-300"
                >
                  <h4 className="font-semibold text-foreground mb-2">{project.title}</h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {project.type}
                    </span>
                    <span className="text-xs bg-secondary/30 text-secondary-foreground px-2 py-1 rounded-full">
                      {project.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {project.duration}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/projects">
                <Button variant="ghost" className="gap-2">
                  View All Projects
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateProject;
