import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Filter, ArrowLeft, Sparkles, Zap, Flame } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  challenge_date: string;
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
          <p className="text-muted-foreground text-sm leading-relaxed">
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

const Challenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  useEffect(() => {
    const fetchChallenges = async () => {
      let query = supabase
        .from("challenges")
        .select("id, title, description, difficulty, category, challenge_date")
        .order("challenge_date", { ascending: false });

      if (difficultyFilter !== 'All') {
        query = query.eq("difficulty", difficultyFilter);
      }
      if (categoryFilter !== 'All') {
        query = query.eq("category", categoryFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching challenges:", error);
      } else {
        setChallenges(data as Challenge[]);
      }
      setLoading(false);
    };

    fetchChallenges();
  }, [difficultyFilter, categoryFilter]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Camp
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
            Past Challenges
          </h1>
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
          {loading ? "Loading..." : `Showing ${challenges.length} challenge${challenges.length !== 1 ? 's' : ''}`}
        </p>

        {/* Challenge Grid */}
        {loading ? (
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
        ) : challenges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No challenges match your filters.</p>
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
      </main>

      <Footer />
    </div>
  );
};

export default Challenges;
