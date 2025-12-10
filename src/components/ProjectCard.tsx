import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Clock, Bookmark, ExternalLink } from "lucide-react";

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  timeEstimate: string;
  marketRelevance: number;
  skills: string[];
  trending: boolean;
  imageUrl?: string;
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

const difficultyColors = {
  Beginner: "success",
  Intermediate: "default",
  Advanced: "accent",
} as const;

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  return (
    <div 
      className="group relative rounded-2xl overflow-hidden gradient-card border border-border/50 shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all duration-500 animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Image placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-secondary to-muted overflow-hidden">
        {project.imageUrl ? (
          <img 
            src={project.imageUrl} 
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-24 h-24 rounded-2xl gradient-primary opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
          </div>
        )}
        
        {/* Trending badge */}
        {project.trending && (
          <div className="absolute top-4 left-4">
            <Badge variant="glow" className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Trending
            </Badge>
          </div>
        )}

        {/* Bookmark button */}
        <button className="absolute top-4 right-4 p-2 rounded-lg glass opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary/20">
          <Bookmark className="w-4 h-4 text-foreground" />
        </button>

        {/* Market relevance indicator */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-lg glass">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-4 rounded-full transition-colors ${
                  i < project.marketRelevance 
                    ? "bg-primary" 
                    : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">Market Fit</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category & Difficulty */}
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">{project.category}</Badge>
          <Badge variant={difficultyColors[project.difficulty]}>{project.difficulty}</Badge>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.skills.slice(0, 3).map((skill) => (
            <span 
              key={skill}
              className="px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground"
            >
              {skill}
            </span>
          ))}
          {project.skills.length > 3 && (
            <span className="px-2 py-1 text-xs rounded-md bg-secondary text-muted-foreground">
              +{project.skills.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {project.timeEstimate}
          </div>
          <Button variant="ghost" size="sm" className="gap-1">
            View Details
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
