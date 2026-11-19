'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ShoppingBag,
  Check,
  CheckCircle2,
  Home,
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

function FoodDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { guest, menuItems, addToCart } = useNivora();

  const itemId = searchParams.get('id') || '';
  const queryRoom = searchParams.get('room');
  const roomUpper = queryRoom ? `ROOM ${queryRoom}` : '{ROOM_NUMBER}';

  const dish = useMemo(() => {
    return menuItems.find((menuItem) => menuItem.id === itemId);
  }, [menuItems, itemId]);

  const basePriceInr = dish ? Math.round(dish.price * 85) : 0;

  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [specialInstruction, setSpecialInstruction] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);

  // Toast notice
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleOption = (id: string) => {
    setSelectedOptionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Compute subtotal dynamically
  const optionsTotalInr = useMemo(() => {
    return (dish?.options || []).filter((option) => selectedOptionIds.includes(option.id)).reduce(
      (acc, option) => acc + Math.round(option.price * 85),
      0
    );
  }, [dish, selectedOptionIds]);

  const itemSubtotalInr = (basePriceInr + optionsTotalInr) * quantity;

  const handleAddToCart = () => {
    if (!dish) {
      showToast('This menu item is unavailable. Please return to the menu.');
      return;
    }
    addToCart(dish, quantity, specialInstruction.trim() || undefined, selectedOptionIds);
    showToast(`Added ${quantity}x ${dish.name} to your tray!`);
    setTimeout(() => {
      router.push('/guest/cart');
    }, 600);
  };

  if (!dish) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#FAF8F5] px-6 text-center">
        <p role="alert" className="text-sm text-[#665D52]">
          {menuItems.length ? 'This menu item is no longer available.' : 'The menu is not available yet. Scan your room QR code to continue.'}
        </p>
        <Link href="/guest/menu" className="text-sm font-bold text-[#705535] underline">
          Return to menu
        </Link>
      </main>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] text-[#221B14] selection:bg-[#705535]/20 selection:text-[#221B14] pb-44 antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-full bg-[#2A231C] px-5 py-2.5 text-xs font-medium text-white shadow-xl flex items-center gap-2 border border-[#44382F] animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container - Full Width with Responsive Max Width */}
      <main className="w-full max-w-2xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 space-y-4 sm:space-y-5">
        {/* Top Header Bar */}
        <header className="flex items-center justify-between pt-1 pb-1">
          <div className="flex items-center gap-3">
            <Link
              href="/guest/menu"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#EAE3D9] flex items-center justify-center text-[#201A15] hover:bg-[#F6F2EC] transition shadow-2xs"
              aria-label="Back to Food Menu"
            >
              <ArrowLeft className="w-5 h-5 text-[#201A15]" />
            </Link>

            <div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#201A15] tracking-tight leading-none">
                Food Details
              </h1>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#6D6357] mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
                <span>{roomUpper}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Food Image Banner */}
        <section className="relative w-full h-[260px] sm:h-[340px] md:h-[400px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs select-none bg-[#F2EDE7]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 pointer-events-none" />

          <div className="absolute top-3 left-1/2 -translate-x-1/2">
            <span className="text-[11px] font-medium text-white/90 drop-shadow-sm">
              {dish.category}
            </span>
          </div>

          <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#201A15] text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#87552A]" />
              <span>{dish.isVegetarian ? 'VEGETARIAN' : 'SIGNATURE'}</span>
            </span>
          </div>

          <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C4734]/90 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-xs border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{dish.isAvailable === false ? 'UNAVAILABLE' : 'AVAILABLE'}</span>
            </span>
          </div>
        </section>

        {/* Food Title, Price, Description */}
        <section className="space-y-1 pt-1">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#201A15] tracking-tight">
            {dish.name}
          </h2>

          <div className="flex items-center gap-2 pt-0.5">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#705535]">
              ₹{basePriceInr.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#8A8074]">
              PER SERVING
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#665D53] leading-relaxed pt-1">
            {dish.description}
          </p>
        </section>

        {/* Customize Your Order Section */}
        <section className="pt-2">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#201A15]">
            Customize Your Order
          </h3>
          <p className="text-xs text-[#7B7166] mt-0.5 mb-3">
            Select optional additions or accompaniments
          </p>

          <div className="space-y-2.5">
            {(dish.options || []).filter((option) => option.isActive).map((opt) => {
              const isChecked = selectedOptionIds.includes(opt.id);
              return (
                <div
                  key={opt.id}
                  onClick={() => toggleOption(opt.id)}
                  className="bg-white rounded-2xl p-4 border border-[#EFE9DF] shadow-2xs flex items-center justify-between cursor-pointer transition hover:border-[#DACFC0] active:scale-99"
                >
                  <div className="flex items-center gap-3">
                    {/* Custom Checkbox */}
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition ${
                        isChecked
                          ? 'bg-[#705535] text-white'
                          : 'border-2 border-[#C5BCB1] bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <span className="text-xs sm:text-sm font-bold text-[#201A15]">
                      {opt.name}
                    </span>
                  </div>

                  <span className="text-xs sm:text-sm font-bold text-[#705535]">
                    +₹{Math.round(opt.price * 85).toLocaleString('en-IN')}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Special Instructions Section */}
        <section className="pt-2">
          <div className="flex items-center justify-between mb-0.5">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#201A15]">
              Special Instructions
            </h3>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#8A8074]">
              OPTIONAL
            </span>
          </div>

          <p className="text-xs text-[#7B7166] mb-2.5">
            Allergies, spice level, or special preparation requests.
          </p>

          <textarea
            rows={3}
            value={specialInstruction}
            onChange={(e) => setSpecialInstruction(e.target.value)}
            placeholder="{special_instruction}"
            className="w-full rounded-2xl border border-[#EFE9DF] bg-white p-4 text-xs sm:text-sm text-[#201A15] placeholder-[#8A8074] focus:border-[#705535] focus:outline-hidden shadow-2xs"
          />
        </section>

        {/* Quantity & Item Subtotal Card */}
        <section className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EFE9DF] shadow-2xs flex items-center justify-between mt-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-[#8A8074] leading-none">
              QUANTITY
            </p>
            <p className="font-serif text-xl sm:text-2xl font-bold text-[#201A15] mt-1 leading-none">
              Item Subtotal
            </p>
          </div>

          {/* Stepper */}
          <div className="bg-[#F4EFEB] rounded-full px-4 py-2 flex items-center gap-4">
            <button
              type="button"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className="text-[#5A5046] font-bold text-base hover:opacity-75 transition cursor-pointer"
              aria-label="Decrease quantity"
            >
              —
            </button>
            <span className="font-bold text-base text-[#201A15] min-w-[20px] text-center select-none">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((prev) => prev + 1)}
              className="text-[#5A5046] font-bold text-base hover:opacity-75 transition cursor-pointer"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </section>
      </main>

      {/* Floating Bottom Delivery & ADD TO CART Action Bar */}
      <div className="fixed bottom-16 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#EAE3D9] p-4 shadow-xl">
        <div className="w-full max-w-2xl mx-auto space-y-2">
          {/* Mini info row */}
          <div className="flex items-center justify-between text-xs font-bold px-1">
            <div className="flex items-center gap-2 text-[#6D6357]">
              <ClocheIcon className="w-4 h-4 text-[#705535]" />
              <span className="uppercase tracking-wide">DELIVER TO ROOM {roomUpper}</span>
            </div>

            <span className="text-emerald-700 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
              FRESHLY PREPARED
            </span>
          </div>

          {/* ADD TO CART Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full flex items-center justify-between py-3.5 px-6 rounded-2xl bg-[#705535] hover:bg-[#5B4429] text-white font-bold text-sm sm:text-base shadow-md transition active:scale-98 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-white/90" />
              <span>ADD TO CART</span>
            </div>
            <span>₹1,030</span>
          </button>
        </div>
      </div>

      {/* Fixed Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAE3D8] shadow-lg">
        <div className="w-full max-w-2xl mx-auto flex items-center justify-around h-16 px-4">
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
    </div>
  );
}

export default function FoodDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#705535] border-t-transparent animate-spin" />
        </div>
      }
    >
      <FoodDetailsContent />
    </Suspense>
  );
}

