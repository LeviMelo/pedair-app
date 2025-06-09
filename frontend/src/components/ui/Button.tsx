// src/components/ui/Button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { PiSpinnerGap } from 'react-icons/pi';
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-primary-foreground hover:from-blue-600/90 hover:to-indigo-600/90 shadow-md",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        // FIX: Re-aliasing 'danger' to 'destructive' for backward compatibility
        danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90", 
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        // FIX: Re-adding specific outline variants
        "outline-primary": "border border-primary text-primary bg-background hover:bg-primary hover:text-primary-foreground",
        "outline-slate": "border border-slate-300 dark:border-slate-700 bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-emerald-600 text-primary-foreground hover:bg-emerald-600/90",
        warning: "bg-amber-500 text-primary-foreground hover:bg-amber-500/90"
      },
      size: {
        default: "h-10 px-4 py-2",
        // FIX: Re-aliasing 'md' to 'default'
        md: "h-10 px-4 py-2", 
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

interface IconProps {
  size?: string | number;
  className?: string;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  iconLeft?: React.ReactElement<IconProps>;
  iconRight?: React.ReactElement<IconProps>;
  fullWidth?: boolean; // FIX: Re-adding fullWidth prop
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, iconLeft, iconRight, fullWidth, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    const iconSize = size === 'sm' ? 16 : 18;
    const iconMarginClass = children ? (size === 'sm' ? 'mr-1.5' : 'mr-2') : '';
    const iconMarginClassRight = children ? (size === 'sm' ? 'ml-1.5' : 'ml-2') : '';
    
    return (
      <Comp
        // FIX: Conditionally add 'w-full' class if fullWidth is true
        className={cn(buttonVariants({ variant, size, className }), { "w-full": fullWidth })}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <PiSpinnerGap className={`animate-spin ${iconMarginClass}`} size={iconSize} />}
        {!isLoading && iconLeft && React.cloneElement(iconLeft, { size: iconLeft.props.size || iconSize, className: cn(iconMarginClass, iconLeft.props.className) })}
        {children}
        {!isLoading && iconRight && React.cloneElement(iconRight, { size: iconRight.props.size || iconSize, className: cn(iconMarginClassRight, iconRight.props.className) })}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }