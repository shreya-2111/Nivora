'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  Clock,
  Phone,
  QrCode,
  KeyRound,
  Sparkles,
  ChevronRight,
  Droplets,
  BedDouble,
  Shirt,
  Wrench,
  UtensilsCrossed,
  Headphones,
  Check,
  CheckCircle2,
} from 'lucide-react';
import { useNivora } from '@/context/NivoraContext';
import { RoomServiceRequestModal } from '@/components/guest/RoomServiceRequestModal';

/* Custom SVG Icons for exact 1:1 visual match to mockup */
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

function WelcomeGuestContent() {
  const { guest } = useNivora();
  const searchParams = useSearchParams();

  // If a room parameter is provided in QR link, e.g. /?room=304
  const queryRoom = searchParams.get('room');
  const roomDisplay = queryRoom ? `Room ${queryRoom}` : '{room_number}';
  const phoneDisplay = '{hotel_phone}';

  // Room service request modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Housekeeping & Linen');
  const [selectedItem, setSelectedItem] = useState<string>('');

  // Toast notice for phone copy/call
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
        showToast('Direct line copied (+1 800-555-0199) • Calling Concierge...');
        window.location.href = `tel:${phone}`;
      } catch {
        window.location.href = `tel:${phone}`;
      }
    }
  };

  const handleWhatsAppClick = () => {
    const text = encodeURIComponent(
      `Hello Nivora Concierge, I am reaching out from Room ${guest.roomNumber || '304'}. Could you please assist me?`
    );
    window.open(`https://wa.me/18005550199?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] text-[#221B14] selection:bg-[#715535]/20 selection:text-[#221B14] pb-16 antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-full bg-[#2A231C] px-5 py-2.5 text-xs font-medium text-white shadow-xl flex items-center gap-2 border border-[#44382F] animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container - Full Width with Responsive Max Width */}
      <main className="w-full max-w-2xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 space-y-4 sm:space-y-6">
        {/* Top Header */}
        <header className="flex items-center justify-between pt-1 pb-1">
          <div className="flex items-center gap-3.5">
            {/* Circular Monogram Badge */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#715535] flex items-center justify-center text-white shadow-xs shrink-0">
              <span className="font-serif font-bold text-lg sm:text-xl leading-none select-none">N</span>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-[#231E18] tracking-tight leading-none">
                Nivora Concierge
              </h1>
              <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] text-[#82776C] uppercase leading-none mt-1.5">
                ELEVATE EVERY STAY
              </p>
            </div>
          </div>

          {/* Quick Stay Status pill on desktop & Admin link */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-2 rounded-full border border-[#E8E1D5] bg-white px-3.5 py-1.5 text-xs font-medium text-[#685D51] shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>VIP Verified Stay</span>
              <span className="text-[#BDB2A4]">•</span>
              <span>Room Service Active</span>
            </div>

            <Link
              href="/admin/login"
              className="text-xs font-semibold text-[#82776C] hover:text-[#715535] transition px-2.5 py-1 rounded-lg hover:bg-[#F2EDE7]"
            >
              Admin ↗
            </Link>
          </div>
        </header>

        {/* Hero Card with Clean Balcony Resort Image */}
        <section className="relative w-full h-[240px] sm:h-[300px] md:h-[360px] lg:h-[400px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs select-none">
          {/* Background Resort Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-clean.jpg"
            alt="Nivora luxury resort ocean view"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Luxury soft gradient overlay for readable typography */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

          {/* Top Left Badge: VERIFIED STAY */}
          <div className="absolute top-4 left-4 sm:top-5 sm:left-5">
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/25 text-[10px] sm:text-xs font-semibold tracking-wider text-white uppercase shadow-xs">
              VERIFIED STAY
            </span>
          </div>

          {/* Bottom Welcome Text */}
          <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 text-white max-w-2xl">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal leading-tight tracking-normal drop-shadow-sm">
              Welcome
            </h2>
            <p className="text-white/90 text-xs sm:text-sm md:text-base font-light mt-1 sm:mt-1.5 drop-shadow-xs leading-normal">
              Everything you need, right at your fingertips.
            </p>
          </div>
        </section>

        {/* YOUR SPACE Card */}
        <section className="w-full bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#EFE9DF]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {/* Cloche Icon Box */}
              <div className="w-12 h-12 rounded-xl bg-[#F6F2EC] flex items-center justify-center text-[#715535] shrink-0">
                <ClocheIcon className="w-6 h-6 text-[#715535]" />
              </div>

              <div>
                <p className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-[#8C8276] leading-none">
                  YOUR SPACE
                </p>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#231E18] leading-tight mt-1">
                  {roomDisplay}
                </p>
              </div>
            </div>

            {/* IDENTIFIED Pill Badge */}
            <div className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FBF0E4] text-[#87552A] border border-[#F5DEC9] text-xs font-bold tracking-wide shrink-0">
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#87552A] text-white">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </span>
              <span>IDENTIFIED</span>
            </div>
          </div>

          {/* Sub-bar / Verification Details */}
          <div className="mt-4 pt-4 border-t border-[#F2ECE3] flex items-center justify-between text-xs sm:text-sm text-[#7B7268]">
            <span className="flex items-center gap-2">
              <span className="text-[#715535] font-bold">•</span>
              <span>Linked to QR in your ROOM</span>
            </span>
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#7B7268]">
              AUTOMATIC LOCK
            </span>
          </div>
        </section>

        {/* Section Header: AVAILABLE SERVICES */}
        <div className="flex items-center justify-between pt-2 pb-0.5 px-1">
          <h3 className="text-xs sm:text-sm font-bold tracking-wider text-[#524941] uppercase">
            AVAILABLE SERVICES
          </h3>
          <span className="text-xs sm:text-sm font-medium text-[#7D7368]">
            Direct In-ROOM Access
          </span>
        </div>

        {/* Responsive Grid for Services (Full width 1 col on mobile, 3 cols on large screens) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* SERVICE 1: Order Food */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#EFE9DF] transition-all hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] flex flex-col justify-between">
            <div>
              <Link href="/guest/menu" className="block group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    {/* Bronze Cutlery Icon Box */}
                    <div className="w-12 h-12 rounded-xl bg-[#715535] text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                      <UtensilsCrossed className="w-6 h-6 stroke-[1.8]" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#201A15] leading-tight">
                          Order Food
                        </h4>
                        <span className="inline-block bg-[#EFE8E1] text-[#63584D] text-[9px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full">
                          KITCHEN OPEN
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-[#665E55] mt-2 leading-relaxed">
                        Browse the hotel&apos;s dining menu
                      </p>
                      <p className="text-xs sm:text-sm text-[#665E55] mt-0.5 leading-relaxed">
                        • Add food to cart • Place an order
                      </p>
                    </div>
                  </div>

                  {/* Arrow Circle */}
                  <div className="w-9 h-9 rounded-full bg-[#F6F2EC] flex items-center justify-center text-[#4B4239] group-hover:bg-[#EAE2D7] group-hover:text-[#231E18] transition-colors shrink-0 mt-0.5">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </div>

            {/* Delivery Estimate & Explore CTA Bar */}
            <div className="mt-5 bg-[#FAF7F2] rounded-xl p-3.5 border border-[#EFE8DF] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#5D554C]">
                <Clock className="w-4 h-4 text-[#715535] shrink-0" />
                <span className="truncate">
                  Delivery to ROOM {roomDisplay}: approx. 25–35 mins
                </span>
              </div>

              <Link
                href="/guest/menu"
                className="text-[11px] sm:text-xs font-bold text-[#715535] hover:text-[#523C22] tracking-wide uppercase whitespace-nowrap flex items-center gap-1 hover:underline transition shrink-0"
              >
                <span>EXPLORE MENU</span>
                <span>→</span>
              </Link>
            </div>
          </section>

          {/* SERVICE 2: Room Service */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#EFE9DF] transition-all hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] flex flex-col justify-between">
            <div>
              <Link
                href="/guest/services"
                className="flex items-start justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-start gap-3.5">
                  {/* Soft Beige Bellhop Icon Box */}
                  <div className="w-12 h-12 rounded-xl bg-[#F6F2EC] text-[#715535] flex items-center justify-center shrink-0 group-hover:bg-[#ECE4DB] transition-colors">
                    <ConciergeHandBellIcon className="w-6 h-6 text-[#715535]" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#201A15] leading-tight">
                        Room Service
                      </h4>
                      <span className="inline-block bg-[#E8E3DD] text-[#5A524A] text-[9px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full">
                        ATTENDANT ON DUTY
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#665E55] mt-2 leading-relaxed">
                      Quick assistance &amp; comfort essentials sent directly to your door.
                    </p>
                  </div>
                </div>

                {/* Arrow Circle */}
                <div className="w-9 h-9 rounded-full bg-[#F6F2EC] flex items-center justify-center text-[#4B4239] group-hover:bg-[#EAE2D7] group-hover:text-[#231E18] transition-colors shrink-0 mt-0.5">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </div>

            {/* Quick Service Amenity Chips */}
            <div className="mt-4 flex flex-wrap gap-2 pt-1">
              {/* Towels */}
              <Link
                href="/guest/services?category=towels"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4EFEB] hover:bg-[#EAE3D9] text-[#463F37] text-xs font-medium border border-[#E5DFD6] transition-colors active:scale-95 cursor-pointer"
              >
                <TowelsIcon className="w-3.5 h-3.5 text-[#715535]" />
                <span>Towels</span>
              </Link>

              {/* Water */}
              <Link
                href="/guest/services?category=water"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4EFEB] hover:bg-[#EAE3D9] text-[#463F37] text-xs font-medium border border-[#E5DFD6] transition-colors active:scale-95 cursor-pointer"
              >
                <Droplets className="w-3.5 h-3.5 text-[#715535]" />
                <span>Water</span>
              </Link>

              {/* Toiletries */}
              <Link
                href="/guest/services?category=toiletries"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4EFEB] hover:bg-[#EAE3D9] text-[#463F37] text-xs font-medium border border-[#E5DFD6] transition-colors active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#715535]" />
                <span>Toiletries</span>
              </Link>

              {/* Housekeeping */}
              <Link
                href="/guest/services?category=housekeeping"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4EFEB] hover:bg-[#EAE3D9] text-[#463F37] text-xs font-medium border border-[#E5DFD6] transition-colors active:scale-95 cursor-pointer"
              >
                <BedDouble className="w-3.5 h-3.5 text-[#715535]" />
                <span>Housekeeping</span>
              </Link>

              {/* Laundry */}
              <Link
                href="/guest/services?category=laundry"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4EFEB] hover:bg-[#EAE3D9] text-[#463F37] text-xs font-medium border border-[#E5DFD6] transition-colors active:scale-95 cursor-pointer"
              >
                <Shirt className="w-3.5 h-3.5 text-[#715535]" />
                <span>Laundry</span>
              </Link>

              {/* Maintenance */}
              <Link
                href="/guest/services?category=maintenance"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4EFEB] hover:bg-[#EAE3D9] text-[#463F37] text-xs font-medium border border-[#E5DFD6] transition-colors active:scale-95 cursor-pointer"
              >
                <Wrench className="w-3.5 h-3.5 text-[#715535]" />
                <span>Maintenance</span>
              </Link>
            </div>
          </section>

          {/* SERVICE 3: Hotel Assistance */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#EFE9DF] transition-all hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] flex flex-col justify-between">
            <div>
              <div className="flex items-start gap-3.5">
                {/* Soft Beige Headset Icon Box */}
                <div className="w-12 h-12 rounded-xl bg-[#F6F2EC] text-[#715535] flex items-center justify-center shrink-0">
                  <Headphones className="w-6 h-6 text-[#715535]" />
                </div>

                <div>
                  <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#201A15] leading-tight">
                    Hotel Assistance
                  </h4>
                  <p className="text-xs sm:text-sm text-[#665E55] mt-2 leading-relaxed">
                    Contact reception or message the concierge team directly.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Contact Buttons */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              {/* Phone Button */}
              <button
                type="button"
                onClick={handlePhoneClick}
                className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-[#FAF7F2] hover:bg-[#F2ECE3] border border-[#EBE3D8] text-[#342D26] text-xs sm:text-sm font-semibold transition active:scale-98 cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#715535] shrink-0" />
                <span className="truncate">{phoneDisplay}</span>
              </button>

              {/* WhatsApp Button */}
              <button
                type="button"
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-[#FDF1E6] hover:bg-[#FAE3CE] border border-[#F6DCBE] text-[#7E4C21] text-xs sm:text-sm font-semibold transition active:scale-98 cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#7E4C21] shrink-0" />
                <span>WhatsApp</span>
              </button>
            </div>
          </section>
        </div>

        {/* Process Flow Tracker */}
        <section className="w-full bg-[#F6F1EB]/90 border border-[#EAE3D9] rounded-2xl py-4 px-6 sm:px-12 shadow-2xs">
          <div className="flex items-center justify-between text-center max-w-3xl mx-auto">
            {/* Step 1: QR SCANNED */}
            <div className="flex-1 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#715535] text-white flex items-center justify-center mb-1.5 shadow-xs">
                <QrCode className="w-4 h-4" />
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-[#29221B] uppercase tracking-wider">
                QR SCANNED
              </span>
            </div>

            {/* Chevron Divider 1 */}
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#B8ADA1] shrink-0 mx-2 sm:mx-6" />

            {/* Step 2: ROOM VERIFIED */}
            <div className="flex-1 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#715535] text-white flex items-center justify-center mb-1.5 shadow-xs">
                <KeyRound className="w-4 h-4" />
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-[#29221B] uppercase tracking-wider">
                ROOM VERIFIED
              </span>
            </div>

            {/* Chevron Divider 2 */}
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#B8ADA1] shrink-0 mx-2 sm:mx-6" />

            {/* Step 3: FULL ACCESS (Links to Screen 2 — Guest Home) */}
            <Link href="/guest" className="flex-1 flex flex-col items-center group cursor-pointer hover:scale-105 transition-transform" title="Proceed to Guest Home (Screen 2)">
              <div className="w-8 h-8 rounded-full bg-[#EAE2D8] text-[#715535] flex items-center justify-center mb-1.5 border border-[#DACDC0] group-hover:bg-[#715535] group-hover:text-white transition-colors">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-[#8A7F73] group-hover:text-[#715535] uppercase tracking-wider flex items-center gap-1">
                <span>FULL ACCESS</span>
                <span className="text-[9px]">→</span>
              </span>
            </Link>
          </div>
        </section>

        {/* Footer Brand Notes */}
        <footer className="pt-4 pb-10 text-center space-y-1.5">
          <div className="flex items-center justify-center gap-2.5 text-[10px] sm:text-xs font-bold tracking-widest text-[#5A5046] uppercase">
            <span>POWERED BY NIVORA CONCIERGE</span>
            <span>•</span>
            <span>ELEVATE EVERY STAY</span>
          </div>

          <p className="text-xs text-[#867B6E]">
            Scan QR → Room Identified → Access Hotel Services
          </p>

          <p className="pt-2 text-xs font-medium tracking-[0.25em] text-[#A69B8F] uppercase">
            NIVORA LUXURY CONCIERGE
          </p>
        </footer>
      </main>

      {/* Room Service Interactive Request Modal */}
      <RoomServiceRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultCategory={selectedCategory}
        defaultItem={selectedItem}
      />
    </div>
  );
}

export default function GuestWelcomeScreen() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#715535] border-t-transparent animate-spin" />
      </div>
    }>
      <WelcomeGuestContent />
    </Suspense>
  );
}
