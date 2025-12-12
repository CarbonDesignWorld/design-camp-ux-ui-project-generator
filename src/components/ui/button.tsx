import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap text-sm font-bold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground rounded-xl shadow-soft hover:shadow-medium hover:-translate-y-0.5",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl",
        outline: "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground rounded-xl",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-dark rounded-xl shadow-soft hover:shadow-medium hover:-translate-y-0.5",
        ghost: "hover:bg-muted hover:text-foreground rounded-lg",
        link: "text-primary underline-offset-4 hover:underline",
        camp: "bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground rounded-xl shadow-medium hover:shadow-camp-lg hover:-translate-y-1 active:translate-y-0",
        pine: "bg-secondary text-secondary-foreground hover:bg-secondary-dark rounded-xl shadow-medium hover:shadow-camp-lg hover:-translate-y-1",
        golden: "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground rounded-xl shadow-medium hover:shadow-camp-lg hover:-translate-y-1",
        sky: "bg-info text-info-foreground hover:bg-info/90 rounded-xl shadow-medium hover:shadow-camp-lg hover:-translate-y-1",
        success: "bg-success text-success-foreground hover:bg-success/90 rounded-xl shadow-soft hover:shadow-medium",
      },
      size: {
        default: "h-10 sm:h-11 px-4 sm:px-6 py-2 text-sm",
        sm: "h-9 px-3 sm:px-4 text-xs sm:text-sm",
        lg: "h-11 sm:h-12 px-5 sm:px-8 text-sm sm:text-base",
        xl: "h-12 sm:h-14 px-6 sm:px-10 text-sm sm:text-lg rounded-xl sm:rounded-2xl",
        icon: "h-9 w-9 sm:h-10 sm:w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };