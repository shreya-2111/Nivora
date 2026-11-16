'use client';

import React from 'react';
import Image from 'next/image';
import { Clock, Plus, Minus, Sparkles, Flame, Leaf, WheatOff } from 'lucide-react';
import { MenuItem } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface MenuItemCardProps {
  item: MenuItem;
  quantityInCart: number;
  onAddToCart: (item: MenuItem) => void;
  onRemoveFromCart: (item: MenuItem) => void;
  onOpenDetails: (item: MenuItem) => void;
}

export function MenuItemCard({
  item,
  quantityInCart,
  onAddToCart,
  onRemoveFromCart,
  onOpenDetails,
}: MenuItemCardProps) {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 transition-all duration-300 hover:border-slate-700 hover:bg-slate-900/90 hover:shadow-xl">
      {/* Clickable Image & Header */}
      <div
        onClick={() => onOpenDetails(item)}
        className="relative h-44 w-full cursor-pointer overflow-hidden bg-slate-950 sm:h-48"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Dietary / Highlight Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {item.tag && (
            <Badge variant="gold" size="sm">
              <Sparkles className="h-3 w-3" />
              {item.tag}
            </Badge>
          )}
          {item.isVegetarian && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 backdrop-blur-xs">
              <Leaf className="h-2.5 w-2.5" />
              VEG
            </span>
          )}
          {item.isGlutenFree && (
            <span className="flex items-center gap-1 rounded-full bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 text-[10px] font-semibold text-amber-300 backdrop-blur-xs">
              <WheatOff className="h-2.5 w-2.5" />
              GF
            </span>
          )}
          {item.isSpicy && (
            <span className="flex items-center gap-1 rounded-full bg-rose-950/80 border border-rose-500/40 px-2 py-0.5 text-[10px] font-semibold text-rose-300 backdrop-blur-xs">
              <Flame className="h-2.5 w-2.5" />
              SPICY
            </span>
          )}
        </div>

        {/* Prep Time Chip */}
        <div className="absolute bottom-2.5 right-3 flex items-center gap-1 rounded-full bg-slate-950/80 px-2.5 py-0.5 text-[11px] text-slate-300 border border-slate-800">
          <Clock className="h-3 w-3 text-amber-400" />
          <span>{item.prepTime}</span>
        </div>
      </div>

      {/* Details Container */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div
          onClick={() => onOpenDetails(item)}
          className="cursor-pointer space-y-1.5"
        >
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-100 group-hover:text-amber-200 transition-colors">
              {item.name}
            </h3>
            {item.calories && (
              <span className="shrink-0 text-[11px] text-slate-500">
                {item.calories}
              </span>
            )}
          </div>
          <p className="line-clamp-2 text-xs text-slate-400 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Bottom Bar: Price & Interactive Stepper */}
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/80">
          <div>
            <span className="text-[11px] text-slate-400">Price</span>
            <p className="text-base font-bold text-amber-300">
              ${item.price.toFixed(2)}
            </p>
          </div>

          {quantityInCart === 0 ? (
            <button
              type="button"
              onClick={() => onAddToCart(item)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 text-xs font-semibold text-amber-300 transition-all hover:bg-amber-500 hover:text-slate-950 active:scale-95 shadow-xs"
            >
              <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Add</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-xl bg-slate-950 border border-amber-500/40 p-1 shadow-inner">
              <button
                type="button"
                onClick={() => onRemoveFromCart(item)}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white active:scale-90"
                aria-label={`Decrease ${item.name}`}
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-5 text-center text-xs font-bold text-amber-300">
                {quantityInCart}
              </span>
              <button
                type="button"
                onClick={() => onAddToCart(item)}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 active:scale-90"
                aria-label={`Increase ${item.name}`}
              >
                <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
