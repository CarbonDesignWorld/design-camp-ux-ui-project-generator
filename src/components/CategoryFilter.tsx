import { cn } from "@/lib/utils";
import { Layers, MousePointer2, Layout, Palette, Box } from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: "all", label: "All Projects", icon: Box },
  { id: "micro", label: "Micro-Interactions", icon: MousePointer2 },
  { id: "landing", label: "Landing Pages", icon: Layout },
  { id: "ux", label: "UX Case Studies", icon: Layers },
  { id: "visual", label: "Visual Design", icon: Palette },
];

const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {categories.map((category) => {
        const Icon = category.icon;
        const isSelected = selectedCategory === category.id;
        
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300",
              isSelected
                ? "gradient-primary text-primary-foreground shadow-glow"
                : "glass text-muted-foreground hover:text-foreground hover:border-primary/30"
            )}
          >
            <Icon className="w-4 h-4" />
            {category.label}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
