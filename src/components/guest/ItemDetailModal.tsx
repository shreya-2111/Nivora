'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Clock, Flame, Leaf, WheatOff, Sparkles, Plus, Minus, MessageSquare } from 'lucide-react';
import { MenuItem } from '@/types';

interface ItemDetailModalProps {
  item: MenuItem | null;
  currentQuantity: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: MenuItem, quantity: number, instructions?: string) => void;
}

interface ItemDetailContentProps {
  item: MenuItem;
  currentQuantity: number;
  onClose: () => void;
  onSave: (item: MenuItem, quantity: number, instructions?: string) => void;
}

function ItemDetailContent({
  item,
  currentQuantity,
  onClose,
  onSave,
}: ItemDetailContentProps) {
  const [qty, setQty] = useState(currentQuantity > 0 ? currentQuantity : 1);
  const [instructions, setInstructions] = useState('');

  const totalAmountInr = Math.round(item.price * qty * 85).toLocaleString('en-IN');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-[#EFE9DF] bg-[#FAF8F5] shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col text-[#221B14]"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/25 text-white hover:bg-black/60 transition cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Hero Dish Image */}
        <div className="relative h-60 w-full shrink-0 overflow-hidden bg-[#F2EDE7]">
          <Image
            src={item.image}
            alt={item.name}
            fill
            unoptimized
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-transparent to-transparent" />

          {/* Badges on Image */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-md text-[#6E6357] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  item.isVegetarian ? 'bg-emerald-600' : 'bg-rose-600'
                }`}
              />
              <span>{item.isVegetarian ? 'VEG' : 'NON-VEG'}</span>
            </span>

            {item.tag && (
              <span className="inline-flex items-center gap-1 bg-[#85653C] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
                <Sparkles className="w-3 h-3" />
                {item.tag}
              </span>
            )}
          </div>
        </div>

        {/* Scrollable Dish Details */}
        <div className="flex-1 overflow-y-auto px-6 py-2 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-serif text-2xl font-bold text-[#201A15]">
                {item.name}
              </h3>
              <span className="font-serif text-xl font-bold text-[#85653C]">
                ₹{Math.round(item.price * 85).toLocaleString('en-IN')}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#7B7166] leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Prep Time & Dietary Info */}
          <div className="flex items-center gap-3 text-xs text-[#8A8074] pt-2 border-t border-[#EFE9DF]">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#85653C]" />
              <span>Prep: {item.prepTime}</span>
            </span>
            <span>•</span>
            <span>Course: {item.category}</span>
          </div>

          {/* Special Preparation Instructions */}
          <div className="pt-2">
            <label
              htmlFor="special-dish-instructions"
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7B7166] mb-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#85653C]" />
              <span>Special Chef Preparation Notes</span>
            </label>
            <textarea
              id="special-dish-instructions"
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Dressing on the side, well-done, allergy notes..."
              className="w-full rounded-2xl border border-[#EFE9DF] bg-white p-3 text-xs text-[#201A15] placeholder-[#9E958C] focus:border-[#85653C] focus:outline-hidden"
            />
          </div>
        </div>

        {/* Footer Actions: Quantity Stepper & Add to Tray */}
        <div className="border-t border-[#EFE9DF] bg-white p-4 sm:p-5 flex items-center justify-between gap-4">
          {/* Stepper */}
          <div className="flex items-center gap-3 bg-[#FAF8F5] border border-[#EFE9DF] rounded-2xl px-3 py-2">
            <button
              type="button"
              onClick={() => setQty((prev) => Math.max(1, prev - 1))}
              className="w-7 h-7 flex items-center justify-center rounded-xl bg-white text-[#554C42] hover:bg-[#EAE2D7] transition shadow-2xs cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-bold text-sm min-w-[20px] text-center">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((prev) => prev + 1)}
              className="w-7 h-7 flex items-center justify-center rounded-xl bg-white text-[#554C42] hover:bg-[#EAE2D7] transition shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Tray CTA */}
          <button
            type="button"
            onClick={() => onSave(item, qty, instructions)}
            className="flex-1 py-3 px-5 rounded-2xl bg-[#85653C] hover:bg-[#684E2D] text-white font-semibold text-xs sm:text-sm flex items-center justify-between shadow-md transition active:scale-98 cursor-pointer"
          >
            <span>Add to Dining Tray</span>
            <span className="font-bold">₹{totalAmountInr}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function ItemDetailModal({
  item,
  currentQuantity,
  isOpen,
  onClose,
  onSave,
}: ItemDetailModalProps) {
  if (!isOpen || !item) return null;

  return (
    <ItemDetailContent
      key={item.id}
      item={item}
      currentQuantity={currentQuantity}
      onClose={onClose}
      onSave={onSave}
    />
  );
}
