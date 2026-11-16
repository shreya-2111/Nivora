'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Bell,
  Wifi,
  Clock,
  ArrowRight,
  Phone,
  BookOpen,
  Home,
  CheckCircle2,
  ExternalLink,
  Shield,
  Droplets,
  Wrench,
  Shirt,
  Sparkles,
  UtensilsCrossed,
  Headphones,
  Check,
} from 'lucide-react';
import { useNivora } from '@/context/NivoraContext';
import { RoomServiceRequestModal } from '@/components/guest/RoomServiceRequestModal';

/* Custom SVG Icons for exact 1:1 match to Screen 2 */
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

function TowelsIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
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
      <path d="M4 8h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2z" />
      <path d="M4 12h16" />
      <path d="M7 4v4" />
      <path d="M17 4v4" />
    </svg>
  );
}

function ToiletriesIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
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
      <rect x="7" y="9" width="10" height="12" rx="3" />
      <path d="M10 9V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4" />
      <path d="M10 5h4" />
    </svg>
  );
}

function CleaningIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
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
      <path d="m14 11 7-7" />
      <path d="M5 21a2 2 0 0 1-2-2v-3a2 2 0 0 1 .6-1.4l7.8-7.8a2 2 0 0 1 2.8 0l3 3a2 2 0 0 1 0 2.8L9.4 20.4A2 2 0 0 1 8 21H5z" />
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

function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.888 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function GuestHomeContent() {
  const { guest } = useNivora();
  const searchParams = useSearchParams();

  const queryRoom = searchParams.get('room');
  const roomUpper = queryRoom ? `ROOM ${queryRoom}` : '{ROOM_NUMBER}';
  const roomLower = queryRoom ? `Room ${queryRoom}` : '{room_number}';
  const phoneDisplay = '{phone_number}';
  const hotelNameDisplay = '{HOTEL_NAME}';

  // Room service request modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Housekeeping & Linen');
  const [selectedItem, setSelectedItem] = useState<string>('');

  // Info modal state for Hotel Information
  const [isHotelInfoOpen, setIsHotelInfoOpen] = useState(false);

  // Toast notice
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleOpenQuickService = (category: string, item: string) => {
    setSelectedCategory(category);
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handlePhoneClick = () => {
    const phone = '+18005550199';
    if (typeof window !== 'undefined') {
      try {
        navigator.clipboard.writeText(phone);
        showToast('Connecting to Front Desk (+1 800-555-0199)...');
        window.location.href = `tel:${phone}`;
      } catch {
        window.location.href = `tel:${phone}`;
      }
    }
  };

  const handleWhatsAppClick = () => {
    const text = encodeURIComponent(
      `Hello Nivora Concierge, I am reaching out from ${roomLower}. Could you please assist me?`
    );
    window.open(`https://wa.me/18005550199?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] text-[#221B14] selection:bg-[#715535]/20 selection:text-[#221B14] pb-28 antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-full bg-[#2A231C] px-5 py-2.5 text-xs font-medium text-white shadow-xl flex items-center gap-2 border border-[#44382F] animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container - Full Width with Responsive Max Width */}
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-4 sm:space-y-5">
        {/* Top Header Bar */}
        <header className="flex items-center justify-between pt-1 pb-1">
          {/* Brand Monogram & Name */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#715535] flex items-center justify-center text-white shadow-xs shrink-0">
              <span className="font-serif font-bold text-lg sm:text-xl leading-none select-none">N</span>
            </div>
            <div>
              <h1 className="text-[17px] sm:text-lg font-bold text-[#231E18] tracking-tight leading-none">
                Nivora
              </h1>
              <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[#715535] uppercase leading-none mt-1">
                CONCIERGE
              </p>
            </div>
          </Link>

          {/* Room Badge & Notification Bell */}
          <div className="flex items-center gap-2.5">
            {/* Room Identifier Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4EFEB] text-[#5A5046] border border-[#E8E2D8] text-xs font-semibold">
              <span className="text-[#715535]">•</span>
              <span>{roomUpper}</span>
              <Shield className="w-3 h-3 text-[#715535] fill-[#715535]/15" />
            </div>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => showToast('No new notifications • All systems operating normally')}
              className="w-9 h-9 rounded-full bg-white border border-[#EAE3D9] flex items-center justify-center text-[#3A332C] hover:bg-[#F6F2EC] transition shadow-2xs cursor-pointer"
              aria-label="Concierge Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Top Sub-banner: Direct In-Room Access */}
        <div className="bg-[#FAF7F2] rounded-xl px-4 py-2.5 border border-[#EFE8DF] flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#6D6357] uppercase tracking-wide">
            <span className="text-[#715535] font-black">•</span>
            <span>DIRECT IN-ROOM ACCESS • ROOM {roomUpper}</span>
          </div>

          <div className="flex items-center justify-center w-4 h-4 rounded-full bg-[#715535] text-white">
            <Check className="w-2.5 h-2.5 stroke-[3]" />
          </div>
        </div>

        {/* Hero Greeting Section */}
        <section className="pt-1 pb-1">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#221B14] leading-tight tracking-tight">
            How can we assist you?
          </h2>
          <p className="text-xs sm:text-sm text-[#665D53] mt-1.5 leading-relaxed">
            Enjoy a seamless stay with everything you need in one place.
          </p>
        </section>

        {/* Quick Info Chips Row (Wi-Fi & Concierge Desk) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5">
          {/* Chip 1: High-Speed Wi-Fi */}
          <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-[#EFE9DF] flex items-center gap-3 shadow-2xs">
            <div className="w-9 h-9 rounded-full bg-[#FDF0E2] text-[#9E6532] flex items-center justify-center shrink-0">
              <Wifi className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-[#7E7469] leading-none">
                HIGH-SPEED WI-FI
              </p>
              <p className="text-xs sm:text-sm font-bold text-[#231E18] mt-1 leading-none">
                Guest
              </p>
            </div>
          </div>

          {/* Chip 2: Concierge Desk */}
          <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-[#EFE9DF] flex items-center gap-3 shadow-2xs">
            <div className="w-9 h-9 rounded-full bg-[#FDF0E2] text-[#9E6532] flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-[#7E7469] leading-none">
                CONCIERGE DESK
              </p>
              <p className="text-xs sm:text-sm font-bold text-[#231E18] mt-1 leading-none">
                Available 24/7
              </p>
            </div>
          </div>
        </div>

        {/* Services Layout (Stacked on mobile, 2-column or 4-grid on desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          {/* SERVICE 1: Order Food */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#EFE9DF] relative overflow-hidden flex flex-col justify-between hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] transition-all">
            {/* Subtle decorative warm background radial arc in top right corner */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#FDF3E7] rounded-bl-full pointer-events-none -z-0 opacity-80" />

            <div className="relative z-10">
              <Link href="/guest/menu" className="block group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    {/* Bronze Cutlery Icon Box */}
                    <div className="w-12 h-12 rounded-xl bg-[#715535] text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                      <UtensilsCrossed className="w-6 h-6 stroke-[1.8]" />
                    </div>

                    <div>
                      <div className="inline-flex items-center gap-1.5 bg-[#EFE8E1] text-[#63584D] text-[9px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full">
                        <span className="text-[#715535]">•</span>
                        <span>AVAILABLE • KITCHEN OPEN</span>
                      </div>

                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#201A15] mt-1.5 leading-tight">
                        Order Food
                      </h3>
                    </div>
                  </div>

                  {/* Arrow Circle */}
                  <div className="w-9 h-9 rounded-full bg-[#F6F2EC] flex items-center justify-center text-[#4B4239] group-hover:bg-[#EAE2D7] group-hover:text-[#231E18] transition-colors shrink-0 mt-0.5">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#665E55] mt-3 leading-relaxed">
                  Browse curated dining menus, customize dishes, and order directly to Room {roomLower}.
                </p>
              </Link>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4 pt-1">
                <span className="bg-[#F2ECE4] text-[#554C42] text-[11px] font-medium px-3 py-1 rounded-full">
                  Breakfast, Lunch &amp; Dinner
                </span>
                <span className="bg-[#F2ECE4] text-[#554C42] text-[11px] font-medium px-3 py-1 rounded-full">
                  Fast In-Room Delivery
                </span>
              </div>
            </div>
          </section>

          {/* SERVICE 2: Room Service */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#EFE9DF] flex flex-col justify-between hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] transition-all">
            <div>
              <Link
                href="/guest/services"
                className="flex items-start justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-start gap-3.5">
                  {/* Soft Peach Cloche Icon Box */}
                  <div className="w-12 h-12 rounded-xl bg-[#FDEFE0] text-[#715535] flex items-center justify-center shrink-0 group-hover:bg-[#F8E3CD] transition-colors">
                    <ClocheIcon className="w-6 h-6 text-[#715535]" />
                  </div>

                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#201A15] leading-tight">
                      Room Service
                    </h3>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-[#7E7469] mt-0.5">
                      IN-ROOM COMFORT &amp; CARE
                    </p>
                  </div>
                </div>

                {/* Arrow Circle */}
                <div className="w-9 h-9 rounded-full bg-[#F6F2EC] flex items-center justify-center text-[#4B4239] group-hover:bg-[#EAE2D7] group-hover:text-[#231E18] transition-colors shrink-0 mt-0.5">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>

              <p className="text-xs sm:text-sm text-[#665E55] mt-3 leading-relaxed">
                Towels, drinking water, toiletries, housekeeping, laundry &amp; maintenance.
              </p>

              {/* 6 Quick Amenity Chips arranged in 3x2 Grid */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-1">
                {/* 1. Towels */}
                <Link
                  href="/guest/services?category=towels"
                  className="bg-[#F4EFEB] hover:bg-[#EAE3D9] text-[#463F37] rounded-xl py-2 px-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#E5DFD6] transition-colors active:scale-95 cursor-pointer"
                >
                  <TowelsIcon className="w-3.5 h-3.5 text-[#715535]" />
                  <span className="truncate">Towels</span>
                </Link>

                {/* 2. Water */}
                <Link
                  href="/guest/services?category=water"
                  className="bg-[#F4EFEB] hover:bg-[#EAE3D9] text-[#463F37] rounded-xl py-2 px-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#E5DFD6] transition-colors active:scale-95 cursor-pointer"
                >
                  <Droplets className="w-3.5 h-3.5 text-[#715535]" />
                  <span className="truncate">Water</span>
                </Link>

                {/* 3. Toiletries */}
                <Link
                  href="/guest/services?category=toiletries"
                  className="bg-[#F4EFEB] hover:bg-[#EAE3D9] text-[#463F37] rounded-xl py-2 px-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#E5DFD6] transition-colors active:scale-95 cursor-pointer"
                >
                  <ToiletriesIcon className="w-3.5 h-3.5 text-[#715535]" />
                  <span className="truncate">Toiletries</span>
                </Link>

                {/* 4. Cleaning */}
                <Link
                  href="/guest/services?category=housekeeping"
                  className="bg-[#F4EFEB] hover:bg-[#EAE3D9] text-[#463F37] rounded-xl py-2 px-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#E5DFD6] transition-colors active:scale-95 cursor-pointer"
                >
                  <CleaningIcon className="w-3.5 h-3.5 text-[#715535]" />
                  <span className="truncate">Cleaning</span>
                </Link>

                {/* 5. Laundry */}
                <Link
                  href="/guest/services?category=laundry"
                  className="bg-[#F4EFEB] hover:bg-[#EAE3D9] text-[#463F37] rounded-xl py-2 px-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#E5DFD6] transition-colors active:scale-95 cursor-pointer"
                >
                  <Shirt className="w-3.5 h-3.5 text-[#715535]" />
                  <span className="truncate">Laundry</span>
                </Link>

                {/* 6. Support */}
                <Link
                  href="/guest/services?category=maintenance"
                  className="bg-[#F4EFEB] hover:bg-[#EAE3D9] text-[#463F37] rounded-xl py-2 px-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#E5DFD6] transition-colors active:scale-95 cursor-pointer"
                >
                  <Wrench className="w-3.5 h-3.5 text-[#715535]" />
                  <span className="truncate">Support</span>
                </Link>
              </div>
            </div>
          </section>

          {/* SERVICE 3: Hotel Assistance */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#EFE9DF] flex flex-col justify-between hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] transition-all">
            <div>
              <div className="flex items-start gap-3.5">
                {/* Soft Peach Headset Icon Box */}
                <div className="w-12 h-12 rounded-xl bg-[#FDEFE0] text-[#715535] flex items-center justify-center shrink-0">
                  <Headphones className="w-6 h-6 text-[#715535]" />
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 bg-[#EFE8E1] text-[#63584D] text-[9px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full">
                    <span className="text-[#715535]">•</span>
                    <span>FRONT DESK 24/7</span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#201A15] mt-1.5 leading-tight">
                    Hotel Assistance
                  </h3>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#665E55] mt-3 leading-relaxed">
                Contact reception or message the concierge team directly for any in-stay requests.
              </p>
            </div>

            {/* Vertical Stack Contact Buttons */}
            <div className="mt-5 space-y-2.5">
              {/* Button 1: Solid Bronze Call Reception */}
              <button
                type="button"
                onClick={handlePhoneClick}
                className="w-full flex items-center justify-between py-3 px-4 rounded-xl bg-[#705535] hover:bg-[#5B4429] text-white text-xs sm:text-sm font-semibold transition shadow-xs active:scale-98 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-white/90" />
                  <span>Call Reception: {phoneDisplay}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-white/90" />
              </button>

              {/* Button 2: Chat via WhatsApp */}
              <button
                type="button"
                onClick={handleWhatsAppClick}
                className="w-full flex items-center justify-between py-3 px-4 rounded-xl bg-[#EDEBE7] hover:bg-[#E2DFD9] text-[#2E2721] text-xs sm:text-sm font-semibold border border-[#DFDCD6] transition active:scale-98 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <WhatsAppIcon className="w-4 h-4 text-[#2E2721]" />
                  <span>Chat via WhatsApp</span>
                </div>
                <ExternalLink className="w-4 h-4 text-[#665E55]" />
              </button>
            </div>
          </section>

          {/* SERVICE 4: Hotel Information */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#EFE9DF] flex flex-col justify-between hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] transition-all">
            <div>
              <div
                onClick={() => setIsHotelInfoOpen(true)}
                className="flex items-start justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-start gap-3.5">
                  {/* Soft Peach Book Icon Box */}
                  <div className="w-12 h-12 rounded-xl bg-[#FDEFE0] text-[#715535] flex items-center justify-center shrink-0 group-hover:bg-[#F8E3CD] transition-colors">
                    <BookOpen className="w-6 h-6 text-[#715535]" />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-[#7E7469] leading-none">
                      PROVIDED BY {hotelNameDisplay}
                    </p>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#201A15] mt-1 leading-tight">
                      Hotel Information
                    </h3>
                  </div>
                </div>

                {/* Arrow Circle */}
                <div className="w-9 h-9 rounded-full bg-[#F6F2EC] flex items-center justify-center text-[#4B4239] group-hover:bg-[#EAE2D7] group-hover:text-[#231E18] transition-colors shrink-0 mt-0.5">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#665E55] mt-3 leading-relaxed">
                Access resort directory, dining hours, pool &amp; spa guides, Wi-Fi details, and amenities.
              </p>
            </div>

            {/* Quick Directory Highlights */}
            <div className="mt-4 pt-3 border-t border-[#F2ECE3] flex items-center justify-between text-xs text-[#7B7268]">
              <span>Infinity Pool: 7:00 AM – 10:00 PM</span>
              <button
                type="button"
                onClick={() => setIsHotelInfoOpen(true)}
                className="font-bold text-[#715535] hover:underline cursor-pointer"
              >
                View Guide →
              </button>
            </div>
          </section>
        </div>

        {/* Footer Brand Notes */}
        <footer className="pt-4 pb-4 text-center space-y-1">
          <p className="text-[10px] sm:text-xs font-bold tracking-widest text-[#7C7164] uppercase">
            • NIVORA LUXURY HOSPITALITY •
          </p>
          <p className="text-[11px] sm:text-xs text-[#867B6E]">
            Powered by Nivora Concierge • Elevate Every Stay
          </p>
        </footer>
      </main>

      {/* Fixed Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAE3D8] shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-around h-16 px-4">
          {/* 1. Home (Active) */}
          <Link
            href="/guest"
            className="flex flex-col items-center justify-center gap-1 text-[#715535] font-bold text-xs"
          >
            <Home className="w-5 h-5 text-[#715535] stroke-[2.2]" />
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

      {/* Room Service Interactive Request Modal */}
      <RoomServiceRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultCategory={selectedCategory}
        defaultItem={selectedItem}
      />

      {/* Hotel Information Quick Directory Modal */}
      {isHotelInfoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#EFE9DF] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE3]">
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-[#715535]">
                  RESORT COMPENDIUM
                </p>
                <h3 className="font-serif text-2xl font-bold text-[#231E18]">
                  Hotel Information
                </h3>
              </div>
              <button
                onClick={() => setIsHotelInfoOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F6F2EC] flex items-center justify-center text-[#4B4239] hover:bg-[#EAE2D7] transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-[#554C42] max-h-[60vh] overflow-y-auto pr-1">
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DF]">
                <h4 className="font-bold text-[#231E18] mb-1">🍽 Dining &amp; Room Service</h4>
                <p>Breakfast: 6:30 AM – 10:30 AM (In-Room or Azure Terrace)</p>
                <p>All-Day Dining: 11:00 AM – 11:30 PM</p>
                <p>Late Night Bites: Available 24/7 via In-Room Dining</p>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DF]">
                <h4 className="font-bold text-[#231E18] mb-1">🏊 Pool &amp; Wellness Spa</h4>
                <p>Infinity Lagoon Pool: 7:00 AM – 10:00 PM</p>
                <p>Aura Thermal Spa: 9:00 AM – 8:00 PM (Reservations required)</p>
                <p>24/7 Wellness Fitness Pavilion (Keycard access)</p>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DF]">
                <h4 className="font-bold text-[#231E18] mb-1">📶 Wi-Fi &amp; Digital Services</h4>
                <p>Network: <strong className="text-[#231E18]">NIVORA-LUXE-GUEST</strong></p>
                <p>Password: <strong className="text-[#231E18]">Complimentary (No password needed)</strong></p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsHotelInfoOpen(false)}
              className="w-full py-3 rounded-xl bg-[#715535] hover:bg-[#5C452A] text-white font-semibold text-xs transition cursor-pointer"
            >
              Close Directory
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GuestHomeScreen() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#715535] border-t-transparent animate-spin" />
      </div>
    }>
      <GuestHomeContent />
    </Suspense>
  );
}
