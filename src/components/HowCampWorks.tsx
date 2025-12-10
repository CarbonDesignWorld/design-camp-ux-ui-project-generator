import { Tent, Gauge, Pencil } from "lucide-react";

const steps = [
  {
    icon: Tent,
    title: "Pick a Camp Activity",
    description: "Choose between Daily Challenges or the Project Generator",
    badge: "Step 1",
  },
  {
    icon: Gauge,
    title: "Choose Your Level",
    description: "Select Beginner, Intermediate, or Advanced difficulty",
    badge: "Step 2",
  },
  {
    icon: Pencil,
    title: "Start Creating",
    description: "Get your prompt and begin designing your masterpiece",
    badge: "Step 3",
  },
];

const HowCampWorks = () => {
  return (
    <section id="how-it-works" className="section-padding bg-card">
      <div className="container">
        <div className="text-center mb-12">
          <span className="camp-badge mb-4">How It Works</span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-4">
            Your Camp Journey
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Getting started is as easy as pitching a tent
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
              )}
              
              {/* Badge icon container */}
              <div className="relative inline-flex">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-4 border-primary/20 shadow-camp">
                  <step.icon className="w-12 h-12 text-primary" />
                </div>
                {/* Step badge */}
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-camp">
                  {step.badge}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-foreground mt-6 mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowCampWorks;
