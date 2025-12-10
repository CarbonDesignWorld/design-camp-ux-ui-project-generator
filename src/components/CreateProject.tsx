import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Compass, Sparkles, Laptop, Smartphone, Monitor, Tablet, Clock, Zap, Timer, Calendar } from "lucide-react";

const projectTypes = [
  { id: "ux", label: "UX Design" },
  { id: "ui", label: "UI Design" },
  { id: "micro", label: "Microinteraction" },
  { id: "visual", label: "Visual Design" },
  { id: "wireframe", label: "Wireframes" },
  { id: "prototype", label: "Prototyping" },
  { id: "research", label: "UX Research" },
];

const skillLevels = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

const platforms = [
  { id: "mobile", label: "Mobile", icon: Smartphone },
  { id: "desktop", label: "Desktop", icon: Monitor },
  { id: "tablet", label: "Tablet", icon: Tablet },
  { id: "responsive", label: "Responsive", icon: Laptop },
];

const durations = [
  { id: "quickfire", label: "Quick Fire", desc: "5-10 min", icon: Zap },
  { id: "sprint", label: "Short Sprint", desc: "30-60 min", icon: Timer },
  { id: "full", label: "Full Project", desc: "2-4 hours", icon: Calendar },
];

const sampleProjects = [
  { title: "Fitness App Dashboard", type: "UI Design", duration: "2 hours", level: "Intermediate" },
  { title: "E-commerce Checkout Flow", type: "UX Design", duration: "3 hours", level: "Advanced" },
  { title: "Loading Animation", type: "Microinteraction", duration: "15 min", level: "Beginner" },
  { title: "Recipe App Wireframes", type: "Wireframes", duration: "1 hour", level: "Beginner" },
  { title: "Banking App Prototype", type: "Prototyping", duration: "4 hours", level: "Advanced" },
  { title: "Social Media Icons", type: "Visual Design", duration: "30 min", level: "Intermediate" },
];

const CreateProject = () => {
  const [projectType, setProjectType] = useState("ui");
  const [skill, setSkill] = useState("intermediate");
  const [platform, setPlatform] = useState("mobile");
  const [duration, setDuration] = useState("sprint");

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
              Create a personalized project based on your goals and available time
            </p>
          </div>

          <div className="camp-card mb-12">
            {/* Project Type */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-foreground mb-3">
                Project Type
              </label>
              <div className="flex flex-wrap gap-2">
                {projectTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setProjectType(type.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      projectType === type.id
                        ? "bg-primary text-primary-foreground shadow-camp"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {type.label}
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

            {/* Duration */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-foreground mb-3">
                Duration
              </label>
              <div className="grid grid-cols-3 gap-3">
                {durations.map((dur) => (
                  <button
                    key={dur.id}
                    onClick={() => setDuration(dur.id)}
                    className={`flex flex-col items-center gap-1 p-4 rounded-xl text-sm font-medium transition-all duration-300 border-2 ${
                      duration === dur.id
                        ? "bg-primary/10 border-primary"
                        : "bg-card border-border hover:border-primary/50"
                    }`}
                  >
                    <dur.icon className={`w-5 h-5 ${duration === dur.id ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={duration === dur.id ? "text-primary" : "text-foreground"}>{dur.label}</span>
                    <span className="text-xs text-muted-foreground">{dur.desc}</span>
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
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {project.type}
                    </span>
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                      {project.duration}
                    </span>
                    <span className="text-xs bg-secondary/30 text-secondary-foreground px-2 py-1 rounded-full">
                      {project.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateProject;
