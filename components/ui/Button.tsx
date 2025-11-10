'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center transition-colors font-orbitron font-black leading-none uppercase tracking-normal',
  {
    variants: {
      variant: {
        default: 'bg-[#D35400] text-white hover:bg-[#BF360C]',
        white: 'bg-white text-[#D35400] hover:bg-white/90',
        dark: 'bg-[#39482C] text-white hover:bg-[#2C3922]',
        outline: 'border border-[#000000] hover:bg-gray-50',
      },
      size: {
        default: 'h-[47px] px-6',
        sm: 'h-10 px-4',
        lg: 'h-[60px] px-8',
      },
      clipPath: {
        none: '',
        supplier: 'clip-path-supplier',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      clipPath: 'none',
    },
  }
);

interface ButtonProps 
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, clipPath, fullWidth, ...props }, ref) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, clipPath }),
          fullWidth && 'w-full',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };