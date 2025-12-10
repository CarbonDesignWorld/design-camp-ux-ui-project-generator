import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Sparkles, Zap, Flame, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubmissionForm from "@/components/SubmissionForm";
import { supabase } from "@/integrations/supabase/client";

interface Challenge {
  id: string;
  title: string;
  description: string;
  full_description: string | null;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  time_estimate: string | null;
  example_outputs: string[] | null;
  challenge_date: string;
}

const difficultyConfig = {
  Beginner: { icon: Sparkles, color: "bg-success/10 text-success border-success/20" },
  Intermediate: { icon: Zap, color: "bg-info/10 text-info border-info/20" },
  Advanced: { icon: Flame, color: "bg-danger/10 text-danger border-danger/20" },
};

const ChallengeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isToday, setIsToday] = useState(false);

  useEffect(() => {
    const fetchChallenge = async () => {
      setLoading(true);
      
      let query = supabase.from("challenges").select("*");
      
      if (id === "today") {
        // Get today's challenge
        const today = new Date().toISOString().split("T")[0];
        query = query.eq("challenge_date", today);
      } else {
        query = query.eq("id", id);
      }

      const { data, error } = await query.maybeSingle();
      
      if (error) {
        console.error("Error fetching challenge:", error);
      }
      
      if (data) {
        setChallenge(data as Challenge);
        const today = new Date().toISOString().split("T")[0];
        setIsToday(data.challenge_date === today);
      }
      
      setLoading(false);
    };

    fetchChallenge();
  }, [id]);

  // Countdown timer for today's challenge
  useEffect(() => {
    if (!isToday) return;

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
  }, [isToday]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-3xl font-bold mb-4">Challenge Not Found</h1>
          <p className="text-muted-foreground mb-6">
            This challenge doesn't exist or may have been removed.
          </p>
          <Link to="/challenges">
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Challenges
            </Badge>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const { icon: DiffIcon, color } = difficultyConfig[challenge.difficulty];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Link */}
        <Link to="/challenges" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Challenges
        </Link>

        {/* Challenge Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {isToday && (
              <Badge className="bg-secondary text-secondary-foreground">
                Today's Challenge
              </Badge>
            )}
            <Badge variant="outline" className={`${color} font-medium`}>
              <DiffIcon className="w-3 h-3 mr-1" />
              {challenge.difficulty}
            </Badge>
            <Badge variant="secondary" className="bg-secondary/20">
              {challenge.category}
            </Badge>
          </div>
          
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {challenge.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(challenge.challenge_date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            {challenge.time_estimate && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {challenge.time_estimate}
              </span>
            )}
          </div>
        </div>

        {/* Countdown Timer (Today only) */}
        {isToday && (
          <div className="flex items-center gap-3 mb-8 p-4 bg-primary/10 rounded-xl border border-primary/20">
            <Timer className="w-5 h-5 text-primary" />
            <span className="text-foreground">Next challenge in:</span>
            <span className="font-mono font-bold text-primary text-lg">
              {String(timeLeft.hours).padStart(2, "0")}:
              {String(timeLeft.minutes).padStart(2, "0")}:
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Challenge Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-card rounded-xl border p-6">
              <h2 className="font-display font-bold text-xl mb-4">Challenge Brief</h2>
              <p className="text-muted-foreground mb-6">{challenge.description}</p>
              
              {challenge.full_description && (
                <div className="prose prose-sm max-w-none text-foreground">
                  {challenge.full_description.split("\n").map((paragraph, index) => {
                    if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                      return (
                        <h3 key={index} className="font-semibold text-foreground mt-4 mb-2">
                          {paragraph.replace(/\*\*/g, "")}
                        </h3>
                      );
                    }
                    if (paragraph.startsWith("- ")) {
                      return (
                        <li key={index} className="text-muted-foreground ml-4">
                          {paragraph.substring(2)}
                        </li>
                      );
                    }
                    if (paragraph.trim()) {
                      return (
                        <p key={index} className="text-muted-foreground mb-2">
                          {paragraph}
                        </p>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
            </div>

            {/* Example Outputs */}
            {challenge.example_outputs && challenge.example_outputs.length > 0 && (
              <div className="bg-card rounded-xl border p-6">
                <h2 className="font-display font-bold text-xl mb-4">Example Outputs</h2>
                <div className="grid grid-cols-2 gap-4">
                  {challenge.example_outputs.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Example ${index + 1}`}
                      className="rounded-lg border object-cover aspect-video"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submission Form */}
          <div className="md:col-span-1">
            <div className="sticky top-24">
              <SubmissionForm challengeId={challenge.id} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ChallengeDetail;
