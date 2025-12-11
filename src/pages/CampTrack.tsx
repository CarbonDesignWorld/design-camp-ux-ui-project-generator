import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  Map,
  ChevronRight,
  ChevronLeft,
  Target,
  Wrench,
  Clock,
  Sparkles,
  Check,
  Zap,
  Timer,
  Rocket,
  ArrowRight,
} from "lucide-react";

const skillLevels = [
  { id: "beginner", label: "Beginner", desc: "Just starting my design journey" },
  { id: "intermediate", label: "Intermediate", desc: "Comfortable with basics, want to grow" },
  { id: "advanced", label: "Advanced", desc: "Looking to master and specialize" },
];

const goals = [
  { id: "portfolio", label: "Portfolio Building" },
  { id: "visual", label: "Visual Design" },
  { id: "ux-research", label: "UX Research" },
  { id: "interaction", label: "Interaction Design" },
  { id: "prototyping", label: "Prototyping" },
  { id: "design-systems", label: "Design Systems" },
  { id: "mobile", label: "Mobile Design" },
  { id: "web", label: "Web Design" },
];

const tools = [
  { id: "figma", label: "Figma" },
  { id: "adobe-xd", label: "Adobe XD" },
  { id: "sketch", label: "Sketch" },
  { id: "protopie", label: "ProtoPie" },
  { id: "principle", label: "Principle" },
  { id: "framer", label: "Framer" },
  { id: "miro", label: "Miro" },
  { id: "notion", label: "Notion" },
];

const timeOptions = [
  { id: 2, label: "1-2 hours", desc: "Quick sessions", icon: Zap },
  { id: 5, label: "3-5 hours", desc: "Regular practice", icon: Timer },
  { id: 10, label: "6-10 hours", desc: "Dedicated learner", icon: Rocket },
  { id: 15, label: "10+ hours", desc: "Full commitment", icon: Target },
];

interface Preferences {
  skill_level: string;
  goals: string[];
  preferred_tools: string[];
  weekly_hours: number;
}

interface Recommendation {
  type: "challenge" | "project";
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  category: string;
}

const CampTrack = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [existingPrefs, setExistingPrefs] = useState<Preferences | null>(null);
  
  const [preferences, setPreferences] = useState<Preferences>({
    skill_level: "",
    goals: [],
    preferred_tools: [],
    weekly_hours: 0,
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  useEffect(() => {
    if (!authLoading && user) {
      loadExistingPreferences();
    }
  }, [user, authLoading]);

  const loadExistingPreferences = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    
    if (data) {
      setExistingPrefs(data);
      setPreferences({
        skill_level: data.skill_level,
        goals: data.goals,
        preferred_tools: data.preferred_tools,
        weekly_hours: data.weekly_hours,
      });
    }
  };

  const toggleArrayItem = (array: string[], item: string): string[] => {
    return array.includes(item)
      ? array.filter((i) => i !== item)
      : [...array, item];
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return !!preferences.skill_level;
      case 2:
        return preferences.goals.length > 0;
      case 3:
        return preferences.preferred_tools.length > 0;
      case 4:
        return preferences.weekly_hours > 0;
      default:
        return false;
    }
  };

  const generateRecommendations = async () => {
    setIsLoading(true);
    
    try {
      // Fetch matching challenges
      const { data: challenges } = await supabase
        .from("challenges")
        .select("*")
        .eq("difficulty", preferences.skill_level)
        .limit(3);

      // Fetch matching projects based on skill level
      const { data: projects } = await supabase
        .from("project_templates")
        .select("*")
        .eq("skill_level", preferences.skill_level)
        .limit(3);

      const recs: Recommendation[] = [];

      challenges?.forEach((c) => {
        recs.push({
          type: "challenge",
          title: c.title,
          description: c.description,
          duration: c.time_estimate || "30-60 min",
          difficulty: c.difficulty,
          category: c.category,
        });
      });

      projects?.forEach((p) => {
        recs.push({
          type: "project",
          title: p.title,
          description: p.description,
          duration: p.time_estimate,
          difficulty: p.skill_level,
          category: p.project_type,
        });
      });

      // If no matches, create generic recommendations based on goals
      if (recs.length === 0) {
        preferences.goals.slice(0, 3).forEach((goal) => {
          recs.push({
            type: "project",
            title: `${goal.replace("-", " ")} Practice`,
            description: `Build your ${goal.replace("-", " ")} skills with focused exercises.`,
            duration: preferences.weekly_hours <= 2 ? "1-2 hours" : "3-5 hours",
            difficulty: preferences.skill_level,
            category: goal,
          });
        });
      }

      setRecommendations(recs);
    } catch (error) {
      console.error("Error generating recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your preferences.",
        variant: "destructive",
      });
      navigate("/login", { state: { from: "/camp-track" } });
      return;
    }

    setIsLoading(true);
    
    try {
      if (existingPrefs) {
        const { error } = await supabase
          .from("user_preferences")
          .update({
            skill_level: preferences.skill_level,
            goals: preferences.goals,
            preferred_tools: preferences.preferred_tools,
            weekly_hours: preferences.weekly_hours,
          })
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("user_preferences").insert({
          user_id: user.id,
          skill_level: preferences.skill_level,
          goals: preferences.goals,
          preferred_tools: preferences.preferred_tools,
          weekly_hours: preferences.weekly_hours,
        });

        if (error) throw error;
      }

      await generateRecommendations();
      setShowResults(true);
      
      toast({
        title: "Camp Track Created!",
        description: "Your personalized learning path is ready.",
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground">What's your skill level?</h2>
              <p className="text-muted-foreground mt-2">
                We'll tailor challenges to match your experience.
              </p>
            </div>
            <div className="grid gap-4">
              {skillLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setPreferences({ ...preferences, skill_level: level.id })}
                  className={`p-5 rounded-xl border-2 text-left transition-all duration-300 ${
                    preferences.skill_level === level.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{level.label}</h3>
                      <p className="text-sm text-muted-foreground">{level.desc}</p>
                    </div>
                    {preferences.skill_level === level.id && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground">What are your goals?</h2>
              <p className="text-muted-foreground mt-2">
                Select all that apply. We'll focus your track on these areas.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() =>
                    setPreferences({
                      ...preferences,
                      goals: toggleArrayItem(preferences.goals, goal.id),
                    })
                  }
                  className={`px-5 py-3 rounded-full font-medium transition-all duration-300 ${
                    preferences.goals.includes(goal.id)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {preferences.goals.includes(goal.id) && (
                    <Check className="w-4 h-4 inline mr-2" />
                  )}
                  {goal.label}
                </button>
              ))}
            </div>
            {preferences.goals.length > 0 && (
              <p className="text-center text-sm text-muted-foreground">
                {preferences.goals.length} goal{preferences.goals.length > 1 ? "s" : ""} selected
              </p>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground">Your preferred tools?</h2>
              <p className="text-muted-foreground mt-2">
                We'll recommend projects that use your favorite tools.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() =>
                    setPreferences({
                      ...preferences,
                      preferred_tools: toggleArrayItem(preferences.preferred_tools, tool.id),
                    })
                  }
                  className={`px-5 py-3 rounded-xl border-2 font-medium transition-all duration-300 ${
                    preferences.preferred_tools.includes(tool.id)
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border bg-card text-muted-foreground hover:border-accent/50"
                  }`}
                >
                  {preferences.preferred_tools.includes(tool.id) && (
                    <Check className="w-4 h-4 inline mr-2" />
                  )}
                  {tool.label}
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground">Weekly time commitment?</h2>
              <p className="text-muted-foreground mt-2">
                How much time can you dedicate to design practice each week?
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {timeOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setPreferences({ ...preferences, weekly_hours: option.id })}
                  className={`p-5 rounded-xl border-2 text-center transition-all duration-300 ${
                    preferences.weekly_hours === option.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <option.icon
                    className={`w-8 h-8 mx-auto mb-2 ${
                      preferences.weekly_hours === option.id
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                  <h3 className="font-semibold text-foreground">{option.label}</h3>
                  <p className="text-sm text-muted-foreground">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderResults = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
          <Map className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-foreground">Your Camp Map</h2>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          Based on your preferences, here's your personalized learning path.
        </p>
      </div>

      {/* Preferences Summary */}
      <Card className="bg-surface">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Your Profile</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Skill Level:</span>
              <Badge className="ml-2 capitalize">{preferences.skill_level}</Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Weekly Time:</span>
              <span className="ml-2 text-foreground">{preferences.weekly_hours}+ hours</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-muted-foreground">Goals:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {preferences.goals.map((g) => (
                  <Badge key={g} variant="secondary" className="capitalize">
                    {g.replace("-", " ")}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2">
              <span className="text-muted-foreground">Tools:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {preferences.preferred_tools.map((t) => (
                  <Badge key={t} variant="outline" className="capitalize">
                    {t.replace("-", " ")}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <div>
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          Recommended For You
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {recommendations.map((rec, i) => (
            <Card key={i} className="hover:shadow-camp transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant={rec.type === "challenge" ? "default" : "secondary"}>
                    {rec.type === "challenge" ? "Challenge" : "Project"}
                  </Badge>
                  <span className="text-xs text-muted-foreground capitalize">{rec.difficulty}</span>
                </div>
                <h4 className="font-semibold text-foreground mb-2">{rec.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {rec.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    {rec.category}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Button
          variant="camp"
          size="lg"
          onClick={() => navigate("/challenges")}
          className="gap-2"
        >
          Start a Challenge
          <ArrowRight className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate("/projects")}
          className="gap-2"
        >
          Browse Projects
        </Button>
        <Button
          variant="ghost"
          size="lg"
          onClick={() => {
            setShowResults(false);
            setStep(1);
          }}
        >
          Edit Preferences
        </Button>
      </div>
    </div>
  );

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Customize My Camp Track | Design Camp</title>
        <meta
          name="description"
          content="Create your personalized design learning path. Set your skill level, goals, and time availability to get curated challenges and projects."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1">
          {/* Hero */}
          <section className="section-padding bg-secondary/10">
            <div className="container text-center">
              <div className="camp-badge mb-4">
                <Map className="w-4 h-4" />
                Camp Track
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mt-4">
                {showResults ? "Your Camp Map" : "Customize Your Camp Track"}
              </h1>
              <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
                {showResults
                  ? "Your personalized learning path awaits"
                  : "Tell us about yourself and we'll create a personalized learning path"}
              </p>
            </div>
          </section>

          {/* Content */}
          <section className="section-padding">
            <div className="container">
              <div className="max-w-2xl mx-auto">
                {showResults ? (
                  renderResults()
                ) : (
                  <div className="camp-card">
                    {/* Progress */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">
                          Step {step} of {totalSteps}
                        </span>
                        <span className="text-primary font-medium">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    {/* Step Content */}
                    {renderStep()}

                    {/* Navigation */}
                    <div className="flex justify-between mt-10 pt-6 border-t border-border">
                      <Button
                        variant="ghost"
                        onClick={() => setStep(step - 1)}
                        disabled={step === 1}
                        className="gap-2"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                      </Button>

                      {step < totalSteps ? (
                        <Button
                          onClick={() => setStep(step + 1)}
                          disabled={!canProceed()}
                          className="gap-2"
                        >
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="camp"
                          onClick={savePreferences}
                          disabled={!canProceed() || isLoading}
                          className="gap-2"
                        >
                          {isLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                              Creating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              Create My Map
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
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

export default CampTrack;
