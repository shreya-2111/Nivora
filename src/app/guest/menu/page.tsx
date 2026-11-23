'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Search,
  Bell,
  Plus,
  Minus,
  Sparkles,
  Home,
  CheckCircle2,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import { useNivora } from '@/context/NivoraContext';
import { MenuItem } from '@/types';
import { ItemDetailModal } from '@/components/guest/ItemDetailModal';
import { CartDrawer } from '@/components/guest/CartDrawer';
import { RoomServiceRequestModal } from '@/components/guest/RoomServiceRequestModal';

/* Custom SVG Icons */
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

const CATEGORIES = [
  'All',
  'Starters',
  'Mains',
  'Desserts',
  'Signature Cocktails',
  'Wines & Spirits',
];

type DietaryFilter = 'All Items' | 'Veg' | 'Non-Veg' | "Chef's Choice";

function FoodMenuContent() {
  const {
    guest,
    menuItems,
    cartItems,
    totalCartCount,
    cartSubtotal,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
  } = useNivora();

  const searchParams = useSearchParams();
  const queryRoom = searchParams.get('room');
  const roomUpper = queryRoom ? `ROOM ${queryRoom}` : '{ROOM NUMBER}';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDietary, setSelectedDietary] = useState<DietaryFilter>('All Items');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeItemForDetail, setActiveItemForDetail] = useState<MenuItem | null>(null);
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);

  // Template toggle mode so user can see literal mockup {variables} or live rich dish names
  const [isLiteralMockup, setIsLiteralMockup] = useState(false);

  // Toast notice
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getQuantityInCart = (itemId: string) => {
    const found = cartItems.find((entry) => entry.item.id === itemId);
    return found ? found.quantity : 0;
  };

  // Convert USD to INR (approx 85) for Rupee currency matching mockup
  const formatPrice = (priceInUsd: number) => {
    return Math.round(priceInUsd * 85).toLocaleString('en-IN');
  };

  const cartTotalInr = Math.round(cartSubtotal * 85).toLocaleString('en-IN');

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Dietary filter
      if (selectedDietary === 'Veg' && !item.isVegetarian) return false;
      if (selectedDietary === 'Non-Veg' && item.isVegetarian) return false;
      if (selectedDietary === "Chef's Choice" && !item.isChefChoice) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCat = item.category.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      return true;
    });
  }, [menuItems, selectedCategory, selectedDietary, searchQuery]);

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] text-[#221B14] selection:bg-[#85653C]/20 selection:text-[#221B14] pb-32 antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-full bg-[#2A231C] px-5 py-2.5 text-xs font-medium text-white shadow-xl flex items-center gap-2 border border-[#44382F] animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container - Responsive Full Width */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-5 sm:space-y-6">
        {/* Top Header Bar */}
        <header className="flex items-center justify-between pt-1 pb-1">
          {/* Back button & Title */}
          <div className="flex items-center gap-3">
            <Link
              href="/guest"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#EAE3D9] flex items-center justify-center text-[#332B24] hover:bg-[#F6F2EC] transition shadow-2xs"
              aria-label="Back to Guest Home"
            >
              <ArrowLeft className="w-5 h-5 text-[#332B24]" />
            </Link>

            <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#201A15] tracking-tight">
              Food Menu
            </h1>
          </div>

          {/* Room Pill & Actions */}
          <div className="flex items-center gap-2.5">
            {/* Room Identifier Pill */}
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FDF0E2] text-[#87552A] border border-[#F5DEC9] text-xs font-bold tracking-wide">
              <span>{roomUpper}</span>
            </div>

            {/* Quick Search Focus */}
            <button
              type="button"
              onClick={() => {
                const searchInput = document.getElementById('food-search-input');
                searchInput?.focus();
              }}
              className="w-9 h-9 rounded-full bg-white border border-[#EAE3D9] flex items-center justify-center text-[#332B24] hover:bg-[#F6F2EC] transition shadow-2xs cursor-pointer"
              aria-label="Search food"
            >
              <Search className="w-4 h-4 text-[#332B24]" />
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => showToast('Kitchen is currently open • Normal prep time: 25-35 mins')}
              className="w-9 h-9 rounded-full bg-white border border-[#EAE3D9] flex items-center justify-center text-[#332B24] hover:bg-[#F6F2EC] transition shadow-2xs cursor-pointer"
              aria-label="Kitchen notifications"
            >
              <Bell className="w-4 h-4 text-[#332B24]" />
            </button>
          </div>
        </header>

        {/* Search Input Bar */}
        <div className="relative bg-white rounded-2xl p-3 sm:p-3.5 border border-[#EFE9DF] shadow-2xs flex items-center gap-3">
          <Search className="w-5 h-5 text-[#887E72] shrink-0 ml-1" />
          <input
            id="food-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search food"
            className="w-full bg-transparent text-sm sm:text-base text-[#221B14] placeholder-[#887E72] focus:outline-hidden"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-[#887E72] hover:text-[#221B14] mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Row 1: Dietary Types */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 pb-1">
          {/* 1. All Items */}
          <button
            type="button"
            onClick={() => setSelectedDietary('All Items')}
            className={`shrink-0 text-xs font-semibold px-4 py-2 rounded-full transition cursor-pointer ${
              selectedDietary === 'All Items'
                ? 'bg-[#85653C] text-white shadow-xs'
                : 'bg-white text-[#4F463D] border border-[#EFE9DF] hover:bg-[#F6F2EC]'
            }`}
          >
            All Items
          </button>

          {/* 2. Veg */}
          <button
            type="button"
            onClick={() => setSelectedDietary('Veg')}
            className={`shrink-0 text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 transition cursor-pointer ${
              selectedDietary === 'Veg'
                ? 'bg-[#85653C] text-white shadow-xs'
                : 'bg-white text-[#4F463D] border border-[#EFE9DF] hover:bg-[#F6F2EC]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
            <span>Veg</span>
          </button>

          {/* 3. Non-Veg */}
          <button
            type="button"
            onClick={() => setSelectedDietary('Non-Veg')}
            className={`shrink-0 text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 transition cursor-pointer ${
              selectedDietary === 'Non-Veg'
                ? 'bg-[#85653C] text-white shadow-xs'
                : 'bg-white text-[#4F463D] border border-[#EFE9DF] hover:bg-[#F6F2EC]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-600 inline-block" />
            <span>Non-Veg</span>
          </button>

          {/* 4. Chef's Choice */}
          <button
            type="button"
            onClick={() => setSelectedDietary("Chef's Choice")}
            className={`shrink-0 text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 transition cursor-pointer ${
              selectedDietary === "Chef's Choice"
                ? 'bg-[#85653C] text-white shadow-xs'
                : 'bg-white text-[#4F463D] border border-[#EFE9DF] hover:bg-[#F6F2EC]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C27E43]" />
            <span>Chef&apos;s Choice</span>
          </button>
        </div>

        {/* Filter Row 2: Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 text-xs font-medium px-4 py-2 rounded-full transition cursor-pointer ${
                  isActive
                    ? 'bg-[#85653C] text-white font-semibold shadow-xs'
                    : 'bg-white text-[#4F463D] border border-[#EFE9DF] hover:bg-[#F6F2EC]'
                }`}
              >
                {isLiteralMockup
                  ? isActive
                    ? '{category_name} (Active)'
                    : '{category_name}'
                  : isActive
                  ? `${cat} (Active)`
                  : cat}
              </button>
            );
          })}
        </div>

        {/* Food Items List (Stacked on mobile, 2-column on tablet, 3-column on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 pt-2">
          {filteredItems.map((item, idx) => {
            const qty = getQuantityInCart(item.id);
            // Simulate item 3 being unavailable to demonstrate all states from mockup
            const isUnavailable = idx === 2 && !item.isChefChoice;
            const isCustomizable = item.category === 'Mains' || item.isChefChoice;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#EFE9DF] flex flex-col justify-between transition-all hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] ${
                  isUnavailable ? 'opacity-85' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left Column: Details & Pricing */}
                  <div className="flex-1 space-y-1">
                    {/* Badges Row */}
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {/* Dietary Badge */}
                      <span className="inline-flex items-center gap-1 bg-[#F2EDE7] text-[#6E6357] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.isVegetarian ? 'bg-emerald-600' : 'bg-rose-600'
                          }`}
                        />
                        <span>
                          {isLiteralMockup
                            ? '{VEG_NONVEG}'
                            : item.isVegetarian
                            ? 'VEG'
                            : 'NON-VEG'}
                        </span>
                      </span>

                      {/* Status / Availability Badge */}
                      {isUnavailable ? (
                        <span className="bg-[#FDECEC] text-[#D24A4A] text-[10px] font-bold px-2 py-0.5 rounded-md">
                          Unavailable
                        </span>
                      ) : isCustomizable ? (
                        <span className="bg-[#FCEFE3] text-[#A66832] text-[9px] font-semibold px-2 py-0.5 rounded-md">
                          {isLiteralMockup ? 'Customizable {item_options}' : 'Customizable Options'}
                        </span>
                      ) : (
                        <span className="text-[#C27E43] font-bold text-[10px] tracking-wider uppercase">
                          IN STOCK
                        </span>
                      )}
                    </div>

                    {/* Food Name (Links to Screen 4: Food Details) */}
                    <Link
                      href={!isUnavailable ? `/guest/item?id=${item.id}` : '#'}
                      className={`block font-serif text-xl sm:text-2xl font-bold leading-tight ${
                        isUnavailable
                          ? 'text-[#A0988E] cursor-not-allowed'
                          : 'text-[#201A15] hover:text-[#85653C] transition-colors cursor-pointer'
                      }`}
                    >
                      {isLiteralMockup ? '{food_name}' : item.name}
                    </Link>

                    {/* Description */}
                    <p
                      className={`text-xs sm:text-sm line-clamp-2 leading-relaxed ${
                        isUnavailable ? 'text-[#B5ADA4]' : 'text-[#7B7166]'
                      }`}
                    >
                      {isLiteralMockup ? '{description}' : item.description}
                    </p>

                    {/* Price */}
                    <p
                      className={`text-lg sm:text-xl font-bold pt-1 ${
                        isUnavailable ? 'text-[#9E958C]' : 'text-[#201A15]'
                      }`}
                    >
                      ₹{isLiteralMockup ? '{price}' : formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Right Column: Dish Photo with Label (Links to Screen 4) */}
                  <Link
                    href={!isUnavailable ? `/guest/item?id=${item.id}` : '#'}
                    className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0 shadow-2xs bg-[#F2EDE7] block ${
                      isUnavailable ? 'cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      unoptimized
                      className={`object-cover transition-transform duration-500 hover:scale-105 ${
                        isUnavailable ? 'grayscale-40 contrast-90' : ''
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 bg-black/45 backdrop-blur-xs text-white/90 text-[9px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
                      {isLiteralMockup ? '{food_image}' : item.tag || 'Chef Special'}
                    </span>
                  </Link>
                </div>

                {/* Bottom Row: Availability note & Action button */}
                <div className="mt-4 pt-3 border-t border-[#F2ECE3] flex items-center justify-between gap-3">
                  <div className="text-xs text-[#9B9185]">
                    {isUnavailable ? (
                      <span>Currently sold out for tonight</span>
                    ) : isCustomizable ? (
                      <span className="text-[#C27E43]">
                        {isLiteralMockup ? '{item_options}' : 'Choice of sides & temperature'}
                      </span>
                    ) : (
                      <span>
                        {isLiteralMockup ? '{availability}' : `Prep time: ${item.prepTime}`}
                      </span>
                    )}
                  </div>

                  {/* Add / Stepper Button */}
                  <div>
                    {isUnavailable ? (
                      <button
                        type="button"
                        disabled
                        className="bg-[#EDEBE7] text-[#8C847B] font-semibold text-xs px-5 py-2.5 rounded-xl cursor-not-allowed"
                      >
                        Unavailable
                      </button>
                    ) : qty > 0 ? (
                      <div className="flex items-center gap-2 bg-[#85653C] text-white rounded-xl px-2.5 py-1.5 shadow-xs">
                        <button
                          type="button"
                          onClick={() => removeFromCart(item)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-white/20 rounded-lg transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold text-sm min-w-[18px] text-center">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => addToCart(item)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-white/20 rounded-lg transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => addToCart(item)}
                        className="bg-[#85653C] hover:bg-[#684E2D] text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty Search Fallback */}
        {filteredItems.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center border border-[#EFE9DF] space-y-2">
            <UtensilsCrossed className="w-8 h-8 text-[#887E72] mx-auto mb-2" />
            <h3 className="font-serif text-lg font-bold text-[#201A15]">
              No matching culinary items
            </h3>
            <p className="text-xs text-[#7B7166]">
              Try searching for steak, pasta, cocktails, or clearing your dietary filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedDietary('All Items');
                setSelectedCategory('All');
              }}
              className="mt-3 bg-[#85653C] text-white text-xs font-semibold px-4 py-2 rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* Floating Bottom Cart Bar */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-20 left-0 right-0 z-30 pointer-events-none px-4">
          <div className="max-w-4xl mx-auto pointer-events-auto bg-[#2B2621] text-white p-3 sm:p-3.5 rounded-2xl shadow-2xl flex items-center justify-between border border-[#443C34] animate-fade-in">
            <div className="flex items-center gap-3">
              {/* Bronze Cloche Icon Box */}
              <div className="w-10 h-10 rounded-xl bg-[#715535] text-white flex items-center justify-center shrink-0">
                <UtensilsCrossed className="w-5 h-5" />
              </div>

              <div>
                <p className="font-bold text-sm sm:text-base text-white leading-tight">
                  {totalCartCount} {totalCartCount === 1 ? 'item' : 'items'} • ₹{cartTotalInr}
                </p>
                <p className="text-[11px] text-[#C2B7A8] leading-tight mt-0.5">
                  Villa Del Mar Delivery
                </p>
              </div>
            </div>

            <Link
              href="/guest/cart"
              className="bg-[#85653C] hover:bg-[#6D522D] text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition active:scale-95 shadow-xs cursor-pointer"
            >
              <span>View Cart</span>
              <span className="text-sm">→</span>
            </Link>
          </div>
        </div>
      )}

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

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        guest={guest}
        onUpdateQuantity={updateCartQuantity}
        onClearCart={clearCart}
      />

      {/* Item Details Modal */}
      <ItemDetailModal
        isOpen={!!activeItemForDetail}
        item={activeItemForDetail}
        currentQuantity={activeItemForDetail ? getQuantityInCart(activeItemForDetail.id) : 0}
        onClose={() => setActiveItemForDetail(null)}
        onSave={(item, qty, instructions) => {
          addToCart(item, qty, instructions);
          setActiveItemForDetail(null);
          showToast(`Added ${qty}x ${item.name} to your tray`);
        }}
      />

      {/* Room Service Services Modal */}
      <RoomServiceRequestModal
        isOpen={isServicesModalOpen}
        onClose={() => setIsServicesModalOpen(false)}
      />
    </div>
  );
}

export default function GuestMenuPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#85653C] border-t-transparent animate-spin" />
      </div>
    }>
      <FoodMenuContent />
    </Suspense>
  );
}
