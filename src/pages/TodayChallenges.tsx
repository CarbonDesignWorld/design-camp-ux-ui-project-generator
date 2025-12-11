import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  Sun, Clock, Flame, Star, Zap, Calendar, Filter, 
  Sparkles, Upload, CheckCircle, Trophy, ArrowRight
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
import { useTodaysChallenge } from "@/hooks/useTodaysChallenge";

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
  user_id: string;
}

interface SubmissionWithProfile extends Submission {
  profiles?: {
    name: string | null;
    profile_image: string | null;
  } | null;
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
  const [yesterdaySubmissions, setYesterdaySubmissions] = useState<SubmissionWithProfile[]>([]);
  const [userSubmission, setUserSubmission] = useState<Submission | null>(null);
  const [loadingPast, setLoadingPast] = useState(true);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);
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

  // Fetch yesterday's top submissions
  useEffect(() => {
    const fetchYesterdaySubmissions = async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      // First get yesterday's challenge
      const { data: yesterdayChallenge } = await supabase
        .from("challenges")
        .select("id")
        .eq("challenge_date", yesterdayStr)
        .maybeSingle();

      if (yesterdayChallenge) {
        const { data: submissions, error } = await supabase
          .from("submissions")
          .select("id, image_urls, figma_link, external_url, notes, created_at, user_id")
          .eq("challenge_id", yesterdayChallenge.id)
          .order("created_at", { ascending: false })
          .limit(4);

        if (!error && submissions && submissions.length > 0) {
          // Fetch profiles for these submissions
          const userIds = submissions.map(s => s.user_id);
          const { data: profiles } = await supabase
            .from("profiles")
            .select("user_id, name, profile_image")
            .in("user_id", userIds);

          const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
          
          const submissionsWithProfiles: SubmissionWithProfile[] = submissions.map(s => ({
            ...s,
            profiles: profileMap.get(s.user_id) || null
          }));
          
          setYesterdaySubmissions(submissionsWithProfiles);
        }
      }
      setLoadingSubmissions(false);
    };

    fetchYesterdaySubmissions();
  }, []);

  // Fetch past challenges
  useEffect(() => {
    const fetchPastChallenges = async () => {
      const today = new Date().toISOString().split('T')[0];
      
      let query = supabase
        .from("challenges")
        .select("id, title, description, difficulty, category, challenge_date")
        .lt("challenge_date", today)
        .order("challenge_date", { ascending: false })
        .limit(6);

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

      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="section-padding bg-gradient-to-br from-accent/20 via-primary/10 to-secondary/20 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary" />
              <div className="absolute top-40 right-20 w-20 h-20 rounded-full bg-accent" />
              <div className="absolute bottom-20 left-1/4 w-24 h-24 rounded-full bg-secondary" />
              <div className="absolute bottom-10 right-1/3 w-16 h-16 rounded-full bg-info" />
            </div>
            
            <div className="container text-center relative z-10">
              <div className="camp-badge mb-4">
                <Sun className="w-4 h-4" />
                Daily Challenge
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mt-4">
                Today's Design Adventure
              </h1>
              <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
                A fresh design challenge awaits! Push your creative boundaries and build your portfolio one day at a time.
              </p>
            </div>
          </section>

          {/* Featured Challenge Card */}
          <section className="section-padding -mt-8 relative z-20">
            <div className="container">
              <div className="max-w-3xl mx-auto">
                <Card className="border-2 border-primary/20 shadow-camp-lg bg-card relative overflow-hidden">
                  {/* Animated "Today" badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-accent text-accent-foreground animate-pulse shadow-md">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Today Only
                    </Badge>
                  </div>

                  <CardHeader className="pb-4 pt-8">
                    {loadingToday ? (
                      <div className="space-y-4">
                        <Skeleton className="h-6 w-32 mx-auto" />
                        <Skeleton className="h-10 w-3/4 mx-auto" />
                      </div>
                    ) : todayChallenge ? (
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
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
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                          {todayChallenge.title}
                        </h2>
                      </div>
                    ) : (
                      <div className="text-center">
                        <h2 className="text-2xl font-bold text-foreground">No Challenge Today</h2>
                      </div>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {loadingToday ? (
                      <Skeleton className="h-20 w-full" />
                    ) : todayChallenge ? (
                      <>
                        <p className="text-muted-foreground text-center max-w-lg mx-auto">
                          {todayChallenge.full_description || todayChallenge.description}
                        </p>

                        {/* Countdown timer */}
                        <div className="flex items-center justify-center gap-2 p-4 bg-muted/50 rounded-xl">
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
                          <div className="p-6 bg-success/10 rounded-xl border border-success/20">
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
                          <SubmissionForm 
                            challengeId={todayChallenge.id} 
                            onSuccess={handleSubmissionSuccess}
                          />
                        ) : (
                          <div className="flex justify-center">
                            <Button 
                              variant="camp" 
                              size="xl" 
                              onClick={handleSubmitWork}
                              className="group transition-all duration-300 hover:scale-105 hover:shadow-lg"
                            >
                              <Upload className="w-5 h-5 group-hover:animate-bounce" />
                              Join Today's Challenge
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground mb-4">
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
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Top Submissions from Yesterday */}
          <section className="section-padding bg-secondary/5">
            <div className="container">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-accent" />
                    <span className="text-sm font-medium text-accent">Community Spotlight</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    Top Submissions from Yesterday
                  </h2>
                </div>
                <Link to="/community">
                  <Button variant="outline" className="gap-2 group">
                    View All
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

              {loadingSubmissions ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="aspect-square rounded-xl" />
                  ))}
                </div>
              ) : yesterdaySubmissions.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {yesterdaySubmissions.map((submission) => (
                    <div 
                      key={submission.id} 
                      className="group relative aspect-square rounded-xl overflow-hidden bg-muted border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-medium"
                    >
                      {submission.image_urls && submission.image_urls[0] ? (
                        <img 
                          src={submission.image_urls[0]} 
                          alt="Submission"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <span className="text-muted-foreground text-sm">No image</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-3 left-3 right-3">
                          <p className="text-white text-sm font-medium truncate">
                            {submission.profiles?.name || "Anonymous Camper"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-card rounded-xl border">
                  <p className="text-muted-foreground">No submissions from yesterday yet.</p>
                </div>
              )}
            </div>
          </section>

          {/* Past Challenges Section */}
          <section className="section-padding">
            <div className="container">
              <div className="mb-8">
                <div className="camp-badge mb-4">
                  <Calendar className="w-4 h-4" />
                  Challenge Archive
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  Recent Challenges
                </h2>
                <p className="text-muted-foreground max-w-2xl">
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
                <div className="text-center py-16 bg-card rounded-xl border">
                  <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Past Challenges Yet
                  </h3>
                  <p className="text-muted-foreground">
                    Check back after a few days to explore our challenge archive.
                  </p>
                </div>
              )}

              {/* View All Link */}
              {pastChallenges.length > 0 && (
                <div className="text-center mt-8">
                  <Link to="/challenges">
                    <Button variant="outline" size="lg" className="gap-2 group">
                      View All Challenges
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
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
