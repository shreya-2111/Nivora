'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock, Plus, Sparkles } from 'lucide-react';
import { FeaturedDish } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface FeaturedDishCardProps {
  dish: FeaturedDish;
}

export function FeaturedDishCard({ dish }: FeaturedDishCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 transition-all duration-300 hover:border-slate-700 hover:bg-slate-900 hover:shadow-xl">
      {/* Dish Image Container */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-950">
        <Image
          src={dish.image}
          alt={dish.name}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {dish.tag && (
            <Badge variant="gold" size="sm">
              <Sparkles className="h-3 w-3" />
              {dish.tag}
            </Badge>
          )}
          {dish.isVegetarian && (
            <span className="rounded-full bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
              VEG
            </span>
          )}
        </div>

        {/* Prep time chip */}
        <div className="absolute bottom-2.5 right-3 flex items-center gap-1 rounded-full bg-slate-950/80 px-2.5 py-0.5 text-[11px] text-slate-300 border border-slate-800">
          <Clock className="h-3 w-3 text-amber-400" />
          <span>{dish.prepTime}</span>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-slate-100 group-hover:text-amber-200 transition-colors">
              {dish.name}
            </h4>
          </div>
          <p className="line-clamp-2 text-xs text-slate-400 leading-relaxed">
            {dish.description}
          </p>
        </div>

        {/* Bottom: Price & Quick Action */}
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/80">
          <div>
            <span className="text-xs text-slate-400">Price</span>
            <p className="text-base font-bold text-amber-300">
              ${dish.price.toFixed(2)}
            </p>
          </div>

          <Link
            href="/guest/menu"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 transition-all hover:bg-amber-500 hover:text-slate-950 hover:shadow-md hover:shadow-amber-500/20 active:scale-95"
            aria-label={`View ${dish.name} on menu`}
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
