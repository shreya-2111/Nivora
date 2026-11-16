'use client';

import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';

interface CartBarProps {
  itemCount: number;
  totalAmount: number;
  onOpenCart: () => void;
}

export function CartBar({ itemCount, totalAmount, onOpenCart }: CartBarProps) {
  if (itemCount === 0) return null;

  return (
    <aside
      aria-label="Current order summary"
      className="fixed bottom-20 sm:bottom-6 left-0 right-0 z-40 px-4 pointer-events-none"
    >
      <div className="mx-auto max-w-lg pointer-events-auto">
        <button
          type="button"
          onClick={onOpenCart}
          className="group flex w-full items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 p-1 text-slate-950 shadow-xl shadow-amber-500/25 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.99]"
        >
          <div className="flex items-center gap-3 px-3.5 py-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-amber-400">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-900">
                {itemCount} {itemCount === 1 ? 'Item' : 'Items'} Selected
              </p>
              <p className="text-xs font-semibold text-slate-950/80">
                Subtotal: ${totalAmount.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl bg-slate-950 px-4 py-2 text-xs font-bold text-amber-300 transition-colors group-hover:bg-slate-900">
            <span>Review Order</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </button>
      </div>
    </aside>
  );
}
