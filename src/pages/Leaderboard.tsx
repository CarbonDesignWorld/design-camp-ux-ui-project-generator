import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Flame, Medal, Award, Crown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface LeaderboardEntry {
  user_id: string;
  name: string | null;
  profile_image: string | null;
  submission_count: number;
  streak_days: number;
  total_points: number;
  rank: number;
}

const Leaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"week" | "month" | "all">("all");

  useEffect(() => {
    fetchLeaderboard();
  }, [filter]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("get_leaderboard", {
      time_filter: filter,
    });

    if (error) {
      console.error("Error fetching leaderboard:", error);
    } else {
      setEntries(data || []);
    }
    setLoading(false);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-accent" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-muted-foreground font-medium">#{rank}</span>;
    }
  };

  const getRankBgClass = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-accent/10 border-accent/30";
      case 2:
        return "bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600";
      case 3:
        return "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-700";
      default:
        return "bg-card border-border";
    }
  };

  return (
    <>
      <Helmet>
        <title>Leaderboard | Design Camp</title>
        <meta
          name="description"
          content="See the top designers at Design Camp. Rankings based on challenge submissions and streaks."
        />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-surface pt-20 pb-16">
        <div className="container px-4">
          {/* Hero Section */}
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-foreground px-4 py-2 rounded-full mb-4">
              <Trophy className="w-5 h-5 text-accent" />
              <span className="font-medium">Camp Leaderboard</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Top Campers
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Climb the ranks by submitting challenges and building your streak.
              Every submission earns 1 point, plus 2 bonus points per streak day!
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center mb-8">
            <Tabs
              value={filter}
              onValueChange={(v) => setFilter(v as "week" | "month" | "all")}
            >
              <TabsList className="bg-muted">
                <TabsTrigger value="week">This Week</TabsTrigger>
                <TabsTrigger value="month">This Month</TabsTrigger>
                <TabsTrigger value="all">All Time</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Leaderboard Table */}
          <div className="max-w-3xl mx-auto space-y-3">
            {loading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg"
                >
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16 ml-auto" />
                </div>
              ))
            ) : entries.length === 0 ? (
              <div className="text-center py-16 bg-card border border-border rounded-lg">
                <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Rankings Yet
                </h3>
                <p className="text-muted-foreground">
                  Be the first to submit a challenge and claim the top spot!
                </p>
              </div>
            ) : (
              entries.map((entry) => (
                <div
                  key={entry.user_id}
                  className={`flex items-center gap-4 p-4 border rounded-lg transition-all hover:shadow-md ${getRankBgClass(
                    entry.rank
                  )}`}
                >
                  {/* Rank */}
                  <div className="w-10 flex justify-center">
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* Avatar */}
                  <Avatar className="w-12 h-12 border-2 border-primary/20">
                    <AvatarImage src={entry.profile_image || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {entry.name?.charAt(0)?.toUpperCase() || "C"}
                    </AvatarFallback>
                  </Avatar>

                  {/* Name & Stats */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      {entry.name || "Anonymous Camper"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {entry.submission_count} submission
                      {entry.submission_count !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Streak Badge */}
                  {entry.streak_days > 0 && (
                    <Badge
                      variant="secondary"
                      className="gap-1 bg-danger/10 text-danger border-danger/20"
                    >
                      <Flame className="w-3 h-3" />
                      {entry.streak_days}
                    </Badge>
                  )}

                  {/* Points */}
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      {entry.total_points}
                    </div>
                    <div className="text-xs text-muted-foreground">points</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Leaderboard;
