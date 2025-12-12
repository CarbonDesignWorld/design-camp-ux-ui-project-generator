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
      <div className="container px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <div className="camp-badge mb-3 sm:mb-4">
              <Compass className="w-4 h-4" />
              Camp Projects
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mt-3 sm:mt-4">
              Generate Your Camp Project
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-3 sm:mt-4 max-w-xl mx-auto px-2">
              Create a personalized project based on your goals and available time. 
              Filter by skill level, project type, platform, and duration.
            </p>
          </div>

          {/* CTA Card */}
          <div className="camp-card text-center mb-8 sm:mb-12">
            <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-accent mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
              Ready to start your next design adventure?
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 max-w-md mx-auto px-2">
              Use our project generator to get a customized project prompt with deliverables, 
              tools, and creative constraints.
            </p>
            <div className="flex justify-center px-2 sm:px-0">
              <Link to="/projects" className="w-full max-w-xs sm:w-auto">
                <Button variant="camp" size="lg" className="w-full sm:w-auto">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  Generate a Camp Project
                </Button>
              </Link>
            </div>
          </div>

          {/* Sample Projects */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-foreground text-center mb-4 sm:mb-6">
              Sample Project Ideas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {sampleProjects.map((project) => (
                <div
                  key={project.title}
                  className="bg-card rounded-xl p-4 sm:p-5 border border-border hover:border-primary/30 hover:shadow-camp transition-all duration-300"
                >
                  <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">{project.title}</h4>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {project.type}
                    </span>
                    <span className="text-xs bg-secondary/30 text-secondary-foreground px-2 py-0.5 rounded-full">
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
            <div className="text-center mt-6 sm:mt-8">
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
