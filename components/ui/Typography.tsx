import { createElement } from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'small';
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  h1: 'text-[65px] font-orbitron font-black leading-[61px] uppercase',
  h2: 'text-[36px] font-orbitron font-extrabold leading-none uppercase',
  h3: 'text-[24px] font-orbitron font-bold leading-tight uppercase',
  h4: 'text-[20px] font-orbitron font-bold leading-snug uppercase',
  body: 'text-base leading-relaxed',
  small: 'text-sm leading-normal',
};

export const Typography = ({ 
  variant = 'body', 
  as,
  children, 
  className 
}: TypographyProps) => {
  const element = as || (variant.startsWith('h') ? variant : 'p');
  
  return createElement(
    element,
    {
      className: cn(variantStyles[variant], className),
    },
    children
  );
};