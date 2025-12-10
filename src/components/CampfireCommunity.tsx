import { Button } from "@/components/ui/button";
import { Users, Flame, Star, Award, Heart, MessageCircle } from "lucide-react";

const submissions = [
  {
    id: 1,
    title: "Meditation App Onboarding",
    author: "Sarah K.",
    likes: 124,
    badge: "🏆 Featured",
  },
  {
    id: 2,
    title: "E-commerce Checkout Flow",
    author: "Mike R.",
    likes: 89,
    badge: "⭐ Top Pick",
  },
  {
    id: 3,
    title: "Fitness Dashboard",
    author: "Emma L.",
    likes: 156,
    badge: "🔥 Trending",
  },
  {
    id: 4,
    title: "Travel Booking App",
    author: "Alex P.",
    likes: 72,
    badge: null,
  },
  {
    id: 5,
    title: "Music Player Interface",
    author: "Jordan T.",
    likes: 98,
    badge: "💎 Creative",
  },
  {
    id: 6,
    title: "Recipe App Redesign",
    author: "Chris M.",
    likes: 67,
    badge: null,
  },
];

const badges = [
  { icon: "🏕️", label: "First Camp" },
  { icon: "🔥", label: "7-Day Streak" },
  { icon: "⭐", label: "Top Creator" },
  { icon: "🎯", label: "Challenge Master" },
  { icon: "💎", label: "Diamond Design" },
  { icon: "🌟", label: "Community Star" },
];

const CampfireCommunity = () => {
  return (
    <section id="community" className="section-padding bg-secondary/30">
      <div className="container">
        <div className="text-center mb-12">
          <div className="camp-badge mb-4">
            <Flame className="w-4 h-4" />
            Campfire Community
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-4">
            Gather Around the Campfire
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Connect with fellow designers, share your work, and get inspired by the community
          </p>
        </div>

        {/* Submissions Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="camp-card group hover:shadow-camp-lg transition-all duration-300"
            >
              {/* Placeholder for submission preview */}
              <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-xl mb-4 flex items-center justify-center">
                <span className="text-4xl opacity-50">🎨</span>
              </div>
              
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {submission.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">by {submission.author}</p>
                </div>
                {submission.badge && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {submission.badge}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Heart className="w-4 h-4" />
                  {submission.likes}
                </button>
                <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  Comment
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Badge Icons */}
        <div className="bg-card rounded-3xl p-8 mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Award className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Earn Camp Badges</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {badges.map((badge) => (
              <div
                key={badge.label}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <span className="text-3xl">{badge.icon}</span>
                <span className="text-xs font-medium text-muted-foreground">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="camp" size="xl">
            <Users className="w-5 h-5" />
            Join the Campfire Chat
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CampfireCommunity;
