'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  LogOut,
  LayoutDashboard,
  ChefHat,
  BellRing,
  UtensilsCrossed,
  Bed,
  QrCode,
  Sliders,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Printer,
  Bell,
  CreditCard,
  Check,
  ShieldCheck,
  Lock,
  Search,
  RotateCw,
  FileText,
  AlertCircle,
  Shield,
  X,
} from 'lucide-react';
import { useNivora } from '@/context/NivoraContext';

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

function SteamingPanIcon({ className = 'w-4 h-4' }: { className?: string }) {
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
      <path d="M3 11h18v6a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-6z" />
      <path d="M2 11h20" />
      <path d="M8 4c0 1.5 1 2.5 1 4" />
      <path d="M12 3c0 2 1 3 1 5" />
      <path d="M16 4c0 1.5 1 2.5 1 4" />
    </svg>
  );
}

function OrderDetailsAdminContent() {
  const searchParams = useSearchParams();
  const { orders } = useNivora();

  const queryId = searchParams.get('id');
  const ticketNumber = queryId || '#NV-4';

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [orderState, setOrderState] = useState<'preparing' | 'ready' | 'voided'>('preparing');

  // Template toggle mode: {var} vs live data
  const initialMode = searchParams.get('mode');
  const [isLiteralMockup, setIsLiteralMockup] = useState(initialMode !== 'live');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePrintSlip = () => {
    showToast('Kitchen slip sent to Garde Manger thermal printer.');
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleNotifyButler = () => {
    showToast('Push alert dispatched to Floor 4 Butler Marco V. via pager.');
  };

  const handleMarkReady = () => {
    setOrderState('ready');
    showToast('Order #NV-4 marked READY FOR BUTLER. Handover alert sent.');
  };

  const handleVoidTicket = () => {
    setOrderState('voided');
    showToast('Order ticket voided. Supervisor authorization recorded.');
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] text-[#221B14] selection:bg-[#705535]/20 selection:text-[#221B14] flex flex-col justify-between antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-full bg-[#2A231C] px-5 py-2.5 text-xs font-medium text-white shadow-xl flex items-center gap-2 border border-[#44382F] animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Sidebar */}
        <aside className="w-full lg:w-60 xl:w-64 bg-[#FAF8F5] border-b lg:border-b-0 lg:border-r border-[#EAE3D9] p-5 sm:p-6 flex flex-col justify-between shrink-0 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
          <div className="space-y-6">
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#705535] text-white flex items-center justify-center font-serif text-lg font-bold shadow-xs">
                N
              </div>

              <div>
                <h1 className="font-serif text-base font-bold text-[#201A15] leading-none">
                  Nivora
                </h1>
                <p className="text-[9px] font-bold tracking-[0.2em] text-[#8A8074] uppercase mt-1">
                  CONCIERGE
                </p>
              </div>
            </div>

            {/* Sidebar Navigation */}
            <div className="space-y-1">
              <p className="text-[9px] font-bold uppercase tracking-wider text-[#8A8074] px-3 pb-1">
                OPERATIONS
              </p>

              {/* 1. Dashboard */}
              <Link
                href="/admin"
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-[#5A5046] hover:bg-[#F2EDE7]"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              {/* 2. Orders (ACTIVE) */}
              <Link
                href="/admin/orders"
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition bg-[#85653C] text-white shadow-xs"
              >
                <ClocheIcon className="w-4 h-4 text-white" />
                <span>Orders</span>
              </Link>

              {/* 3. Room Requests */}
              <Link
                href="/admin/requests"
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-[#5A5046] hover:bg-[#F2EDE7]"
              >
                <ConciergeHandBellIcon className="w-4 h-4" />
                <span>Room Requests</span>
              </Link>

              {/* 4. Menu */}
              <Link
                href="/admin/menu"
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-[#5A5046] hover:bg-[#F2EDE7]"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Menu</span>
              </Link>

              {/* 5. Rooms */}
              <Link
                href="/admin/rooms"
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-[#5A5046] hover:bg-[#F2EDE7]"
              >
                <Bed className="w-4 h-4" />
                <span>Rooms</span>
              </Link>

              {/* 6. QR Codes */}
              <Link
                href="/admin/qr"
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-[#5A5046] hover:bg-[#F2EDE7]"
              >
                <QrCode className="w-4 h-4" />
                <span>QR Codes</span>
              </Link>

              {/* 7. Settings */}
              <Link
                href="/admin/settings"
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-[#5A5046] hover:bg-[#F2EDE7]"
              >
                <Sliders className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </div>
          </div>

          {/* Bottom Live Pill Status */}
          <div className="pt-6">
            <div className="bg-[#F2EDE7] rounded-xl px-3.5 py-2.5 border border-[#E8E2D8] space-y-1 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="text-xs font-bold text-[#5A5046]">Kitchen Live</span>
                </div>
                <span className="bg-[#FDF0E2] text-[#8C5D29] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Active
                </span>
              </div>
              <p className="text-[10px] text-[#8A8074]">Dispatch and room line open</p>
            </div>
          </div>
        </aside>

        {/* Right Main Content Area */}
        <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 w-full max-w-[1500px] mx-auto">
          {/* Breadcrumb & Top Bar */}
          <div className="flex items-center justify-between">
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-[#7A6F63]">
              <span>Operations</span>
              <span className="text-[#C2B7A8]">&gt;</span>
              <Link href="/admin/orders" className="hover:underline">
                Food Orders
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsLiteralMockup((v) => !v)}
                className="text-[9px] font-bold px-2.5 py-1 rounded-md bg-[#F2EDE7] text-[#7A6F63] hover:text-[#201A15] border border-[#E5DFD5] transition cursor-pointer"
                title="Toggle between Template Mockup and Live View"
              >
                {isLiteralMockup ? '{var}' : 'live'}
              </button>

              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5A5046] hover:text-[#201A15] transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </Link>
            </div>
          </div>

          {/* Action Toolbar Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Back to Orders Button */}
              <Link
                href="/admin/orders"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E8E2D8] text-xs font-bold text-[#201A15] hover:bg-[#FAF7F2] transition shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Orders</span>
              </Link>

              {/* Kitchen Ticket Badge */}
              <span className="bg-[#FDF0E2] border border-[#F6D7BC] text-[#8C5D29] text-xs font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider">
                KITCHEN TICKET {ticketNumber}
              </span>

              {/* Station Sub-info */}
              <span className="text-xs text-[#7A6F63]">
                • Line Item Expediter Station 2
              </span>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handlePrintSlip}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E8E2D8] text-xs font-bold text-[#201A15] rounded-xl hover:bg-[#FAF7F2] transition shadow-2xs cursor-pointer active:scale-95"
              >
                <Printer className="w-3.5 h-3.5 text-[#705535]" />
                <span>Print Slip</span>
              </button>

              <button
                type="button"
                onClick={handleNotifyButler}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E8E2D8] text-xs font-bold text-[#201A15] rounded-xl hover:bg-[#FAF7F2] transition shadow-2xs cursor-pointer active:scale-95"
              >
                <Bell className="w-3.5 h-3.5 text-[#705535]" />
                <span>Notify Butler</span>
              </button>

              <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A8074] bg-[#F2EDE7] px-3 py-1.5 rounded-xl border border-[#E5DFD5]">
                FOLIO AUTO-ROUTED
              </span>
            </div>
          </div>

          {/* Card 1: Order ID & Target Dispatch Header Card */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EFE9DF] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#201A15] tracking-tight">
                  Order ID
                </h2>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF0E2] text-[#8C5D29] border border-[#F6E3CF] text-xs font-bold">
                  <Bed className="w-3.5 h-3.5 text-[#8C5D29]" />
                  <span>ROOM • Villa Del Mar</span>
                </div>
              </div>

              <div>
                <span className="inline-block bg-[#FDF0E2] text-[#8C5D29] text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  GARDE MANGER PRIORITY
                </span>
              </div>

              <p className="text-xs text-[#7A6F63] pt-1">
                Placed: Today, 12:48 PM • Updated: 12:51 PM (3m elapsed) • 📲 Direct Guest QR Terminal
              </p>
            </div>

            {/* Target Dispatch Box */}
            <div className="bg-[#FAF7F2] border border-[#ECE5DB] rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs shrink-0">
              <div className="w-10 h-10 rounded-xl bg-[#F4EFEB] flex items-center justify-center text-[#705535] shrink-0 border border-[#EAE3D9]">
                <Clock className="w-5 h-5 text-[#705535]" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#8A8074]">
                  TARGET DISPATCH
                </p>
                <p className="font-bold text-sm text-[#201A15]">
                  13:10 PM <span className="text-xs text-[#C27E43] font-bold">(~19 mins remaining)</span>
                </p>
              </div>
            </div>
          </section>

          {/* Card 2: Active Progression & Station Actions */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EFE9DF] shadow-2xs space-y-6">
            {/* Top Row: Station status & Action buttons */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#705535] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <SteamingPanIcon className="w-5 h-5 text-white" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">
                      ACTIVE PROGRESSION
                    </span>
                    <span className="inline-block bg-[#FDF0E2] border border-[#F6E3CF] text-[#8C5D29] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                      PREPARING
                    </span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-[#201A15]">
                    Culinary team is assembling this order at Main Garde Manger Station
                  </h3>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="shrink-0 space-y-1 text-right">
                <div className="flex items-center gap-2 justify-end">
                  <button
                    type="button"
                    onClick={handleVoidTicket}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E8E2D8] bg-[#F8F5F0] text-xs font-bold text-[#5A5046] hover:bg-[#F2ECE3] transition cursor-pointer active:scale-95"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Void Ticket</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleMarkReady}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#705535] hover:bg-[#5C452A] text-white text-xs font-bold shadow-md transition cursor-pointer active:scale-98"
                  >
                    <ClocheIcon className="w-4 h-4 text-white" />
                    <span>Mark Ready for Butler</span>
                  </button>
                </div>

                <p className="text-[9px] font-bold uppercase tracking-wider text-[#8A8074]">
                  AUTHORIZED ACTION FOR GARDE MANGER STATION
                </p>
              </div>
            </div>

            {/* Horizontal 5-Step Timeline */}
            <div className="pt-2 border-t border-[#F2ECE3]">
              <div className="relative flex items-center justify-between">
                {/* Background Connecting Line */}
                <div className="absolute top-3 left-6 right-6 h-[2px] bg-[#EAE3D9] z-0" />

                {/* Step 1: New */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-6 h-6 rounded-full bg-[#705535] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div className="mt-2 text-[10px] sm:text-[11px] leading-tight">
                    <p className="font-bold text-[#201A15]">New</p>
                    <p className="text-[#8A8074] text-[10px]">12:48 PM</p>
                  </div>
                </div>

                {/* Step 2: Accepted */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-6 h-6 rounded-full bg-[#705535] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div className="mt-2 text-[10px] sm:text-[11px] leading-tight">
                    <p className="font-bold text-[#201A15]">Accepted</p>
                    <p className="text-[#8A8074] text-[10px]">12:49 PM</p>
                  </div>
                </div>

                {/* Step 3: Preparing (Active) */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-7 h-7 rounded-full bg-[#FCEEE1] border border-[#F6D7BC] text-[#8C5D29] flex items-center justify-center shadow-xs -my-0.5">
                    <SteamingPanIcon className="w-3.5 h-3.5 text-[#8C5D29]" />
                  </div>
                  <div className="mt-1.5 text-[10px] sm:text-[11px] leading-tight">
                    <p className="font-bold text-[#705535]">Preparing</p>
                    <p className="text-[#C27E43] font-bold text-[10px]">Active • 12:51 PM</p>
                  </div>
                </div>

                {/* Step 4: Ready */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-6 h-6 rounded-full bg-[#F4EFEB] border border-[#E5DFD5] flex items-center justify-center text-[#A89F93]">
                    <ClocheIcon className="w-3.5 h-3.5 text-[#A89F93]" />
                  </div>
                  <div className="mt-2 text-[10px] sm:text-[11px] leading-tight">
                    <p className="font-bold text-[#695D50]">Ready</p>
                    <p className="text-[#A89F93] text-[10px]">Est. 13:05 PM</p>
                  </div>
                </div>

                {/* Step 5: Delivered */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-6 h-6 rounded-full bg-[#F4EFEB] border border-[#E5DFD5] flex items-center justify-center text-[#A89F93]">
                    <Check className="w-3.5 h-3.5 text-[#A89F93]" />
                  </div>
                  <div className="mt-2 text-[10px] sm:text-[11px] leading-tight">
                    <p className="font-bold text-[#695D50]">Delivered</p>
                    <p className="text-[#A89F93] text-[10px]">Pending Butler</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Two-Column Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column (Span 7): Order Items & Folio Ledger */}
            <div className="lg:col-span-7 space-y-5">
              {/* Card 3: Order Items */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EFE9DF] shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#F2ECE3] pb-3">
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="w-4 h-4 text-[#705535]" />
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#201A15]">
                      Order Items (3 items)
                    </h3>
                  </div>

                  <span className="inline-block bg-[#EAE4DC] text-[#695D50] text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    🔒 HISTORICAL SNAPSHOT • IMMUTABLE
                  </span>
                </div>

                {/* Dish Item 1 */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {/* Square Photo */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#F2EDE7] shrink-0 relative border border-[#E8E2D8]">
                        <Image
                          src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80"
                          alt="Artisanal Wagyu Burger"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm sm:text-base text-[#201A15]">
                            2× Artisanal Wagyu Burger
                          </h4>
                          <span className="bg-[#FDF0E2] text-[#8C5D29] text-[9px] font-bold px-2 py-0.5 rounded-full">
                            Chef Choice
                          </span>
                        </div>
                        <p className="text-xs text-[#7A6F63]">
                          Selected options: Brioche Bun, Truffle Aioli, Aged Cheddar, Medium-Rare
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-bold text-sm sm:text-base text-[#201A15]">
                        ₹1,850
                      </p>
                      <p className="text-[11px] text-[#8A8074]">2 × ₹925</p>
                    </div>
                  </div>

                  {/* Kitchen Note */}
                  <div className="bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3.5 py-2 text-xs italic text-[#554C42] flex items-center gap-2">
                    <UtensilsCrossed className="w-3.5 h-3.5 text-[#705535] shrink-0 not-italic" />
                    <span>
                      Kitchen Note: “Please cut in half, extra napkins requested”
                    </span>
                  </div>
                </div>

                {/* Dish Item 2 */}
                <div className="space-y-2 pt-2 border-t border-[#F2ECE3]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {/* Square Photo */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#F2EDE7] shrink-0 relative border border-[#E8E2D8]">
                        <Image
                          src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=300&q=80"
                          alt="San Pellegrino Sparkling"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm sm:text-base text-[#201A15]">
                            1× San Pellegrino Sparkling (750ml)
                          </h4>
                          <span className="bg-[#EDE7DE] text-[#695D50] text-[9px] font-bold px-2 py-0.5 rounded-full">
                            Beverage
                          </span>
                        </div>
                        <p className="text-xs text-[#7A6F63]">
                          Selected options: Chilled, Fresh Lemon Slices
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-bold text-sm sm:text-base text-[#201A15]">
                        ₹350
                      </p>
                      <p className="text-[11px] text-[#8A8074]">1 × ₹350</p>
                    </div>
                  </div>

                  {/* Pantry Note */}
                  <div className="bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3.5 py-2 text-xs italic text-[#554C42] flex items-center gap-2">
                    <span className="not-italic text-sm">🍸</span>
                    <span>
                      Pantry Note: “Serve with 2 chilled crystal highball glasses”
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 4: Folio Ledger Integration */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EFE9DF] shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#F2ECE3] pb-3">
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#201A15]">
                    Folio Ledger Integration
                  </h3>

                  <span className="inline-flex items-center gap-1 bg-[#FDF0E2] text-[#8C5D29] border border-[#F6E3CF] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>PRE-AUTHORIZED</span>
                  </span>
                </div>

                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between items-center text-[#554C42]">
                    <span>Culinary Subtotal (2 dishes, 3 units)</span>
                    <span className="font-bold text-[#201A15]">₹2,200</span>
                  </div>

                  <div className="flex justify-between items-center text-[#554C42]">
                    <span>In-ROOM Presentation Service</span>
                    <span className="text-[11px] font-bold uppercase text-[#85653C]">
                      COMPLIMENTARY (IN-VILLA TIER)
                    </span>
                  </div>
                </div>

                {/* Grand Total */}
                <div className="pt-3 border-t border-[#F2ECE3] flex justify-between items-baseline">
                  <div>
                    <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#201A15]">
                      Folio Ledger Total
                    </h4>
                    <p className="text-[11px] text-[#7A6F63]">
                      Zero external payment gateways • Internal Folio charge
                    </p>
                  </div>

                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#705535]">
                    ₹2,200
                  </span>
                </div>

                {/* Billing Destination Container */}
                <div className="bg-[#FAF7F2] border border-[#ECE5DB] rounded-xl p-3.5 flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-[#705535] shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-[#201A15]">Billing Destination</p>
                    <p className="text-[#7A6F63]">
                      Charged directly to ROOM Folio #9821 • Verified by Room Token
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (Span 5): Room & Destination, Delivery Protocol, Service Handover */}
            <div className="lg:col-span-5 space-y-5">
              {/* Card 5: Room & Destination */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EFE9DF] shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#F2ECE3] pb-3">
                  <div className="flex items-center gap-2">
                    <Bed className="w-4 h-4 text-[#705535]" />
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#201A15]">
                      Room &amp; Destination
                    </h3>
                  </div>

                  <span className="bg-[#FDF0E2] text-[#8C5D29] text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    VIP OCCUPIED
                  </span>
                </div>

                {/* 2x2 Grid Info */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-[#FAF7F2] border border-[#ECE5DB] rounded-xl p-3 space-y-0.5">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#8A8074]">
                      ROOM ASSIGNED
                    </p>
                    <p className="font-bold text-sm text-[#201A15]">
                      {isLiteralMockup ? 'ROOM' : 'ROOM 305'}
                    </p>
                  </div>

                  <div className="bg-[#FAF7F2] border border-[#ECE5DB] rounded-xl p-3 space-y-0.5">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#8A8074]">
                      WING / PAVILION
                    </p>
                    <p className="font-bold text-xs text-[#201A15]">
                      Villa Del Mar (West)
                    </p>
                  </div>

                  <div className="bg-[#FAF7F2] border border-[#ECE5DB] rounded-xl p-3 space-y-0.5">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#8A8074]">
                      ELEVATION
                    </p>
                    <p className="font-bold text-xs text-[#201A15]">
                      Floor 4 (Ocean Front)
                    </p>
                  </div>

                  <div className="bg-[#FAF7F2] border border-[#ECE5DB] rounded-xl p-3 space-y-0.5">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#8A8074]">
                      SERVICE STATION
                    </p>
                    <p className="font-bold text-xs text-[#201A15]">
                      North Butler Pantry
                    </p>
                  </div>
                </div>

                {/* Room Delivery Protocol Box */}
                <div className="bg-[#FAF7F2] border border-[#ECE5DB] rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center gap-1.5 text-[#8C5D29]">
                    <ShieldCheck className="w-4 h-4 text-[#8C5D29]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      ROOM DELIVERY PROTOCOL
                    </span>
                  </div>

                  <p className="text-xs italic text-[#554C42] leading-relaxed">
                    “Ring doorbell once, do not knock loud. High privacy ROOM. Silver cloche presentation required.”
                  </p>

                  <div className="pt-1 flex items-center justify-between text-[11px] text-[#7A6F63]">
                    <span>Verified ROOM Preference Entry</span>
                    <span className="bg-[#EAE4DC] text-[#695D50] text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                      STRICT
                    </span>
                  </div>
                </div>

                {/* Privacy Guarantee Note */}
                <div className="flex items-center gap-2 text-[10px] text-[#8A8074] pt-1">
                  <Shield className="w-3.5 h-3.5 text-[#8A8074] shrink-0" />
                  <span>
                    Personal identities withheld per discrete luxury protocol.
                  </span>
                </div>
              </div>

              {/* Card 6: Service Handover */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EFE9DF] shadow-2xs space-y-3.5">
                <div className="flex items-center gap-2 border-b border-[#F2ECE3] pb-3">
                  <ConciergeHandBellIcon className="w-4 h-4 text-[#705535]" />
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#201A15]">
                    Service Handover
                  </h3>
                </div>

                {/* Pantry Runner Assigned */}
                <div className="bg-[#FAF7F2] border border-[#ECE5DB] rounded-xl p-3.5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#EAE2D8] text-[#705535] font-bold text-xs flex items-center justify-center shrink-0 border border-[#DDD3C7]">
                    NB
                  </div>

                  <div className="space-y-0.5 text-xs">
                    <p className="font-bold text-[#201A15]">Pantry Runner Assigned</p>
                    <p className="text-[#7A6F63]">
                      Terminal B • Heated Cart #4 staged at North Elevator Bank
                    </p>
                  </div>
                </div>

                <p className="text-[11px] text-[#7A6F63] pt-0.5">
                  Butler Response Acknowledged: <strong>12:50 PM by Marco V.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Page Footer */}
      <footer className="w-full px-6 sm:px-10 lg:px-12 py-4 border-t border-[#EAE3D9] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#7A6F63]">
        {/* Left: Copyright & Security Note */}
        <div className="flex items-center gap-2 text-center sm:text-left">
          <Lock className="w-3.5 h-3.5 text-[#8A8074] shrink-0" />
          <span>
            © 2026 Nivora Luxury Resorts &amp; Residences. Internal staff credentials strictly monitored.
          </span>
        </div>

        {/* Right: Security Protocol & Desk Links */}
        <div className="flex items-center gap-4 font-semibold text-[#665D52]">
          <span className="hover:text-[#201A15] transition cursor-pointer">
            Security Protocol
          </span>
          <span className="text-[#C2B7A8]">•</span>
          <a
            href="mailto:it.concierge@nivora.resorts"
            className="hover:text-[#201A15] transition"
          >
            IT Concierge Desk
          </a>
        </div>
      </footer>
    </div>
  );
}

export default function AdminOrderDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#705535] border-t-transparent animate-spin" />
        </div>
      }
    >
      <OrderDetailsAdminContent />
    </Suspense>
  );
}
