import { Calendar, Briefcase, Users } from "lucide-react";

const benefits = [
  {
    icon: Calendar,
    title: "Practice Every Day",
    description: "Build a consistent design habit with fresh daily challenges that keep your skills sharp.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Briefcase,
    title: "Build Your Portfolio",
    description: "Create impressive portfolio pieces that showcase your range and attract dream opportunities.",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: Users,
    title: "Join 10k+ Campers",
    description: "Connect with a supportive community of designers who share, inspire, and grow together.",
    color: "bg-accent/10 text-accent",
  },
];

const WhyJoinCamp = () => {
  return (
    <section className="section-padding bg-muted">
      <div className="container">
        <div className="text-center mb-12">
          <span className="camp-badge mb-4">Benefits</span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-4">
            Why Join Design Camp?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="camp-card text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${benefit.color} mb-6`}>
                <benefit.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyJoinCamp;
