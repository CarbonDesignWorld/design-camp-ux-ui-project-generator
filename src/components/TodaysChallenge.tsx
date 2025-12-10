import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sun, Clock, Flame, Star, Zap, History, Upload } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const difficulties = [
  { id: "beginner", label: "Beginner", icon: Star, color: "text-moss", time: "30-45 min" },
  { id: "intermediate", label: "Intermediate", icon: Flame, color: "text-primary", time: "1-2 hours" },
  { id: "advanced", label: "Advanced", icon: Zap, color: "text-accent", time: "2-4 hours" },
];

const TodaysChallenge = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState("intermediate");
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const selectedDiff = difficulties.find(d => d.id === selectedDifficulty);

  const handleJoinChallenge = () => {
    if (!user) {
      navigate("/signup", { state: { from: "/" } });
    } else {
      // TODO: Handle join challenge for logged-in users
    }
  };

  const handleSubmitWork = () => {
    if (!user) {
      navigate("/login", { state: { from: "/" } });
    } else {
      // TODO: Handle submit work for logged-in users
    }
  };

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
            {/* Challenge prompt */}
            <div className="text-center mb-8">
              <p className="text-sm text-muted-foreground mb-2">December 10, 2024</p>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Design a mobile app onboarding flow for a meditation app
              </h3>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Focus on creating a calming, intuitive experience that introduces users to the app's core features while maintaining a peaceful aesthetic.
              </p>
            </div>

            {/* Difficulty selector */}
            <div className="mb-8">
              <p className="text-sm text-center text-muted-foreground mb-4">Choose your difficulty:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {difficulties.map((diff) => (
                  <button
                    key={diff.id}
                    onClick={() => setSelectedDifficulty(diff.id)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-full font-semibold transition-all duration-300 ${
                      selectedDifficulty === diff.id
                        ? "bg-primary text-primary-foreground shadow-camp"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    <diff.icon className="w-4 h-4" />
                    {diff.label}
                  </button>
                ))}
              </div>
              {selectedDiff && (
                <p className="text-center text-sm text-muted-foreground mt-3">
                  Estimated time: {selectedDiff.time}
                </p>
              )}
            </div>

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
              <Button variant="camp" size="xl" onClick={handleJoinChallenge}>
                <Flame className="w-5 h-5" />
                Join Today's Challenge
              </Button>
              <Button variant="pine" size="lg">
                <History className="w-5 h-5" />
                View Past Challenges
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
