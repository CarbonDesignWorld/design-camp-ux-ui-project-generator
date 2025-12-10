import { Badge } from "@/components/ui/badge";
import { Clock, Star, Zap, Flame } from "lucide-react";

const activities = [
  {
    title: "E-commerce Checkout Flow",
    category: "Full App",
    difficulty: "Advanced",
    time: "4-6 hours",
    trending: true,
  },
  {
    title: "Weather App Widget",
    category: "Mobile UI",
    difficulty: "Beginner",
    time: "1-2 hours",
    trending: false,
  },
  {
    title: "SaaS Pricing Page",
    category: "Landing Page",
    difficulty: "Intermediate",
    time: "2-3 hours",
    trending: true,
  },
  {
    title: "Like Button Animation",
    category: "Micro-interaction",
    difficulty: "Beginner",
    time: "30-60 min",
    trending: false,
  },
  {
    title: "Analytics Dashboard",
    category: "Dashboard",
    difficulty: "Advanced",
    time: "5-8 hours",
    trending: true,
  },
  {
    title: "Recipe App Onboarding",
    category: "Mobile UI",
    difficulty: "Intermediate",
    time: "2-4 hours",
    trending: false,
  },
];

const getDifficultyIcon = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner":
      return Star;
    case "Intermediate":
      return Flame;
    case "Advanced":
      return Zap;
    default:
      return Star;
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner":
      return "text-moss bg-moss/10";
    case "Intermediate":
      return "text-primary bg-primary/10";
    case "Advanced":
      return "text-accent bg-accent/10";
    default:
      return "text-muted-foreground bg-muted";
  }
};

const CampActivities = () => {
  return (
    <section className="section-padding bg-card">
      <div className="container">
        <div className="text-center mb-12">
          <span className="camp-badge mb-4">Explore</span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-4">
            Camp Activities to Try
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Browse our collection of design challenges and projects
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {activities.map((activity, index) => {
            const DifficultyIcon = getDifficultyIcon(activity.difficulty);
            return (
              <div
                key={activity.title}
                className="group camp-card cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="outline" className="text-xs">
                    {activity.category}
                  </Badge>
                  {activity.trending && (
                    <Badge className="bg-sunset/20 text-sunset border-0 text-xs">
                      🔥 Trending
                    </Badge>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                  {activity.title}
                </h3>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getDifficultyColor(activity.difficulty)}`}>
                    <DifficultyIcon className="w-3.5 h-3.5" />
                    {activity.difficulty}
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                    <Clock className="w-4 h-4" />
                    {activity.time}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CampActivities;
