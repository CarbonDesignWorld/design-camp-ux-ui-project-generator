import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sun, Clock, Flame, Star, Zap, History, Upload } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useTodaysChallenge } from "@/hooks/useTodaysChallenge";

const difficulties = [
  { id: "Beginner", label: "Beginner", icon: Star, color: "text-moss", time: "30-45 min" },
  { id: "Intermediate", label: "Intermediate", icon: Flame, color: "text-primary", time: "1-2 hours" },
  { id: "Advanced", label: "Advanced", icon: Zap, color: "text-accent", time: "2-4 hours" },
];

const TodaysChallenge = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const { user } = useAuth();
  const navigate = useNavigate();
  const { challenge, loading } = useTodaysChallenge();

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      
      return {
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmitWork = () => {
    if (!user) {
      navigate("/login", { state: { from: "/" } });
    } else {
      navigate("/challenges/today");
    }
  };

  const selectedDiff = challenge ? difficulties.find(d => d.id === challenge.difficulty) : null;

  return (
    <section id="challenge" className="section-padding pine-gradient">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary-foreground mb-4">
              <Sun className="w-5 h-5" />
              <span className="font-semibold">Today's Camp Challenge</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-secondary-foreground">
              Daily Design Adventure
            </h2>
          </div>

          <div className="bg-card/95 backdrop-blur rounded-3xl p-8 md:p-12 shadow-camp-lg">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-32 mx-auto" />
                <Skeleton className="h-10 w-3/4 mx-auto" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : challenge ? (
              <>
                {/* Challenge prompt */}
                <div className="text-center mb-8">
                  <p className="text-sm text-muted-foreground mb-2">
                    {new Date(challenge.challenge_date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {challenge.title}
                  </h3>
                  <p className="text-muted-foreground max-w-lg mx-auto">
                    {challenge.description}
                  </p>
                </div>

                {/* Difficulty display */}
                <div className="mb-8">
                  <div className="flex flex-wrap justify-center gap-3">
                    {difficulties.map((diff) => (
                      <div
                        key={diff.id}
                        className={`flex items-center gap-2 px-5 py-3 rounded-full font-semibold transition-all duration-300 ${
                          challenge.difficulty === diff.id
                            ? "bg-primary text-primary-foreground shadow-camp"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <diff.icon className="w-4 h-4" />
                        {diff.label}
                      </div>
                    ))}
                  </div>
                  {selectedDiff && (
                    <p className="text-center text-sm text-muted-foreground mt-3">
                      Estimated time: {challenge.time_estimate || selectedDiff.time}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No challenge available for today. Check back soon!</p>
              </div>
            )}

            {/* Countdown timer */}
            <div className="flex items-center justify-center gap-2 mb-8 p-4 bg-muted/50 rounded-xl">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-muted-foreground">Next challenge in:</span>
              <span className="font-mono font-bold text-foreground text-lg">
                {String(timeLeft.hours).padStart(2, "0")}:
                {String(timeLeft.minutes).padStart(2, "0")}:
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="camp" size="xl" onClick={() => navigate("/challenges/today")}>
                <Flame className="w-5 h-5" />
                Join Today's Challenge
              </Button>
              <Button variant="pine" size="lg" onClick={() => navigate("/challenges/today")}>
                <History className="w-5 h-5" />
                View All Challenges
              </Button>
              <Button variant="outline" size="lg" onClick={handleSubmitWork}>
                <Upload className="w-5 h-5" />
                Submit My Work
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TodaysChallenge;
