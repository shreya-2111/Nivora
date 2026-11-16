import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'emerald' | 'amber' | 'slate' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'gold',
  size = 'sm',
  className = '',
}: BadgeProps) {
  const variantStyles = {
    gold: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    amber: 'bg-amber-400/15 text-amber-200 border-amber-400/40',
    slate: 'bg-slate-800/80 text-slate-300 border-slate-700',
    outline: 'bg-transparent text-slate-300 border-slate-700/60',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 font-medium',
    md: 'text-xs px-3 py-1 font-semibold tracking-wide',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border backdrop-blur-xs transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}
