'use client';

import React from 'react';
import Link from 'next/link';
import {
  UtensilsCrossed,
  Sparkles,
  BellRing,
  Flower2,
  Building2,
  Headset,
  ChevronRight,
  LucideIcon,
} from 'lucide-react';
import { ServiceCategory } from '@/types';
import { Badge } from '@/components/ui/Badge';

const ICON_MAP: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Sparkles,
  BellRing,
  Flower2,
  Building2,
  Headset,
};

interface ServiceCategoryCardProps {
  category: ServiceCategory;
  onSelect?: (categoryTitle: string) => void;
}

export function ServiceCategoryCard({ category, onSelect }: ServiceCategoryCardProps) {
  const IconComponent = ICON_MAP[category.iconName] || UtensilsCrossed;
  const isFeatured = category.featured;

  const handleClick = (e: React.MouseEvent) => {
    if (category.href.startsWith('#') && onSelect) {
      e.preventDefault();
      onSelect(category.title);
    }
  };

  return (
    <Link
      href={category.href}
      onClick={handleClick}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl p-5 transition-all duration-300 text-left ${
        isFeatured
          ? 'border-2 border-amber-500/50 bg-gradient-to-br from-amber-950/40 via-slate-900/90 to-slate-900/95 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/10'
          : 'border border-slate-800/80 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90 hover:shadow-lg'
      }`}
    >
      {/* Top Section: Icon & Badge */}
      <div className="flex items-start justify-between gap-2">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 ${
            isFeatured
              ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-md shadow-amber-500/30'
              : 'border border-slate-700/60 bg-slate-800/80 text-amber-300'
          }`}
        >
          <IconComponent className="h-6 w-6 stroke-[1.8]" />
        </div>

        {category.badge && (
          <Badge variant={isFeatured ? 'gold' : 'slate'} size="sm">
            {category.badge}
          </Badge>
        )}
      </div>

      {/* Content Section */}
      <div className="mt-5 space-y-1">
        <div className="flex items-center justify-between">
          <h3
            className={`font-semibold tracking-wide transition-colors ${
              isFeatured
                ? 'text-lg text-amber-100 group-hover:text-amber-300'
                : 'text-base text-slate-100 group-hover:text-white'
            }`}
          >
            {category.title}
          </h3>
          <ChevronRight
            className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${
              isFeatured ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'
            }`}
          />
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          {category.subtitle}
        </p>
      </div>

      {isFeatured && (
        <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between text-xs font-semibold text-amber-300">
          <span>Explore Dining Menu</span>
          <span className="text-[11px] font-normal text-amber-400/80">Full Kitchen Open</span>
        </div>
      )}
    </Link>
  );
}
