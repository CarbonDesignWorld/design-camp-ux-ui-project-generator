import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  Sun, Clock, Flame, Star, Zap, Calendar, Filter, 
  ArrowLeft, Sparkles, Upload, CheckCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubmissionForm from "@/components/SubmissionForm";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useTodaysChallenge, TodaysChallenge as TodaysChallengeType } from "@/hooks/useTodaysChallenge";

interface Challenge {
  id: string;
  title: string;
  description: string;
  full_description?: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  challenge_date: string;
  time_estimate?: string;
  example_outputs?: string[];
}

interface Submission {
  id: string;
  image_urls: string[] | null;
  figma_link: string | null;
  external_url: string | null;
  notes: string | null;
  created_at: string;
}

const difficultyConfig = {
  Beginner: { icon: Sparkles, color: "bg-success/10 text-success border-success/20" },
  Intermediate: { icon: Zap, color: "bg-info/10 text-info border-info/20" },
  Advanced: { icon: Flame, color: "bg-danger/10 text-danger border-danger/20" },
};

const categories = ['All', 'UX', 'UI', 'Microinteraction', 'Landing Page', 'Mobile'] as const;
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'] as const;

const ChallengeCard = ({ challenge }: { challenge: Challenge }) => {
  const { icon: DiffIcon, color } = difficultyConfig[challenge.difficulty];
  
  return (
    <Link to={`/challenge/${challenge.id}`}>
      <Card className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1 h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className={`${color} font-medium`}>
              <DiffIcon className="w-3 h-3 mr-1" />
              {challenge.difficulty}
            </Badge>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(challenge.challenge_date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
          <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">
            {challenge.title}
          </h3>
        </CardHeader>
        <CardContent className="pb-4">
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
            {challenge.description}
          </p>
          <Badge variant="secondary" className="mt-3 bg-secondary/20 text-secondary-foreground">
            {challenge.category}
          </Badge>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            View Challenge
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

const TodayChallenges = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { challenge: todayChallenge, loading: loadingToday } = useTodaysChallenge();
  const [pastChallenges, setPastChallenges] = useState<Challenge[]>([]);
  const [userSubmission, setUserSubmission] = useState<Submission | null>(null);
  const [loadingPast, setLoadingPast] = useState(true);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Countdown timer
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

  // Fetch user's submission for today's challenge
  useEffect(() => {
    const fetchUserSubmission = async () => {
      if (!user || !todayChallenge) return;

      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .eq("challenge_id", todayChallenge.id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching submission:", error);
      } else if (data) {
        setUserSubmission(data as Submission);
      }
    };

    fetchUserSubmission();
  }, [user, todayChallenge]);

  // Fetch past challenges
  useEffect(() => {
    const fetchPastChallenges = async () => {
      const today = new Date().toISOString().split('T')[0];
      
      let query = supabase
        .from("challenges")
        .select("id, title, description, difficulty, category, challenge_date")
        .lt("challenge_date", today)
        .order("challenge_date", { ascending: false });

      if (difficultyFilter !== 'All') {
        query = query.eq("difficulty", difficultyFilter);
      }
      if (categoryFilter !== 'All') {
        query = query.eq("category", categoryFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching past challenges:", error);
      } else {
        setPastChallenges(data as Challenge[]);
      }
      setLoadingPast(false);
    };

    fetchPastChallenges();
  }, [difficultyFilter, categoryFilter]);

  const handleSubmitWork = () => {
    if (!user) {
      navigate("/signup", { state: { from: "/challenges/today" } });
    } else {
      setShowSubmitForm(true);
    }
  };

  const handleSubmissionSuccess = () => {
    setShowSubmitForm(false);
    // Refetch submission
    if (user && todayChallenge) {
      supabase
        .from("submissions")
        .select("*")
        .eq("challenge_id", todayChallenge.id)
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) setUserSubmission(data as Submission);
        });
    }
  };

  const DiffIcon = todayChallenge ? difficultyConfig[todayChallenge.difficulty]?.icon : Star;

  return (
    <>
      <Helmet>
        <title>Today's Challenge | Design Camp</title>
        <meta
          name="description"
          content="Take on today's design challenge and explore past challenges. Build your portfolio one day at a time with Design Camp."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16">
          {/* Today's Challenge Section */}
          <section className="section-padding pine-gradient">
            <div className="container">
              <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors mb-6">
                <ArrowLeft className="w-4 h-4" />
                Back to Camp
              </Link>

              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary-foreground mb-4">
                    <Sun className="w-5 h-5" />
                    <span className="font-semibold">Today's Challenge</span>
                  </div>
                </div>

                <div className="bg-card/95 backdrop-blur rounded-3xl p-8 md:p-12 shadow-camp-lg">
                  {loadingToday ? (
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-32 mx-auto" />
                      <Skeleton className="h-10 w-3/4 mx-auto" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ) : todayChallenge ? (
                    <>
                      {/* Challenge details */}
                      <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-3 mb-4">
                          <Badge variant="outline" className={`${difficultyConfig[todayChallenge.difficulty]?.color} font-medium`}>
                            <DiffIcon className="w-3 h-3 mr-1" />
                            {todayChallenge.difficulty}
                          </Badge>
                          <Badge variant="secondary" className="bg-secondary/20">
                            {todayChallenge.category}
                          </Badge>
                          {todayChallenge.time_estimate && (
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {todayChallenge.time_estimate}
                            </span>
                          )}
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                          {todayChallenge.title}
                        </h1>
                        <p className="text-muted-foreground max-w-lg mx-auto">
                          {todayChallenge.full_description || todayChallenge.description}
                        </p>
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

                      {/* User submission area */}
                      {user && userSubmission ? (
                        <div className="mb-8 p-6 bg-success/10 rounded-xl border border-success/20">
                          <div className="flex items-center gap-2 text-success mb-3">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-semibold">You've submitted your work!</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            Submitted on {new Date(userSubmission.created_at).toLocaleDateString()}
                          </p>
                          {userSubmission.image_urls && userSubmission.image_urls.length > 0 && (
                            <div className="flex gap-2 flex-wrap">
                              {userSubmission.image_urls.slice(0, 3).map((url, idx) => (
                                <img 
                                  key={idx} 
                                  src={url} 
                                  alt={`Submission ${idx + 1}`}
                                  className="w-20 h-20 object-cover rounded-lg"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      ) : showSubmitForm && user ? (
                        <div className="mb-8">
                          <SubmissionForm 
                            challengeId={todayChallenge.id} 
                            onSuccess={handleSubmissionSuccess}
                          />
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <Button variant="camp" size="xl" onClick={handleSubmitWork}>
                            <Upload className="w-5 h-5" />
                            Submit My Work
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground text-lg mb-4">
                        No challenge scheduled for today. Check back tomorrow!
                      </p>
                      <div className="flex items-center justify-center gap-2 p-4 bg-muted/50 rounded-xl">
                        <Clock className="w-5 h-5 text-primary" />
                        <span className="text-muted-foreground">Next challenge in:</span>
                        <span className="font-mono font-bold text-foreground text-lg">
                          {String(timeLeft.hours).padStart(2, "0")}:
                          {String(timeLeft.minutes).padStart(2, "0")}:
                          {String(timeLeft.seconds).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Past Challenges Section */}
          <section className="section-padding">
            <div className="container">
              <div className="mb-8">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                  Past Challenges
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl">
                  Explore our archive of daily design challenges. Pick any challenge to practice and build your portfolio.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4 mb-8 p-4 bg-card rounded-xl border shadow-soft">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Filter className="w-4 h-4" />
                  <span className="font-medium text-sm">Filters:</span>
                </div>
                
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((diff) => (
                      <SelectItem key={diff} value={diff}>
                        {diff === 'All' ? 'All Difficulties' : diff}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat === 'All' ? 'All Categories' : cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {(difficultyFilter !== 'All' || categoryFilter !== 'All') && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setDifficultyFilter('All');
                      setCategoryFilter('All');
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Clear filters
                  </Button>
                )}
              </div>

              {/* Results Count */}
              <p className="text-sm text-muted-foreground mb-6">
                {loadingPast ? "Loading..." : `Showing ${pastChallenges.length} past challenge${pastChallenges.length !== 1 ? 's' : ''}`}
              </p>

              {/* Challenge Grid */}
              {loadingPast ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="h-64">
                      <CardHeader>
                        <Skeleton className="h-6 w-24 mb-2" />
                        <Skeleton className="h-6 w-full" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-16 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : pastChallenges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastChallenges.map((challenge) => (
                    <ChallengeCard key={challenge.id} challenge={challenge} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg">No past challenges match your filters.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setDifficultyFilter('All');
                      setCategoryFilter('All');
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default TodayChallenges;
