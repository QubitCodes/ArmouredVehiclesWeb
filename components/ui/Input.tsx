'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, icon, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          className={cn(
            "w-full px-4 border border-[#000000] focus:outline-none placeholder-[#6E6E6E] placeholder-opacity-100",
            error && "border-red-500",
            icon && "pr-12",
            className
          )}
          ref={ref}
          {...props}
        />
        {icon && (
          <div className="absolute right-0 top-0 h-full w-[50px] flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };