import React from 'react';
import { PiSpinnerGap } from 'react-icons/pi'; // Using a spinner icon

type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'danger' 
  | 'warning' 
  | 'outline-primary' 
  | 'outline-slate' 
  | 'ghost' 
  | 'link';

type ButtonSize = 'sm' | 'md' | 'lg';

// Define an interface for icon props that we expect (className and size)
interface IconProps {
  className?: string;
  size?: string | number;
  // Add other common icon props if necessary
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  iconLeft?: React.ReactElement<IconProps>; // Specify that iconLeft/Right accept IconProps
  iconRight?: React.ReactElement<IconProps>;
  fullWidth?: boolean;
  children: React.ReactNode;
  asChild?: boolean; // Add asChild prop
}

const Button: React.FC<ButtonProps> = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      iconLeft,
      iconRight,
      fullWidth = false,
      asChild = false, // Default asChild to false
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'btn'; // From index.css
    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      success: 'btn-success',
      danger: 'btn-danger',
      warning: 'btn-warning',
      'outline-primary': 'btn-outline-primary',
      'outline-slate': 'btn-outline-slate',
      ghost: 'btn-ghost',
      link: 'btn-link',
    };
    const sizeClasses = {
      sm: 'btn-sm',
      md: '', // Base .btn already has medium padding
      lg: 'btn-lg',
    };

    const combinedClassName = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      fullWidth ? 'w-full' : '',
      isLoading ? 'cursor-wait' : '',
      className, // Allow additional custom classes
    ].filter(Boolean).join(' ');

    const iconSize = size === 'sm' ? 16 : 18;
    const iconMarginClass = children && size === 'sm' ? 'mr-1.5' : children ? 'mr-2' : '';
    const iconMarginClassRight = children && size === 'sm' ? 'ml-1.5' : children ? 'ml-2' : '';

    const buttonContent = (
      <>
        {isLoading && (
          <PiSpinnerGap className={`animate-spin ${iconLeft || iconRight || children ? (size === 'sm' ? 'mr-1.5' : 'mr-2') : ''}`} size={size === 'sm' ? 16 : 20} />
        )}
        {!isLoading && iconLeft && React.cloneElement(iconLeft, {
           className: `${iconMarginClass} ${iconLeft.props.className || ''}`.trim(),
           size: iconLeft.props.size || iconSize 
        })}
        {!isLoading && children}
        {!isLoading && iconRight && React.cloneElement(iconRight, {
            className: `${iconMarginClassRight} ${iconRight.props.className || ''}`.trim(),
            size: iconRight.props.size || iconSize
        })}
      </>
    );

    if (asChild && React.isValidElement<React.HTMLAttributes<HTMLElement>>(children)) {
      // Type assertion for children to ensure props like className are recognized.
      const childProps = children.props as React.HTMLAttributes<HTMLElement>;

      return React.cloneElement(
        children as React.ReactElement<React.HTMLAttributes<HTMLElement>>,
        {
          className: `${combinedClassName} ${childProps.className || ''}`.trim(),
          // `disabled` is not a standard HTML attribute for all elements (e.g. `a` tag from Link).
          // Visual disabled state is handled by classes. True non-interactivity for Link
          // would require event.preventDefault() or not rendering it as a Link.
          // We pass other ...props which might include aria-disabled if set by parent.
          ...props, 
        }
      );
    }

    return (
      <button
        ref={ref}
        className={combinedClassName}
        disabled={disabled || isLoading}
        {...props}
      >
        {buttonContent}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button; 