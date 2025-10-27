import React from 'react';
import { cn } from '@/lib/utils/helpers';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
};

export default function LoadingSpinner({ className, size = 'md' }: LoadingSpinnerProps) {
  return (
    <div className={cn(
      'animate-spin rounded-full border-b-2 border-brand-green',
      sizeClasses[size],
      className
    )} />
  );
}
