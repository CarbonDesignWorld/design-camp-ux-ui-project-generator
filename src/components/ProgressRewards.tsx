import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy, Flame, Star, Mountain, TreePine, Compass } from "lucide-react";

const levels = [
  { 
    name: "Scout", 
    icon: Compass, 
    xp: "0-100 XP",
    color: "text-muted-foreground",
    bgColor: "bg-muted",
  },
  { 
    name: "Camper", 
    icon: TreePine, 
    xp: "100-500 XP",
    color: "text-moss",
    bgColor: "bg-moss/10",
  },
  { 
    name: "Ranger", 
    icon: Mountain, 
    xp: "500-1500 XP",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  { 
    name: "Trailblazer", 
    icon: Star, 
    xp: "1500+ XP",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
];

const rewards = [
  { icon: "🔥", title: "Daily Streaks", desc: "Keep your creative fire burning" },
  { icon: "🏆", title: "Challenge Wins", desc: "Complete daily challenges" },
  { icon: "⭐", title: "Community Stars", desc: "Get featured by the community" },
  { icon: "🎯", title: "Skill Badges", desc: "Master different design areas" },
];

const ProgressRewards = () => {
  return (
    <section id="progress" className="section-padding pine-gradient">
      <div className="container">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary-foreground mb-4">
            <Trophy className="w-5 h-5" />
            <span className="font-semibold">Progress & Rewards</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-secondary-foreground">
            Level Up Your Design Journey
          </h2>
          <p className="text-secondary-foreground/80 mt-4 max-w-xl mx-auto">
            Track your progress, earn badges, and climb the ranks as you grow
          </p>
        </div>

        {/* Levels */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {levels.map((level, index) => (
            <div
              key={level.name}
              className="bg-card/95 backdrop-blur rounded-2xl p-6 text-center hover:shadow-camp-lg transition-all duration-300"
            >
              <div className={`w-16 h-16 mx-auto rounded-full ${level.bgColor} flex items-center justify-center mb-4`}>
                <level.icon className={`w-8 h-8 ${level.color}`} />
              </div>
              <h3 className={`text-xl font-bold ${level.color}`}>{level.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{level.xp}</p>
              <div className="flex justify-center gap-1 mt-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${i <= index ? level.bgColor : "bg-muted"}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Rewards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {rewards.map((reward) => (
            <div
              key={reward.title}
              className="bg-card/80 backdrop-blur rounded-xl p-5 flex items-start gap-4"
            >
              <span className="text-3xl">{reward.icon}</span>
              <div>
                <h4 className="font-semibold text-foreground">{reward.title}</h4>
                <p className="text-sm text-muted-foreground">{reward.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Current Streak Example */}
        <div className="max-w-lg mx-auto bg-card/95 backdrop-blur rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-primary" />
              <span className="font-semibold text-foreground">Current Streak</span>
            </div>
            <span className="text-3xl font-bold text-primary">7 days</span>
          </div>
          <div className="flex gap-1">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
              <div
                key={i}
                className={`flex-1 h-10 rounded-lg flex items-center justify-center text-xs font-medium ${
                  i < 7 ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="camp" size="xl" asChild>
            <Link to="/signup">
              <Trophy className="w-5 h-5" />
              Join Camp
            </Link>
          </Button>
          <p className="text-secondary-foreground/60 text-sm mt-3">
            Start earning XP with your first challenge
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProgressRewards;
