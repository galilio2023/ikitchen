"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const cyberButtonVariants = cva(
  "relative inline-flex items-center justify-center w-full sm:w-auto px-8 py-3 overflow-hidden font-black uppercase tracking-widest text-sm transition-all duration-300 ease-in-out group",
  {
    variants: {
      variant: {
        glow: "bg-magic-purple text-primary-foreground shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]",
        outline:
          "bg-transparent border border-foreground/20 text-foreground/40 hover:text-foreground hover:border-foreground/40",
        icon: "bg-transparent border border-foreground/20 text-foreground/60 hover:text-primary hover:border-primary/60",
      },
      size: {
        sm: "px-6 py-2 text-xs",
        md: "px-8 py-3 text-sm",
        lg: "px-10 py-4 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "glow",
      size: "md",
    },
  }
);

export interface CyberButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof cyberButtonVariants> {
  icon?: React.ReactNode;
}

const CyberButton = React.forwardRef<HTMLButtonElement, CyberButtonProps>(
  ({ className, variant, size, icon, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          cyberButtonVariants({ variant, size, className }),
          "rounded-xl"
        )}
        ref={ref}
        {...props}
      >
        {/* Animated background for glow variant */}
        {variant === "glow" && (
          <div className="absolute inset-0 w-full h-full bg-magic-purple opacity-80 group-hover:opacity-100 transition-opacity" />
        )}

        {/* Animated border for outline and icon variants */}
        {(variant === "outline" || variant === "icon") && (
          <>
            <span className="absolute top-0 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
            <span className="absolute top-0 right-0 w-px h-0 bg-foreground transition-all duration-300 group-hover:h-full" />
            <span className="absolute bottom-0 right-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
            <span className="absolute bottom-0 left-0 w-px h-0 bg-foreground transition-all duration-300 group-hover:h-full" />
          </>
        )}

        <div className="relative flex items-center justify-center gap-2">
          {icon}
          {children}
        </div>
      </button>
    );
  }
);

CyberButton.displayName = "CyberButton";

export { CyberButton, cyberButtonVariants };
