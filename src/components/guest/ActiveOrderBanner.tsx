'use client';

import React from 'react';
import Link from 'next/link';
import { ChefHat, ArrowRight, Clock } from 'lucide-react';
import { ActiveOrder } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface ActiveOrderBannerProps {
  order: ActiveOrder;
}

export function ActiveOrderBanner({ order }: ActiveOrderBannerProps) {
  const itemNames = order.items.map((i) => i.name).join(', ');

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-slate-900/90 to-slate-900/90 p-4 sm:p-5 shadow-lg shadow-amber-950/20 backdrop-blur-md">
      {/* Decorative luxury glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-amber-500/10 blur-2xl" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left Side: Order info */}
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-400">
            <ChefHat className="h-5 w-5" />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Active Order
              </span>
              <span className="text-xs font-bold text-slate-300">
                {order.orderNumber}
              </span>
              <Badge variant="amber" size="sm">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
                Preparing in Kitchen
              </Badge>
            </div>

            <p className="line-clamp-1 text-sm text-slate-300">
              {itemNames}
            </p>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-amber-300/90">
                <Clock className="h-3.5 w-3.5" />
                Est. {order.estimatedDeliveryMinutes} mins
              </span>
              <span>•</span>
              <span>Placed at {order.placedAt}</span>
              <span>•</span>
              <span className="font-medium text-slate-200">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Track Action */}
        <div className="sm:self-center">
          <Link
            href="/guest/orders"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-amber-400 active:scale-98 shadow-sm shadow-amber-500/20"
          >
            <span>Track Order</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
