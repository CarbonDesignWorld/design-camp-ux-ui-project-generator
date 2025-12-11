import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Map, Target, Wrench, TrendingUp, Sparkles } from "lucide-react";

const goals = [
  { id: "portfolio", label: "Build My Portfolio" },
  { id: "skills", label: "Sharpen Skills" },
  { id: "job", label: "Land a Job" },
  { id: "fun", label: "Design for Fun" },
];

const tools = [
  { id: "figma", label: "Figma" },
  { id: "sketch", label: "Sketch" },
  { id: "xd", label: "Adobe XD" },
  { id: "framer", label: "Framer" },
  { id: "webflow", label: "Webflow" },
];

const levels = [
  { id: "newbie", label: "Just Starting", desc: "New to design" },
  { id: "learning", label: "Learning", desc: "1-2 years experience" },
  { id: "growing", label: "Growing", desc: "2-4 years experience" },
  { id: "experienced", label: "Experienced", desc: "5+ years experience" },
];

const CampPath = () => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState("");

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(g => g !== goalId)
        : [...prev, goalId]
    );
  };

  const toggleTool = (toolId: string) => {
    setSelectedTools(prev => 
      prev.includes(toolId) 
        ? prev.filter(t => t !== toolId)
        : [...prev, toolId]
    );
  };

  return (
    <section id="camp-path" className="section-padding bg-cream">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="camp-badge mb-4">
              <Map className="w-4 h-4" />
              Personalized Path
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-4">
              Choose Your Camp Path
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Create a personalized design adventure based on your goals and experience
            </p>
          </div>

          <div className="camp-card">
            {/* Design Goals */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-primary" />
                <label className="text-sm font-semibold text-foreground">
                  What are your design goals?
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {goals.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedGoals.includes(goal.id)
                        ? "bg-primary text-primary-foreground shadow-camp"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {goal.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tool Preference */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="w-5 h-5 text-secondary" />
                <label className="text-sm font-semibold text-foreground">
                  What tools do you use?
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => toggleTool(tool.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedTools.includes(tool.id)
                        ? "bg-secondary text-secondary-foreground shadow-camp"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {tool.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-accent" />
                <label className="text-sm font-semibold text-foreground">
                  What's your experience level?
                </label>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {levels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedLevel(level.id)}
                    className={`p-4 rounded-xl text-center transition-all duration-300 border-2 ${
                      selectedLevel === level.id
                        ? "bg-accent/10 border-accent"
                        : "bg-card border-border hover:border-accent/50"
                    }`}
                  >
                    <div className={`text-sm font-semibold ${selectedLevel === level.id ? "text-accent" : "text-foreground"}`}>
                      {level.label}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{level.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex justify-center pt-4">
              <Button variant="camp" size="xl">
                <Sparkles className="w-5 h-5" />
                Customize My Camp Track
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CampPath;
