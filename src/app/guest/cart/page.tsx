'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ShoppingCart,
  X,
  Plus,
  Minus,
  UtensilsCrossed,
  Bed,
  Home,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useNivora } from '@/context/NivoraContext';
import { RoomServiceRequestModal } from '@/components/guest/RoomServiceRequestModal';

/* Custom SVG Icons for exact 1:1 match */
function ClocheIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 18h16" />
      <path d="M4 14a8 8 0 0 1 16 0" />
      <path d="M12 6v-2" />
      <circle cx="12" cy="4" r="1" fill="currentColor" />
    </svg>
  );
}

function ConciergeHandBellIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 17h6l2.5 2h5.5a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-4" />
      <path d="M14 6a4 4 0 0 0-8 0v2h8V6z" />
      <path d="M10 2v2" />
      <path d="M5 10h10" />
    </svg>
  );
}

function CartPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    guest,
    cartItems,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    placeOrder,
  } = useNivora();

  const queryRoom = searchParams.get('room');
  const roomUpper = queryRoom ? `ROOM ${queryRoom}` : '{ROOM_NUMBER}';
  const roomLower = queryRoom ? `Room ${queryRoom}` : '{room_number}';

  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState<string | null>(null);

  // Template toggle mode so reviewer can see literal mockup {variables} or live rich dish calculation
  const [isLiteralMockup, setIsLiteralMockup] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fallback demo items matching the screenshot if cart is empty
  const defaultDemoItems = useMemo(
    () => [
      {
        id: 'demo_1',
        name: '{food_name}',
        price: 850,
        options: '{options}',
        specialInstruction: '{special_instruction}',
        quantity: 1,
        image: '/overwater-dish.jpg',
      },
      {
        id: 'demo_2',
        name: '{food_name}',
        price: 1350,
        options: '{options}',
        quantity: 1,
        image:
          'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
      },
    ],
    []
  );

  // State for demo items if cartItems is empty
  const [demoList, setDemoList] = useState(defaultDemoItems);

  // Calculate live numbers
  const hasLiveItems = cartItems.length > 0;

  const subtotalInr = hasLiveItems
    ? Math.round(cartItems.reduce((acc, curr) => acc + curr.item.price * curr.quantity * 85, 0))
    : demoList.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

  const optionsTotalInr = hasLiveItems ? 250 : 250;
  const orderTotalInr = subtotalInr + optionsTotalInr;

  const handleClear = () => {
    if (hasLiveItems) {
      clearCart();
    } else {
      setDemoList([]);
    }
    showToast('Your tray has been cleared');
  };

  const handleUpdateDemoQty = (id: string, delta: number) => {
    setDemoList((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as typeof defaultDemoItems
    );
  };

  const handleRemoveDemoItem = (id: string) => {
    setDemoList((prev) => prev.filter((item) => item.id !== id));
  };

  const handlePlaceOrder = () => {
    let orderNum = '#NV-2895';
    if (hasLiveItems) {
      const created = placeOrder('Special instructions from Cart screen');
      orderNum = created.orderNumber;
      setConfirmedOrderNumber(created.orderNumber);
    } else {
      setConfirmedOrderNumber('#NV-2895');
    }
    showToast('Order confirmed! Sending to hotel kitchen...');
    setTimeout(() => {
      router.push(`/guest/confirmation?id=${encodeURIComponent(orderNum)}&room=${encodeURIComponent(guest?.roomNumber || '104')}`);
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] text-[#221B14] selection:bg-[#705535]/20 selection:text-[#221B14] pb-44 antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-full bg-[#2A231C] px-5 py-2.5 text-xs font-medium text-white shadow-xl flex items-center gap-2 border border-[#44382F] animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container - Responsive Full Width */}
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-6 space-y-5 sm:space-y-6">
        {/* Top Back Nav matching screenshot: ← Food Details • {ROOM_NUMBER} */}
        <div className="flex items-center gap-3 pt-1 pb-1">
          <Link
            href="/guest/menu"
            className="flex items-center gap-2 text-[#201A15] hover:text-[#705535] transition"
            aria-label="Back to Food Details / Menu"
          >
            <ArrowLeft className="w-5 h-5 text-[#201A15]" />
            <div>
              <span className="font-serif text-base sm:text-lg font-bold text-[#201A15] leading-none block">
                Food Details
              </span>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#6D6357] mt-0.5 leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
                <span>{roomUpper}</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Your Cart Header Row */}
        <header className="flex items-center justify-between pt-1 pb-1">
          {/* Title: Your Cart */}
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#201A15] tracking-tight">
            Your Cart
          </h1>

          {/* Center Pill: • ROOM \n {ROOM_NUMBER} */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F2EDE7] border border-[#E8E2D8] text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block shrink-0" />
            <div className="flex flex-col text-left leading-tight font-bold text-[#4F463D]">
              <span className="text-[9px] uppercase tracking-wider text-[#7A6F63]">ROOM</span>
              <span>{roomUpper}</span>
            </div>
          </div>

          {/* Right Action: Clear Cart */}
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#7A6F63] hover:text-[#201A15] transition cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 text-[#7A6F63] shrink-0" />
            <div className="flex flex-col leading-tight text-left">
              <span>Clear</span>
              <span>Cart</span>
            </div>
          </button>
        </header>

        {/* Delivery Destination Card */}
        <section className="bg-[#F6F1EB]/80 border border-[#EAE3D9] rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-2xs">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#EAE2D8] flex items-center justify-center text-[#705535] shrink-0">
            <ClocheIcon className="w-5 h-5 text-[#705535]" />
          </div>

          <div>
            <h2 className="font-bold text-sm sm:text-base text-[#201A15] leading-snug">
              Delivering to ROOM {roomLower}
            </h2>
            <p className="text-xs text-[#7B7166] mt-0.5 leading-snug">
              Estimated arrival ~25–35 mins
            </p>
          </div>
        </section>

        {/* Cart Items List */}
        <section className="space-y-3.5">
          {hasLiveItems
            ? cartItems.map(({ item, quantity, instructions }) => {
                const itemPriceInr = Math.round(item.price * 85);
                const itemTotalInr = itemPriceInr * quantity;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EFE9DF] shadow-2xs space-y-3 relative transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
                  >
                    {/* Top Row: Image, Name, Price, Options, Remove */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3.5 flex-1">
                        {/* Square Food Photo */}
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-[#F2EDE7] shadow-2xs">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="space-y-0.5 flex-1">
                          <h3 className="font-serif text-base sm:text-lg font-bold text-[#201A15] leading-snug">
                            {isLiteralMockup ? '{food_name}' : item.name}
                          </h3>
                          <p className="text-xs sm:text-sm font-bold text-[#705535]">
                            ₹{isLiteralMockup ? '{item_price}' : itemPriceInr.toLocaleString('en-IN')}
                          </p>

                          {/* Selected Options Badge */}
                          <div className="pt-1">
                            <span className="inline-block bg-[#F4EFEB] text-[#6E6357] text-[10px] sm:text-[11px] font-medium px-2.5 py-0.5 rounded-md">
                              {isLiteralMockup
                                ? 'Selected: {options}'
                                : instructions
                                ? `Selected: ${instructions.split('|')[0] || 'Standard'}`
                                : 'Selected: Standard Options'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button ✕ */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item)}
                        className="text-[#8C8276] hover:text-[#201A15] p-1 transition cursor-pointer"
                        aria-label="Remove item"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Special Instructions Note Banner */}
                    {instructions && (
                      <div className="bg-[#FDF0E2] border border-[#F6E3CF] rounded-xl px-3.5 py-2 flex items-center gap-2 text-xs text-[#7B532C]">
                        <UtensilsCrossed className="w-3.5 h-3.5 text-[#7B532C] shrink-0" />
                        <span className="truncate">
                          Note: {isLiteralMockup ? '{special_instruction}' : instructions}
                        </span>
                      </div>
                    )}

                    {/* Bottom Row: Stepper & TOTAL */}
                    <div className="flex items-center justify-between pt-1">
                      {/* Stepper */}
                      <div className="bg-[#F4EFEB] rounded-full px-3.5 py-1.5 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, quantity - 1)}
                          className="text-[#5A5046] font-bold text-sm hover:opacity-75 transition cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          —
                        </button>
                        <span className="text-xs font-bold text-[#201A15] min-w-[16px] text-center select-none">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, quantity + 1)}
                          className="text-[#5A5046] font-bold text-sm hover:opacity-75 transition cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Total */}
                      <div className="text-right">
                        <p className="text-[9px] uppercase tracking-wider font-bold text-[#8A8074] leading-none">
                          TOTAL
                        </p>
                        <p className="font-bold text-base sm:text-lg text-[#201A15] leading-tight mt-0.5">
                          ₹{isLiteralMockup ? '{item_total}' : itemTotalInr.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            : demoList.map((demoItem) => {
                const itemTotalInr = demoItem.price * demoItem.quantity;

                return (
                  <div
                    key={demoItem.id}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EFE9DF] shadow-2xs space-y-3 relative transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
                  >
                    {/* Top Row: Image, Name, Price, Options, Remove */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3.5 flex-1">
                        {/* Square Food Photo */}
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-[#F2EDE7] shadow-2xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={demoItem.image}
                            alt={demoItem.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="space-y-0.5 flex-1">
                          <h3 className="font-serif text-base sm:text-lg font-bold text-[#201A15] leading-snug">
                            {demoItem.name}
                          </h3>
                          <p className="text-xs sm:text-sm font-bold text-[#705535]">
                            ₹{isLiteralMockup ? '{item_price}' : demoItem.price.toLocaleString('en-IN')}
                          </p>

                          {/* Selected Options Badge */}
                          <div className="pt-1">
                            <span className="inline-block bg-[#F4EFEB] text-[#6E6357] text-[10px] sm:text-[11px] font-medium px-2.5 py-0.5 rounded-md">
                              Selected: {demoItem.options}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button ✕ */}
                      <button
                        type="button"
                        onClick={() => handleRemoveDemoItem(demoItem.id)}
                        className="text-[#8C8276] hover:text-[#201A15] p-1 transition cursor-pointer"
                        aria-label="Remove item"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Special Instructions Note Banner */}
                    {demoItem.specialInstruction && (
                      <div className="bg-[#FDF0E2] border border-[#F6E3CF] rounded-xl px-3.5 py-2 flex items-center gap-2 text-xs text-[#7B532C]">
                        <UtensilsCrossed className="w-3.5 h-3.5 text-[#7B532C] shrink-0" />
                        <span className="truncate">
                          Note: {demoItem.specialInstruction}
                        </span>
                      </div>
                    )}

                    {/* Bottom Row: Stepper & TOTAL */}
                    <div className="flex items-center justify-between pt-1">
                      {/* Stepper */}
                      <div className="bg-[#F4EFEB] rounded-full px-3.5 py-1.5 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleUpdateDemoQty(demoItem.id, -1)}
                          className="text-[#5A5046] font-bold text-sm hover:opacity-75 transition cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          —
                        </button>
                        <span className="text-xs font-bold text-[#201A15] min-w-[16px] text-center select-none">
                          {demoItem.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateDemoQty(demoItem.id, 1)}
                          className="text-[#5A5046] font-bold text-sm hover:opacity-75 transition cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Total */}
                      <div className="text-right">
                        <p className="text-[9px] uppercase tracking-wider font-bold text-[#8A8074] leading-none">
                          TOTAL
                        </p>
                        <p className="font-bold text-base sm:text-lg text-[#201A15] leading-tight mt-0.5">
                          ₹{isLiteralMockup ? '{item_total}' : itemTotalInr.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
        </section>

        {/* Order Summary Card */}
        <section className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EFE9DF] shadow-2xs space-y-3.5">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-[#201A15]">
            Order Summary
          </h2>

          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between items-center text-[#554C42]">
              <span>Subtotal</span>
              <span className="font-bold text-[#201A15]">
                ₹{isLiteralMockup ? '{subtotal}' : subtotalInr.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-between items-center text-[#554C42]">
              <span>Add-ons &amp; Options</span>
              <span className="font-bold text-[#201A15]">
                ₹{isLiteralMockup ? '{options_total}' : optionsTotalInr.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#F2ECE3] flex justify-between items-center">
            <span className="font-serif text-xl sm:text-2xl font-bold text-[#201A15]">
              Order Total
            </span>
            <span className="font-serif text-xl sm:text-2xl font-bold text-[#705535]">
              ₹{isLiteralMockup ? '{order_total}' : orderTotalInr.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Folio Billing Sub-note */}
          <div className="pt-3 border-t border-[#F2ECE3] flex items-start gap-2.5 text-xs text-[#7B7166]">
            <Bed className="w-4 h-4 text-[#705535] shrink-0 mt-0.5" />
            <span>
              Billed directly to ROOM {roomLower} on checkout / in-room folio.
            </span>
          </div>
        </section>
      </main>

      {/* Floating Bottom Checkout Action Bar */}
      <div className="fixed bottom-16 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#EAE3D9] p-4 shadow-xl">
        <div className="w-full max-w-4xl mx-auto flex items-center justify-between gap-4">
          {/* Total & Charge note */}
          <div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#7E7469]">
              <span>TOTAL:</span>
              <span className="text-base sm:text-lg text-[#201A15] font-black">
                ₹{isLiteralMockup ? '{order_total}' : orderTotalInr.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#8A8074]">
              Charge to Room • Checkout
            </p>
          </div>

          {/* Place Order CTA */}
          <button
            type="button"
            onClick={handlePlaceOrder}
            className="flex items-center gap-2 bg-[#705535] hover:bg-[#5C452A] text-white font-bold text-xs sm:text-sm px-6 sm:px-8 py-3.5 rounded-2xl shadow-md transition active:scale-98 cursor-pointer"
          >
            <span>Place Order</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Fixed Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAE3D8] shadow-lg">
        <div className="w-full max-w-5xl mx-auto flex items-center justify-around h-16 px-4 sm:px-8">
          {/* 1. Home */}
          <Link
            href="/guest"
            className="flex flex-col items-center justify-center gap-1 text-[#7C7164] hover:text-[#231E18] text-xs font-medium transition"
          >
            <Home className="w-5 h-5 text-[#7C7164]" />
            <span className="leading-none">Home</span>
          </Link>

          {/* 2. Orders */}
          <Link
            href="/guest/orders"
            className="flex flex-col items-center justify-center gap-1 text-[#7C7164] hover:text-[#231E18] text-xs font-medium transition"
          >
            <ClocheIcon className="w-5 h-5 text-[#7C7164]" />
            <span className="leading-none">Orders</span>
          </Link>

          {/* 3. Room Service */}
          <Link
            href="/guest/services"
            className="flex flex-col items-center justify-center gap-1 text-[#7C7164] hover:text-[#231E18] text-xs font-medium transition cursor-pointer"
          >
            <ConciergeHandBellIcon className="w-5 h-5 text-[#7C7164]" />
            <span className="leading-none">Room Service</span>
          </Link>
        </div>
      </nav>

      {/* Room Service Services Modal */}
      <RoomServiceRequestModal
        isOpen={isServicesModalOpen}
        onClose={() => setIsServicesModalOpen(false)}
      />

      {/* Order Confirmed Dialog */}
      {isOrderPlaced && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#EFE9DF] text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#705535]">
                Order Confirmed
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#201A15]">
                {confirmedOrderNumber || '#NV-2895'}
              </h3>
              <p className="text-xs text-[#665E55]">
                Your dining order has been dispatched to the kitchen. Estimated arrival to ROOM {roomLower} is ~25–35 mins.
              </p>
            </div>

            <div className="rounded-2xl border border-[#EFE9DF] bg-[#FAF8F5] p-4 text-xs text-[#554C42] text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-[#887E72]">Destination:</span>
                <strong className="text-[#201A15]">ROOM {roomUpper}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#887E72]">Total Billed:</span>
                <strong className="text-[#705535] font-serif text-sm">₹{orderTotalInr.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#887E72]">Payment:</span>
                <span className="text-[#201A15] font-semibold">In-Room Guest Folio</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <Link
                href="/guest/orders"
                className="w-full py-3.5 px-4 rounded-xl bg-[#705535] hover:bg-[#5C452A] text-white font-bold text-xs shadow-md transition"
              >
                Track Live Order Status →
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsOrderPlaced(false);
                  router.push('/guest/menu');
                }}
                className="w-full py-2.5 rounded-xl border border-[#EFE9DF] bg-white text-xs font-semibold text-[#554C42] hover:bg-[#F6F2EC]"
              >
                Back to Food Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#705535] border-t-transparent animate-spin" />
        </div>
      }
    >
      <CartPageContent />
    </Suspense>
  );
}
