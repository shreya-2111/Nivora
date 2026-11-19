'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, CheckCircle2, ArrowRight } from 'lucide-react';
import { MenuItem, GuestProfile } from '@/types';
import { useNivora } from '@/context/NivoraContext';

export interface CartItemEntry {
  item: MenuItem;
  quantity: number;
  instructions?: string;
  optionIds?: string[];
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItemEntry[];
  guest: GuestProfile;
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onClearCart: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  guest,
  onUpdateQuantity,
  onClearCart,
}: CartDrawerProps) {
  const { placeOrder } = useNivora();
  const [deliveryNote, setDeliveryNote] = useState('');
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState<string | null>(null);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Convert to INR (₹) matching Screen 3
  const subtotalInr = Math.round(cartItems.reduce((total, entry) => {
    const optionTotal = entry.item.options
      ?.filter((option) => entry.optionIds?.includes(option.id))
      .reduce((sum, option) => sum + option.price, 0) || 0;
    return total + (entry.item.price + optionTotal) * entry.quantity * 85;
  }, 0));
  const taxInr = Math.round(subtotalInr * 0.05); // 5% GST
  const totalInr = subtotalInr + taxInr;

  const handlePlaceOrder = async () => {
    setSubmissionError(null);
    setIsSubmitting(true);
    try {
      const created = await placeOrder(deliveryNote);
      setConfirmedOrderNumber(created.orderNumber);
      setConfirmedOrderId(created.id);
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : 'Unable to place your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setConfirmedOrderNumber(null);
    setConfirmedOrderId(null);
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative flex h-full w-full max-w-md flex-col bg-[#FAF8F5] border-l border-[#EFE9DF] shadow-2xl animate-in slide-in-from-right duration-300 text-[#221B14]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EFE9DF] p-4 sm:p-5 bg-white">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#201A15]">Your Dining Tray</h2>
            <div className="flex items-center gap-1.5 text-xs text-[#85653C] font-semibold mt-0.5">
              <span>Room {guest.roomNumber}</span>
              <span>•</span>
              <span>Villa Del Mar Delivery</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F6F2EC] text-[#554C42] hover:bg-[#EAE2D7] transition cursor-pointer"
            aria-label="Close cart"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        {confirmedOrderNumber ? (
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#85653C]">
                Order Confirmed
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#201A15]">{confirmedOrderNumber}</h3>
              <p className="text-xs text-[#665E55]">
                Sent directly to the kitchen. Hot preparation underway for Room {guest.roomNumber}.
              </p>
            </div>

            <div className="rounded-2xl border border-[#EFE9DF] bg-white p-4 w-full text-xs text-[#554C42] text-left space-y-2 shadow-2xs">
              <div className="flex justify-between">
                <span className="text-[#887E72]">Estimated Delivery:</span>
                <strong className="text-[#85653C]">~25-35 mins</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#887E72]">Billed to:</span>
                <span className="text-[#201A15] font-semibold">Room Folio #{guest.roomNumber}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full pt-2">
              <Link
                href={`/guest/orders?id=${encodeURIComponent(confirmedOrderId || '')}&room=${encodeURIComponent(guest.roomNumber)}`}
                onClick={handleResetAndClose}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#85653C] hover:bg-[#684E2D] py-3 text-xs font-bold text-white shadow-xs transition"
              >
                <span>Track Live Order Status</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full rounded-xl border border-[#EFE9DF] bg-white py-2.5 text-xs font-semibold text-[#554C42] hover:bg-[#F6F2EC] transition"
              >
                Back to Food Menu
              </button>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center space-y-2 text-[#7B7166]">
            <p className="font-serif text-base font-bold text-[#201A15]">Your tray is empty</p>
            <p className="text-xs">Select delicious gourmet dishes or cocktails from the food menu.</p>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cartItems.map(({ item, quantity, instructions, optionIds }) => {
                const optionsTotal = item.options
                  ?.filter((option) => optionIds?.includes(option.id))
                  .reduce((sum, option) => sum + option.price, 0) || 0;
                return (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3 rounded-2xl border border-[#EFE9DF] bg-white p-3.5 shadow-2xs"
                >
                  <div className="space-y-1 flex-1">
                    <h4 className="font-serif text-sm font-bold text-[#201A15]">
                      {item.name}
                    </h4>
                    <p className="text-xs font-bold text-[#85653C]">
                      ₹{((item.price + optionsTotal) * quantity * 85).toLocaleString('en-IN')}
                    </p>
                    {instructions && (
                      <p className="text-[11px] italic text-[#887E72]">
                        &quot;{instructions}&quot;
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 rounded-xl bg-[#FAF8F5] border border-[#EFE9DF] p-1">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, quantity - 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-lg bg-white text-[#554C42] hover:bg-[#EAE2D7] transition shadow-2xs"
                      aria-label="Decrease quantity"
                    >
                      {quantity === 1 ? (
                        <Trash2 className="h-3 w-3 text-rose-500" />
                      ) : (
                        <Minus className="h-3 w-3" />
                      )}
                    </button>
                    <span className="w-4 text-center text-xs font-bold text-[#201A15]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-lg bg-white text-[#554C42] hover:bg-[#EAE2D7] transition shadow-2xs"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                );
              })}

              {/* Delivery Instruction Input */}
              <div className="pt-2">
                <label
                  htmlFor="cart-delivery-notes"
                  className="block text-[11px] font-bold uppercase tracking-wider text-[#7B7166] mb-1.5"
                >
                  Special Notes for Server
                </label>
                <input
                  id="cart-delivery-notes"
                  type="text"
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  placeholder="e.g. Ring bell twice, leave outside suite, extra flutes..."
                  className="w-full rounded-xl border border-[#EFE9DF] bg-white px-3 py-2.5 text-xs text-[#201A15] placeholder-[#887E72] focus:border-[#85653C] focus:outline-hidden"
                />
              </div>
            </div>

            {/* Calculations & Order Button */}
            <div className="border-t border-[#EFE9DF] bg-white p-4 sm:p-5 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#7B7166]">
                  <span>Subtotal</span>
                  <span className="text-[#201A15] font-semibold">₹{subtotalInr.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#7B7166]">
                  <span>In-Room White Glove Delivery</span>
                  <span className="text-emerald-700 font-bold">Complimentary</span>
                </div>
                <div className="flex justify-between text-[#7B7166]">
                  <span>Estimated Taxes &amp; Fees (5%)</span>
                  <span className="text-[#201A15]">₹{taxInr.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#F2ECE3] text-sm font-bold text-[#201A15]">
                  <span>Total Due</span>
                  <span className="text-[#85653C] font-serif text-lg">₹{totalInr.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#85653C] hover:bg-[#684E2D] py-3 text-xs font-bold text-white shadow-md transition active:scale-98 cursor-pointer disabled:opacity-60 disabled:cursor-wait"
              >
                <span>{isSubmitting ? 'Sending Order...' : 'Place In-Room Dining Order'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              {submissionError && (
                <p role="alert" className="text-center text-xs text-rose-700">{submissionError}</p>
              )}

              <p className="text-center text-[10px] text-[#8C847B]">
                Billed directly to Room {guest.roomNumber} folio upon delivery.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
