'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
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
  Eye,
  X,
  CreditCard,
  Check,
  ShieldCheck,
  Lock,
  Search,
  RotateCw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useNivora } from '@/context/NivoraContext';

/* Custom SVG Icons for Admin */
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

function AdminOrdersContent() {
  const searchParams = useSearchParams();
  const { orders } = useNivora();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'New' | 'Preparing' | 'Ready' | 'Delivered'>('All');
  const [showNewOrderBanner, setShowNewOrderBanner] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Template toggle mode: {var} vs live data
  const initialMode = searchParams.get('mode');
  const [isLiteralMockup, setIsLiteralMockup] = useState(initialMode !== 'live');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Mockup orders list matching screenshot
  const allMockupOrders = useMemo(
    () => [
      {
        id: '#NV-000000',
        room: '{ ROOM :Number }',
        items: '2x Artisanal Burrata Salad, 1x Truffle Wild Mushroom Risotto',
        note: 'Dressing on the side, extra aged parmesan flakes',
        total: '1,850',
        billingNote: 'Charge to Room',
        status: 'NEW ORDER',
        statusCategory: 'New',
        statusBadgeType: 'new',
        time: '12:48 PM',
        timeAgo: '2m ago',
        isUrgentTime: true,
      },
      {
        id: '#NV-000000',
        room: '{ ROOM :Number }',
        items: '1x Pan-Seared Chilean Sea Bass, 1x Royal Club Sandwich',
        note: 'Allergy check: No mayonnaise on sandwich bread',
        total: '2,600',
        billingNote: 'Charge to Room',
        status: 'ACCEPTED',
        statusCategory: 'New',
        statusBadgeType: 'accepted',
        time: '12:39 PM',
        timeAgo: '11m ago',
      },
      {
        id: '#NV-000000',
        room: '{ ROOM :Number }',
        items: '2x Charred Tenderloin Skewers, 2x Fresh Coconut Water',
        note: 'Serve with extra chilled glassware & crushed lime',
        total: '1,950',
        billingNote: 'Charge to Room',
        status: 'PREPARING',
        statusCategory: 'Preparing',
        statusBadgeType: 'preparing',
        time: '12:31 PM',
        timeAgo: '19m ago',
      },
      {
        id: '#NV-000000',
        room: '{ ROOM :Number }',
        items: '1x Imperial Caviar Service (50g), 1x Dom Pérignon Vintage 2013',
        note: 'Silver cloche cart service • Lead Butler dispatch only',
        isClocheService: true,
        total: '14,500',
        billingNote: 'VIP Credit On File',
        status: 'READY FOR DISPATCH',
        statusCategory: 'Ready',
        statusBadgeType: 'ready',
        time: '12:20 PM',
        timeAgo: '30m ago',
      },
      {
        id: '#NV-000000',
        room: '{ ROOM :Number }',
        items: '1x Handcrafted Rigatoni All\'Amatriciana, 1x Tiramisù Tradizionale',
        note: 'Delivered to ROOM dining table by Butler Marco',
        isDeliveredNote: true,
        total: '1,450',
        billingNote: 'Closed to Folio',
        status: 'DELIVERED',
        statusCategory: 'Delivered',
        statusBadgeType: 'delivered',
        time: '11:45 AM',
        timeAgo: '1h 5m ago',
      },
      {
        id: '#NV-000000',
        room: '{ ROOM :Number }',
        items: '3x Prime Ribeye Steaks (Medium), 2x Vintage Barolo 2017',
        note: 'Reason: Kitchen Capacity Exceeded (Private Gala prep)',
        isRejectedAlert: true,
        total: '9,800',
        billingNote: 'Voided',
        isVoided: true,
        status: 'REJECTED',
        statusCategory: 'Rejected',
        statusBadgeType: 'rejected',
        time: '11:15 AM',
        timeAgo: '1h 35m ago',
      },
    ],
    []
  );

  const filteredOrders = useMemo(() => {
    return allMockupOrders.filter((ord) => {
      if (activeFilter !== 'All' && ord.statusCategory !== activeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          ord.id.toLowerCase().includes(q) ||
          ord.items.toLowerCase().includes(q) ||
          ord.room.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allMockupOrders, activeFilter, searchQuery]);

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
            <div className="bg-[#F2EDE7] rounded-xl px-3.5 py-2.5 border border-[#E8E2D8] flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span className="text-xs font-bold text-[#5A5046]">Kitchen Live</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#201A15]">
                ONLINE
              </span>
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
              <span className="font-serif font-bold text-[#201A15] text-sm sm:text-base">
                Food Orders
              </span>
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

          {/* Header Title & Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#8A8074]">
                OPERATIONS DISPATCH • Kitchen Live Terminal
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#201A15] tracking-tight">
                Food Orders
              </h2>
              <p className="text-xs sm:text-sm text-[#665D52]">
                View and manage guest food orders across ROOMs, penthouses, and pool cabanas.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Live Auto-Sync Active Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F2EDE7] text-[#4E4438] border border-[#E8E2D8] text-[10px] font-bold shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8C5D29] animate-pulse" />
                <span>Live Auto-Sync Active</span>
              </div>

              {/* Sync Button */}
              <button
                type="button"
                onClick={() => showToast('Kitchen queue synchronized with live POS')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#E8E2D8] text-xs font-bold text-[#201A15] shadow-2xs hover:bg-[#FAF7F2] transition cursor-pointer active:scale-95"
              >
                <RotateCw className="w-3.5 h-3.5 text-[#705535]" />
                <span>Sync</span>
              </button>
            </div>
          </div>

          {/* 6 Metric Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-3.5">
            {/* Card 1: ALL ORDERS */}
            <div className="bg-white rounded-2xl p-4 border border-[#EFE9DF] shadow-2xs space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">
                ALL ORDERS
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#201A15]">
                  24
                </span>
                <span className="text-xs text-[#7A6F63]">Total</span>
              </div>
            </div>

            {/* Card 2: NEW ORDERS (Highlighted) */}
            <div className="bg-white rounded-2xl p-4 border border-[#F6D7BC] shadow-2xs space-y-1.5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#C27E43]" />
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#8C5D29]">
                  NEW ORDERS
                </p>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C27E43]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#8C5D29]">
                  4
                </span>
                <span className="bg-[#FDF0E2] text-[#8C5D29] text-[9px] font-bold px-2 py-0.5 rounded-full">
                  Action req.
                </span>
              </div>
            </div>

            {/* Card 3: PREPARING */}
            <div className="bg-white rounded-2xl p-4 border border-[#EFE9DF] shadow-2xs space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">
                PREPARING
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#201A15]">
                  6
                </span>
                <span className="text-xs text-[#7A6F63]">In kitchen</span>
              </div>
            </div>

            {/* Card 4: READY */}
            <div className="bg-white rounded-2xl p-4 border border-[#EFE9DF] shadow-2xs space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">
                READY
              </p>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-emerald-800">
                  3
                </span>
                <span className="bg-[#EAF6ED] text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full">
                  For Butler
                </span>
              </div>
            </div>

            {/* Card 5: DELIVERED */}
            <div className="bg-white rounded-2xl p-4 border border-[#EFE9DF] shadow-2xs space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">
                DELIVERED
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#201A15]">
                  10
                </span>
                <span className="text-xs text-[#7A6F63]">Fulfilled</span>
              </div>
            </div>

            {/* Card 6: REJECTED / VOID */}
            <div className="bg-white rounded-2xl p-4 border border-[#EFE9DF] shadow-2xs space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">
                REJECTED / VOID
              </p>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-red-700">
                  1
                </span>
                <span className="bg-red-50 text-red-700 text-[9px] font-bold px-2 py-0.5 rounded-full">
                  Logged
                </span>
              </div>
            </div>
          </div>

          {/* New Order Received Alert Card */}
          {showNewOrderBanner && (
            <div className="bg-white rounded-2xl p-4 border border-[#EFE9DF] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FDF0E2] text-[#8C5D29] flex items-center justify-center shrink-0 border border-[#F6E3CF]">
                  <ClocheIcon className="w-5 h-5 text-[#8C5D29]" />
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C27E43] shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C27E43]">
                      NEW ORDER RECEIVED • ROOM 305 • 45s ago
                    </span>
                  </div>
                  <p className="font-bold text-xs sm:text-sm text-[#201A15]">
                    2x Artisanal Wagyu Burger, 1x San Pellegrino Sparkling 750ml
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <Link
                  href="/admin/orders/details"
                  className="bg-[#705535] hover:bg-[#5C452A] text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs cursor-pointer inline-flex items-center"
                >
                  Review Order
                </Link>
                <button
                  type="button"
                  onClick={() => setShowNewOrderBanner(false)}
                  className="text-[#8A8074] hover:text-[#201A15] p-1.5 transition cursor-pointer"
                  aria-label="Dismiss banner"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#8A8074] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders by order ID"
                className="w-full bg-white border border-[#E8E2D8] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#201A15] placeholder:text-[#A89F93] focus:outline-none focus:ring-1 focus:ring-[#705535] focus:border-[#705535] transition shadow-2xs"
              />
            </div>

            {/* Filter Tabs & Range Dropdown */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              {(
                [
                  { label: 'All (24)', key: 'All' },
                  { label: 'New (4)', key: 'New' },
                  { label: 'Preparing (6)', key: 'Preparing' },
                  { label: 'Ready (3)', key: 'Ready' },
                  { label: 'Delivered (10)', key: 'Delivered' },
                ] as const
              ).map((tab) => {
                const isActive = activeFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveFilter(tab.key)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-[#705535] text-white shadow-2xs'
                        : 'bg-white border border-[#E8E2D8] text-[#5A5046] hover:bg-[#F2EDE7]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}

              {/* Today (Dispatch) Dropdown */}
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E8E2D8] text-xs font-bold text-[#5A5046] shadow-2xs hover:bg-[#FAF7F2] transition cursor-pointer whitespace-nowrap ml-1"
              >
                <span>Today (Dispatch)</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#8A8074]" />
              </button>
            </div>
          </div>

          {/* Orders Table Container */}
          <div className="bg-white rounded-2xl border border-[#EFE9DF] shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[10px] font-bold uppercase tracking-wider text-[#8A8074] border-b border-[#EFE9DF]">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">ORDER ID</th>
                    <th className="py-3.5 px-4">DESTINATION / ROOM</th>
                    <th className="py-3.5 px-4">ITEMS &amp; DIETARY NOTES</th>
                    <th className="py-3.5 px-4">TOTAL</th>
                    <th className="py-3.5 px-4">LIVE STATUS</th>
                    <th className="py-3.5 px-4 sm:px-6">TIMESTAMP</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F2ECE3]">
                  {filteredOrders.map((ord, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-[#FAF8F5] transition-colors"
                    >
                      {/* ORDER ID */}
                      <td className="py-4 px-4 sm:px-6 font-serif font-bold text-sm text-[#201A15] whitespace-nowrap align-top">
                        {isLiteralMockup ? ord.id : (orders[idx]?.orderNumber || ord.id)}
                      </td>

                      {/* DESTINATION / ROOM */}
                      <td className="py-4 px-4 font-bold text-sm text-[#201A15] whitespace-nowrap align-top">
                        {isLiteralMockup ? ord.room : `ROOM ${300 + idx}`}
                      </td>

                      {/* ITEMS & DIETARY NOTES */}
                      <td className="py-4 px-4 max-w-md space-y-1 align-top">
                        <p className="font-bold text-xs sm:text-sm text-[#201A15]">
                          {ord.items}
                        </p>

                        {/* Regular Guest Note Box */}
                        {ord.note && !ord.isRejectedAlert && !ord.isClocheService && !ord.isDeliveredNote && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F8F5F0] border border-[#EAE3D9] text-[11px] text-[#7A6F63]">
                            <FileText className="w-3 h-3 text-[#8A8074] shrink-0" />
                            <span>{ord.note}</span>
                          </div>
                        )}

                        {/* Cloche Cart VIP Note */}
                        {ord.isClocheService && (
                          <div className="inline-flex items-center gap-1.5 text-[11px] text-[#7A6F63]">
                            <ClocheIcon className="w-3.5 h-3.5 text-[#705535]" />
                            <span>{ord.note}</span>
                          </div>
                        )}

                        {/* Delivered Note */}
                        {ord.isDeliveredNote && (
                          <p className="text-[11px] text-[#7A6F63]">
                            {ord.note}
                          </p>
                        )}

                        {/* Rejected Alert Box */}
                        {ord.isRejectedAlert && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FEF2F2] border border-red-200 text-[11px] text-red-700 font-medium">
                            <AlertCircle className="w-3 h-3 text-red-700 shrink-0" />
                            <span>{ord.note}</span>
                          </div>
                        )}
                      </td>

                      {/* TOTAL */}
                      <td className="py-4 px-4 whitespace-nowrap align-top">
                        <p className="font-bold text-sm sm:text-base text-[#201A15]">
                          ₹{ord.total}
                        </p>
                        <p className={`text-[10px] mt-0.5 ${ord.isVoided ? 'text-red-700 font-bold' : 'text-[#8A8074]'}`}>
                          {ord.billingNote}
                        </p>
                      </td>

                      {/* LIVE STATUS */}
                      <td className="py-4 px-4 whitespace-nowrap align-top">
                        {ord.statusBadgeType === 'new' && (
                          <span className="inline-flex items-center gap-1 bg-[#FDF0E2] text-[#8C5D29] border border-[#F6E3CF] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8C5D29]" />
                            <span>NEW ORDER</span>
                          </span>
                        )}
                        {ord.statusBadgeType === 'accepted' && (
                          <span className="inline-flex items-center gap-1 bg-[#FDF0E2] text-[#8C5D29] border border-[#F6E3CF] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8C5D29]" />
                            <span>ACCEPTED</span>
                          </span>
                        )}
                        {ord.statusBadgeType === 'preparing' && (
                          <span className="inline-flex items-center gap-1.5 bg-[#FDF0E2] text-[#8C5D29] border border-[#F6E3CF] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                            <UtensilsCrossed className="w-3 h-3 text-[#8C5D29]" />
                            <span>PREPARING</span>
                          </span>
                        )}
                        {ord.statusBadgeType === 'ready' && (
                          <span className="inline-flex items-center gap-1.5 bg-[#EAF6ED] text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            <span>READY FOR DISPATCH</span>
                          </span>
                        )}
                        {ord.statusBadgeType === 'delivered' && (
                          <span className="inline-flex items-center gap-1 bg-[#EDE7DE] text-[#695D50] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                            <Check className="w-3 h-3" />
                            <span>DELIVERED</span>
                          </span>
                        )}
                        {ord.statusBadgeType === 'rejected' && (
                          <span className="inline-flex items-center gap-1 bg-[#FEF2F2] text-red-700 border border-red-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                            <span>REJECTED</span>
                          </span>
                        )}
                      </td>

                      {/* TIMESTAMP */}
                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap align-top">
                        <span className="font-bold text-xs text-[#201A15] block">
                          {ord.time}
                        </span>
                        <span className={`text-[11px] ${ord.isUrgentTime ? 'font-bold text-[#C27E43]' : 'text-[#8A8074]'}`}>
                          {ord.timeAgo}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Row */}
            <div className="p-4 border-t border-[#F2ECE3] flex items-center justify-between text-xs text-[#7A6F63]">
              <p>
                Showing <strong>{filteredOrders.length}</strong> of <strong>24</strong> active operations records
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="w-8 h-8 rounded-lg border border-[#E8E2D8] bg-white flex items-center justify-center text-[#8A8074] hover:bg-[#F8F5F0] transition disabled:opacity-50"
                  disabled
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="px-2 font-bold text-[#201A15]">
                  Page 1
                </span>

                <button
                  type="button"
                  onClick={() => showToast('Next page is currently at end of queue')}
                  className="w-8 h-8 rounded-lg border border-[#E8E2D8] bg-white flex items-center justify-center text-[#5A5046] hover:bg-[#F8F5F0] transition cursor-pointer"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
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

export default function AdminOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#705535] border-t-transparent animate-spin" />
        </div>
      }
    >
      <AdminOrdersContent />
    </Suspense>
  );
}
