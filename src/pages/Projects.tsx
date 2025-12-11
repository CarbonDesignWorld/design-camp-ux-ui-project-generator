import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Compass,
  Clock,
  Wrench,
  Target,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Zap,
  Timer,
  Rocket,
} from "lucide-react";

interface ProjectTemplate {
  id: string;
  title: string;
  description: string;
  deliverables: string[];
  tools_recommended: string[];
  time_estimate: string;
  example_challenges: string[];
  skill_level: string;
  project_type: string;
  platform: string;
  duration: string;
  market_relevance?: string;
}

const skillLevels = [
  { value: "all", label: "All Levels" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const projectTypes = [
  { value: "all", label: "All Types" },
  { value: "UX", label: "UX Design" },
  { value: "UI", label: "UI Design" },
  { value: "Wireframe", label: "Wireframe" },
  { value: "Microinteraction", label: "Microinteraction" },
  { value: "Prototype", label: "Prototype" },
  { value: "Research", label: "Research" },
];

const platforms = [
  { value: "all", label: "All Platforms" },
  { value: "Mobile", label: "Mobile" },
  { value: "Desktop", label: "Desktop" },
  { value: "Tablet", label: "Tablet" },
  { value: "Responsive", label: "Responsive" },
];

const durations = [
  { value: "all", label: "Any Duration" },
  { value: "quick-fire", label: "Quick Fire (1-2 hrs)" },
  { value: "short-sprint", label: "Short Sprint (3-6 hrs)" },
  { value: "full-project", label: "Full Project (8+ hrs)" },
];

const durationConfig: Record<string, { icon: React.ElementType; color: string }> = {
  "quick-fire": { icon: Zap, color: "text-accent" },
  "short-sprint": { icon: Timer, color: "text-info" },
  "full-project": { icon: Rocket, color: "text-primary" },
};

const skillConfig: Record<string, { label: string; color: string }> = {
  beginner: { label: "Beginner", color: "bg-success/20 text-success" },
  intermediate: { label: "Intermediate", color: "bg-info/20 text-info" },
  advanced: { label: "Advanced", color: "bg-danger/20 text-danger" },
};

const Projects = () => {
  const { toast } = useToast();
  const [skillLevel, setSkillLevel] = useState("all");
  const [projectType, setProjectType] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [duration, setDuration] = useState("all");
  const [generatedProject, setGeneratedProject] = useState<ProjectTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateProject = async () => {
    setIsLoading(true);
    try {
      // Call AI to generate a unique project
      const { data, error } = await supabase.functions.invoke('generate-project', {
        body: {
          skillLevel: skillLevel !== "all" ? skillLevel : undefined,
          projectType: projectType !== "all" ? projectType : undefined,
          platform: platform !== "all" ? platform : undefined,
          duration: duration !== "all" ? duration : undefined,
        }
      });

      if (error) throw error;

      if (data?.error) {
        toast({
          title: "Generation Error",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      // Map AI response to our interface
      const project: ProjectTemplate = {
        id: data.id,
        title: data.title,
        description: data.description,
        deliverables: data.deliverables || [],
        tools_recommended: data.tools_recommended || [],
        time_estimate: data.time_estimate || "Varies",
        example_challenges: data.example_challenges || [],
        skill_level: data.skill_level?.toLowerCase() || "intermediate",
        project_type: data.project_type || "UX",
        platform: data.platform || "Web",
        duration: data.duration?.toLowerCase().replace(/\s+/g, "-") || "medium",
        market_relevance: data.market_relevance,
      };

      setGeneratedProject(project);

      toast({
        title: "Project Generated!",
        description: "Your AI-crafted project is ready. Time to get creative!",
      });
    } catch (error) {
      console.error("Error generating project:", error);
      toast({
        title: "Error",
        description: "Failed to generate project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const DurationIcon = generatedProject
    ? durationConfig[generatedProject.duration]?.icon || Clock
    : Clock;

  return (
    <>
      <Helmet>
        <title>Camp Project Generator | Design Camp</title>
        <meta
          name="description"
          content="Generate personalized design projects to build your portfolio. Filter by skill level, project type, platform, and duration."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1">
          {/* Hero */}
          <section className="section-padding bg-secondary/10">
            <div className="container text-center">
              <div className="camp-badge mb-4">
                <Compass className="w-4 h-4" />
                Camp Projects
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mt-4">
                Generate Your Next Design Adventure
              </h1>
              <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
                Get personalized project prompts to build your portfolio. Choose your filters
                and let us craft your next creative challenge.
              </p>
            </div>
          </section>

          {/* Filters Section */}
          <section className="section-padding">
            <div className="container">
              <div className="max-w-4xl mx-auto">
                <div className="camp-card p-6 md:p-8">
                  <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Set Your Parameters
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Skill Level
                      </label>
                      <Select value={skillLevel} onValueChange={setSkillLevel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          {skillLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Project Type
                      </label>
                      <Select value={projectType} onValueChange={setProjectType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {projectTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Platform
                      </label>
                      <Select value={platform} onValueChange={setPlatform}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          {platforms.map((p) => (
                            <SelectItem key={p.value} value={p.value}>
                              {p.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Duration
                      </label>
                      <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          {durations.map((d) => (
                            <SelectItem key={d.value} value={d.value}>
                              {d.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      size="lg"
                      onClick={generateProject}
                      disabled={isLoading}
                      className="gap-2"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <Sparkles className="w-5 h-5" />
                      )}
                      {isLoading ? "Generating..." : "Generate a Camp Project"}
                    </Button>
                  </div>
                </div>

                {/* Generated Project */}
                {generatedProject && (
                  <Card className="mt-8 border-2 border-primary/20 bg-surface">
                    <CardHeader className="pb-4">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge className={skillConfig[generatedProject.skill_level]?.color}>
                          {skillConfig[generatedProject.skill_level]?.label}
                        </Badge>
                        <Badge variant="outline">{generatedProject.project_type}</Badge>
                        <Badge variant="outline">{generatedProject.platform}</Badge>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <DurationIcon className="w-3 h-3" />
                          {generatedProject.duration.replace(/-/g, " ")}
                        </Badge>
                        <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          AI Generated
                        </Badge>
                      </div>
                      <CardTitle className="text-2xl md:text-3xl text-foreground">
                        {generatedProject.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-muted-foreground text-lg">
                        {generatedProject.description}
                      </p>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Deliverables */}
                        <div className="space-y-3">
                          <h3 className="font-semibold text-foreground flex items-center gap-2">
                            <Target className="w-4 h-4 text-primary" />
                            Deliverables
                          </h3>
                          <ul className="space-y-2">
                            {generatedProject.deliverables.map((item, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-muted-foreground"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Tools */}
                        <div className="space-y-3">
                          <h3 className="font-semibold text-foreground flex items-center gap-2">
                            <Wrench className="w-4 h-4 text-primary" />
                            Recommended Tools
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {generatedProject.tools_recommended.map((tool, i) => (
                              <Badge key={i} variant="secondary">
                                {tool}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Time Estimate */}
                      <div className="flex items-center gap-2 p-4 rounded-lg bg-secondary/30">
                        <Clock className="w-5 h-5 text-primary" />
                        <span className="font-medium text-foreground">Time Estimate:</span>
                        <span className="text-muted-foreground">
                          {generatedProject.time_estimate}
                        </span>
                      </div>

                      {/* Challenges */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-accent" />
                          Constraints & Challenges
                        </h3>
                        <ul className="space-y-2">
                          {generatedProject.example_challenges.map((challenge, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-muted-foreground"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                              {challenge}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Market Relevance */}
                      {generatedProject.market_relevance && (
                        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                          <p className="text-sm text-foreground">
                            <span className="font-medium">💼 Why this matters: </span>
                            {generatedProject.market_relevance}
                          </p>
                        </div>
                      )}

                      {/* Regenerate */}
                      <div className="pt-4 border-t border-border flex justify-center">
                        <Button
                          variant="outline"
                          onClick={generateProject}
                          disabled={isLoading}
                          className="gap-2"
                        >
                          <RefreshCw
                            className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                          />
                          Generate Another
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Projects;
