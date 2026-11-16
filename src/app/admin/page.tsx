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
} from 'lucide-react';
import { useNivora } from '@/context/NivoraContext';
import { OrderStatus, RequestStatus } from '@/types';

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

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const {
    orders,
    roomRequests,
    updateOrderStatus,
    updateRoomRequestStatus,
  } = useNivora();

  const [activeNav, setActiveNav] = useState<string>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showDispatchPush, setShowDispatchPush] = useState<boolean>(true);

  // Filter state for Food Orders table
  const [orderFilter, setOrderFilter] = useState<'All' | 'New' | 'Preparing' | 'Ready' | 'Delivered'>('All');

  // Filter state for Room Requests table
  const [requestFilter, setRequestFilter] = useState<'All' | 'New' | 'Accepted' | 'In Progress' | 'Completed'>('All');

  // Template toggle mode: {var} vs live data
  const initialMode = searchParams.get('mode');
  const [isLiteralMockup, setIsLiteralMockup] = useState(initialMode !== 'live');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Mockup Food Orders matching the screenshot
  const mockupOrders = [
    {
      id: '#NV-000000',
      room: '{ ROOM :Number }',
      items: '2x Artisanal Burrata Salad, 1x Truffle Risotto',
      notes: 'Note: Dressing on the side',
      total: '1,850',
      status: 'NEW',
      statusType: 'new',
      time: '12:40 PM',
      timeAgo: '3m ago',
      actionLabel: 'Accept',
    },
    {
      id: '#NV-000000',
      room: '{ ROOM :Number }',
      items: '1x Wagyu Tenderloin, 1x San Pellegrino 750ml',
      notes: 'Temp: Medium Rare',
      total: '3,200',
      status: 'PREPARING',
      statusType: 'preparing',
      time: '12:28 PM',
      timeAgo: '15m ago',
      actionLabel: 'Mark Ready',
    },
    {
      id: '#NV-000000',
      room: '{ ROOM :Number }',
      items: '2x Highland Roasted Club, 2x Fresh Orange Juice',
      notes: '',
      total: '1,420',
      status: 'READY',
      statusType: 'ready',
      time: '12:15 PM',
      timeAgo: '28m ago',
      actionLabel: 'Mark Delivered',
    },
    {
      id: '#NV-000000',
      room: '{ ROOM :Number }',
      items: '1x Imperial Breakfast Platter',
      notes: '',
      total: '1,150',
      status: 'DELIVERED',
      statusType: 'delivered',
      time: '11:45 AM',
      timeAgo: '',
      actionLabel: '',
    },
    {
      id: '#NV-000000',
      room: '{ ROOM :Number }',
      items: '1x Lobster Bisque (Out of stock)',
      notes: 'Inventory exhausted',
      isOutOfStock: true,
      total: '890',
      status: 'REJECTED',
      statusType: 'rejected',
      time: '11:10 AM',
      timeAgo: '',
      actionLabel: 'View',
    },
  ];

  // Mockup Room Requests matching the screenshot
  const mockupRequests = [
    {
      id: '#SR-000000',
      room: '{ ROOM :Number }',
      title: 'Extra Towels & Water',
      notes: 'Note: “Leave by master bathroom vanity”',
      status: 'NEW',
      statusType: 'new',
      time: '4:28 PM',
      timeAgo: '2m ago',
      actionLabel: 'Dispatch',
    },
    {
      id: '#SR-000000',
      room: '{ ROOM :Number }',
      title: 'Housekeeping',
      notes: 'Evening turn-down service',
      status: 'ACCEPTED',
      statusType: 'accepted',
      time: '4:15 PM',
      timeAgo: '15m ago',
      actionLabel: 'Start',
    },
    {
      id: '#SR-000000',
      room: '{ ROOM :Number }',
      title: 'Maintenance',
      notes: 'Climate control recalibration',
      status: 'IN PROGRESS',
      statusType: 'in_progress',
      time: '3:50 PM',
      timeAgo: '40m ago',
      actionLabel: 'Complete',
    },
    {
      id: '#SR-000000',
      room: '{ ROOM :Number }',
      title: 'Drinking Water',
      notes: '2 chilled sparkling carafes',
      status: 'COMPLETED',
      statusType: 'completed',
      time: '3:30 PM',
      timeAgo: '',
      actionLabel: 'Details',
    },
    {
      id: '#SR-000000',
      room: '{ ROOM :Number }',
      title: 'Laundry & Pressing',
      notes: 'Urgent evening valet (3 items)',
      status: 'COMPLETED',
      statusType: 'completed',
      time: '2:45 PM',
      timeAgo: '',
      actionLabel: 'Details',
    },
  ];

  const handleOrderAction = (orderId: string, action: string) => {
    showToast(`Order updated: ${action}`);
  };

  const handleRequestAction = (reqId: string, action: string) => {
    showToast(`Room request updated: ${action}`);
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

              {/* 1. Dashboard (Active) */}
              <button
                type="button"
                onClick={() => setActiveNav('dashboard')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeNav === 'dashboard'
                    ? 'bg-[#85653C] text-white shadow-xs'
                    : 'text-[#5A5046] hover:bg-[#F2EDE7]'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              {/* 2. Orders */}
              <Link
                href="/admin/orders"
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeNav === 'orders'
                    ? 'bg-[#85653C] text-white shadow-xs'
                    : 'text-[#5A5046] hover:bg-[#F2EDE7]'
                }`}
              >
                <ClocheIcon className="w-4 h-4" />
                <span>Orders</span>
              </Link>

              {/* 3. Room Requests */}
              <Link
                href="/admin/requests"
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeNav === 'requests'
                    ? 'bg-[#85653C] text-white shadow-xs'
                    : 'text-[#5A5046] hover:bg-[#F2EDE7]'
                }`}
              >
                <ConciergeHandBellIcon className="w-4 h-4" />
                <span>Room Requests</span>
              </Link>

              {/* 4. Menu */}
              <Link
                href="/admin/menu"
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeNav === 'menu'
                    ? 'bg-[#85653C] text-white shadow-xs'
                    : 'text-[#5A5046] hover:bg-[#F2EDE7]'
                }`}
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Menu</span>
              </Link>

              {/* 5. Rooms */}
              <Link
                href="/admin/rooms"
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeNav === 'rooms'
                    ? 'bg-[#85653C] text-white shadow-xs'
                    : 'text-[#5A5046] hover:bg-[#F2EDE7]'
                }`}
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
          {/* Top Bar with Logout & Mode Switch */}
          <div className="flex items-center justify-end gap-4">
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

          {/* Dispatch Push Banner */}
          {showDispatchPush && (
            <div className="bg-white rounded-2xl p-4 border border-[#EFE9DF] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="w-2 h-2 rounded-full bg-[#8C5D29] shrink-0" />
                <span className="inline-block bg-[#FCE7D2] text-[#8C5D29] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  DISPATCH PUSH
                </span>
                <span className="text-xs text-[#201A15] font-medium">
                  New order received for <strong>ROOM</strong> • 2 mins ago (2x Artisanal Burrata Salad, 1x Truffle Risotto)
                </span>
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
                  onClick={() => setShowDispatchPush(false)}
                  className="text-[#8A8074] hover:text-[#201A15] p-1.5 transition cursor-pointer"
                  aria-label="Dismiss banner"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Dashboard Title & Top Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#201A15] tracking-tight">
                Dashboard
              </h2>
              <p className="text-xs sm:text-sm text-[#665D52] mt-0.5">
                Manage your hotel culinary services and guest ROOM requests.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
              {/* Live Stream Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDE7DE] text-[#695D50] text-[10px] font-bold uppercase tracking-wider self-start sm:self-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>LIVE DISPATCH SYNC • REAL-TIME STREAM</span>
              </div>

              {/* View Orders Action */}
              <Link
                href="/admin/orders"
                className="bg-[#705535] hover:bg-[#5C452A] text-white text-xs font-bold px-4 py-2 rounded-xl inline-flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>View Orders</span>
              </Link>

              {/* View Room Requests Action */}
              <Link
                href="/admin/requests"
                className="bg-white border border-[#E8E2D8] hover:bg-[#FAF7F2] text-[#201A15] text-xs font-bold px-4 py-2 rounded-xl inline-flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
              >
                <ConciergeHandBellIcon className="w-3.5 h-3.5 text-[#705535]" />
                <span>View Room Requests</span>
              </Link>
            </div>
          </div>

          {/* 5 KPI Metric Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4">
            {/* KPI 1: Food Orders */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EFE9DF] shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-[#8A8074]">
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  FOOD ORDERS
                </span>
                <span className="bg-[#EAE4DC] text-[#695D50] text-[9px] font-bold px-2 py-0.5 rounded-full">
                  All Today
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#201A15]">
                  24
                </span>
                <span className="text-xs text-[#7A6F63]">placed</span>
              </div>
              <p className="text-[11px] text-[#7A6F63] leading-snug">
                Kitchen service active
              </p>
            </div>

            {/* KPI 2: Pending Orders */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EFE9DF] shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-[#8A8074]">
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  PENDING ORDERS
                </span>
                <span className="bg-[#FDF0E2] text-[#8C5D29] text-[9px] font-bold px-2 py-0.5 rounded-full">
                  ACTION REQ
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#8C5D29]">
                  5
                </span>
                <span className="text-xs text-[#8C5D29] font-medium">in queue</span>
              </div>
              <p className="text-[11px] text-[#8C5D29] leading-snug font-medium">
                3 require immediate kitchen pass
              </p>
            </div>

            {/* KPI 3: Room Requests */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EFE9DF] shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-[#8A8074]">
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  ROOM REQUESTS
                </span>
                <span className="bg-[#EAE4DC] text-[#695D50] text-[9px] font-bold px-2 py-0.5 rounded-full">
                  All Today
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#201A15]">
                  18
                </span>
                <span className="text-xs text-[#7A6F63]">logged</span>
              </div>
              <p className="text-[11px] text-[#7A6F63] leading-snug">
                Housekeeping &amp; Valet
              </p>
            </div>

            {/* KPI 4: Pending Requests */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EFE9DF] shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-[#8A8074]">
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  PENDING REQUESTS
                </span>
                <span className="bg-[#FDF0E2] text-[#8C5D29] text-[9px] font-bold px-2 py-0.5 rounded-full">
                  AWAITING
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#8C5D29]">
                  3
                </span>
                <span className="text-xs text-[#8C5D29] font-medium">unassigned</span>
              </div>
              <p className="text-[11px] text-[#7A6F63] leading-snug">
                Avg dispatch lag: 2m
              </p>
            </div>

            {/* KPI 5: Order Value */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EFE9DF] shadow-2xs space-y-2 col-span-2 md:col-span-1">
              <div className="flex items-center justify-between text-[#8A8074]">
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  ORDER VALUE
                </span>
                <CreditCard className="w-3.5 h-3.5 text-[#8A8074]" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#705535]">
                  ₹38,450
                </span>
              </div>
              <p className="text-[11px] text-[#7A6F63] leading-snug">
                Captured to ROOM Folios
              </p>
            </div>
          </div>

          {/* Table 1: Recent Food Orders */}
          <section className="bg-white rounded-2xl border border-[#EFE9DF] shadow-2xs overflow-hidden">
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-[#F2ECE3] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F4EFEB] flex items-center justify-center text-[#705535] shrink-0 border border-[#EAE3D9]">
                  <ClocheIcon className="w-5 h-5 text-[#705535]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#201A15]">
                    Recent Food Orders
                  </h3>
                  <p className="text-xs text-[#7A6F63]">
                    Live guest kitchen tickets in queue
                  </p>
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {(['All', 'New (1)', 'Preparing (1)', 'Ready (1)', 'Delivered'] as const).map((tab) => {
                  const key = tab.startsWith('All') ? 'All' : tab.split(' ')[0];
                  const isActive = orderFilter === key;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setOrderFilter(key as any)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                        isActive
                          ? 'bg-[#705535] text-white shadow-2xs'
                          : 'bg-[#F4EFEB] text-[#695D50] hover:bg-[#EAE3D9]'
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}

                <Link
                  href="/admin/orders"
                  className="text-xs font-bold text-[#705535] hover:underline ml-2 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Orders</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[10px] font-bold uppercase tracking-wider text-[#8A8074] border-b border-[#EFE9DF]">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">ORDER ID</th>
                    <th className="py-3 px-4">ROOM</th>
                    <th className="py-3 px-4">ITEMS</th>
                    <th className="py-3 px-4">TOTAL</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-4">TIME</th>
                    <th className="py-3 px-4 sm:px-6 text-right">ACTION</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F2ECE3]">
                  {mockupOrders.map((order, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-[#FAF8F5] transition-colors"
                    >
                      {/* ORDER ID */}
                      <td className="py-3.5 px-4 sm:px-6 font-serif font-bold text-[#201A15]">
                        {isLiteralMockup ? order.id : (orders[idx]?.orderNumber || order.id)}
                      </td>

                      {/* ROOM */}
                      <td className="py-3.5 px-4 font-bold text-[#201A15]">
                        {isLiteralMockup ? order.room : `ROOM ${104 + idx}`}
                      </td>

                      {/* ITEMS */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className={`font-medium ${order.isOutOfStock ? 'text-[#8A8074] line-through' : 'text-[#201A15]'}`}>
                          {order.items}
                        </p>
                        {order.notes && (
                          <p className={`text-[11px] mt-0.5 ${order.isOutOfStock ? 'text-red-700 font-bold' : 'text-[#8A8074]'}`}>
                            {order.notes}
                          </p>
                        )}
                      </td>

                      {/* TOTAL */}
                      <td className="py-3.5 px-4 font-bold text-[#201A15] whitespace-nowrap">
                        ₹{order.total}
                      </td>

                      {/* STATUS */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {order.statusType === 'new' && (
                          <span className="inline-flex items-center gap-1 bg-[#FDF0E2] text-[#8C5D29] border border-[#F6E3CF] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8C5D29]" />
                            <span>NEW</span>
                          </span>
                        )}
                        {order.statusType === 'preparing' && (
                          <span className="inline-flex items-center gap-1 bg-[#FDF0E2] text-[#8C5D29] border border-[#F6E3CF] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8C5D29]" />
                            <span>PREPARING</span>
                          </span>
                        )}
                        {order.statusType === 'ready' && (
                          <span className="inline-flex items-center gap-1 bg-[#FDF0E2] text-[#8C5D29] border border-[#F6E3CF] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8C5D29]" />
                            <span>READY</span>
                          </span>
                        )}
                        {order.statusType === 'delivered' && (
                          <span className="inline-block bg-[#EDE7DE] text-[#695D50] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            DELIVERED
                          </span>
                        )}
                        {order.statusType === 'rejected' && (
                          <span className="inline-block bg-red-100 text-red-700 border border-red-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            REJECTED
                          </span>
                        )}
                      </td>

                      {/* TIME */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-medium text-[#201A15]">{order.time}</span>
                        {order.timeAgo && (
                          <span className="block text-[10px] font-bold text-[#C27E43]">
                            {order.timeAgo}
                          </span>
                        )}
                      </td>

                      {/* ACTION */}
                      <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                        {order.actionLabel === 'Accept' && (
                          <button
                            type="button"
                            onClick={() => handleOrderAction(order.id, 'Accepted by kitchen')}
                            className="bg-[#705535] hover:bg-[#5C452A] text-white text-[11px] font-bold px-3 py-1 rounded-lg transition shadow-2xs cursor-pointer"
                          >
                            Accept
                          </button>
                        )}
                        {order.actionLabel === 'Mark Ready' && (
                          <button
                            type="button"
                            onClick={() => handleOrderAction(order.id, 'Marked ready for dispatch')}
                            className="bg-[#EDE7DE] hover:bg-[#DDD5CB] text-[#201A15] text-[11px] font-bold px-3 py-1 rounded-lg transition cursor-pointer"
                          >
                            Mark Ready
                          </button>
                        )}
                        {order.actionLabel === 'Mark Delivered' && (
                          <button
                            type="button"
                            onClick={() => handleOrderAction(order.id, 'Marked delivered to suite')}
                            className="bg-[#EDE7DE] hover:bg-[#DDD5CB] text-[#201A15] text-[11px] font-bold px-3 py-1 rounded-lg transition cursor-pointer"
                          >
                            Mark Delivered
                          </button>
                        )}
                        {order.actionLabel === 'View' && (
                          <button
                            type="button"
                            onClick={() => showToast('Opening rejection audit notes...')}
                            className="text-[#705535] hover:underline text-[11px] font-bold cursor-pointer"
                          >
                            View
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Table 2: Recent Room Requests */}
          <section className="bg-white rounded-2xl border border-[#EFE9DF] shadow-2xs overflow-hidden">
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-[#F2ECE3] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F4EFEB] flex items-center justify-center text-[#705535] shrink-0 border border-[#EAE3D9]">
                  <ConciergeHandBellIcon className="w-5 h-5 text-[#705535]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#201A15]">
                    Recent Room Requests
                  </h3>
                  <p className="text-xs text-[#7A6F63]">
                    Housekeeping, amenities, and ROOM services
                  </p>
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {(['All', 'New (1)', 'Accepted (1)', 'In Progress (1)', 'Completed'] as const).map((tab) => {
                  const key = tab.startsWith('All') ? 'All' : tab.split(' ')[0];
                  const isActive = requestFilter === key;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setRequestFilter(key as any)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                        isActive
                          ? 'bg-[#705535] text-white shadow-2xs'
                          : 'bg-[#F4EFEB] text-[#695D50] hover:bg-[#EAE3D9]'
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}

                <Link
                  href="/admin/requests"
                  className="text-xs font-bold text-[#705535] hover:underline ml-2 inline-flex items-center gap-1"
                >
                  <span>View All Requests</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[10px] font-bold uppercase tracking-wider text-[#8A8074] border-b border-[#EFE9DF]">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">REQUEST ID</th>
                    <th className="py-3 px-4">ROOM</th>
                    <th className="py-3 px-4">SERVICE DETAILS</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-4">TIME</th>
                    <th className="py-3 px-4 sm:px-6 text-right">ACTION</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F2ECE3]">
                  {mockupRequests.map((req, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-[#FAF8F5] transition-colors"
                    >
                      {/* REQUEST ID */}
                      <td className="py-3.5 px-4 sm:px-6 font-serif font-bold text-[#201A15]">
                        {isLiteralMockup ? req.id : (roomRequests[idx]?.ticketNumber || req.id)}
                      </td>

                      {/* ROOM */}
                      <td className="py-3.5 px-4 font-bold text-[#201A15]">
                        {isLiteralMockup ? req.room : `ROOM ${104 + idx}`}
                      </td>

                      {/* SERVICE DETAILS */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="font-bold text-[#201A15]">{req.title}</p>
                        {req.notes && (
                          <p className="text-[11px] text-[#7A6F63] mt-0.5">
                            {req.notes}
                          </p>
                        )}
                      </td>

                      {/* STATUS */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {req.statusType === 'new' && (
                          <span className="inline-flex items-center gap-1 bg-[#FDF0E2] text-[#8C5D29] border border-[#F6E3CF] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8C5D29]" />
                            <span>NEW</span>
                          </span>
                        )}
                        {req.statusType === 'accepted' && (
                          <span className="inline-block bg-[#FDF0E2] text-[#8C5D29] border border-[#F6E3CF] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            ACCEPTED
                          </span>
                        )}
                        {req.statusType === 'in_progress' && (
                          <span className="inline-flex items-center gap-1 bg-[#FDF0E2] text-[#8C5D29] border border-[#F6E3CF] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8C5D29]" />
                            <span>IN PROGRESS</span>
                          </span>
                        )}
                        {req.statusType === 'completed' && (
                          <span className="inline-block bg-[#EDE7DE] text-[#695D50] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            COMPLETED
                          </span>
                        )}
                      </td>

                      {/* TIME */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-medium text-[#201A15]">{req.time}</span>
                        {req.timeAgo && (
                          <span className="block text-[10px] font-bold text-[#C27E43]">
                            {req.timeAgo}
                          </span>
                        )}
                      </td>

                      {/* ACTION */}
                      <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {req.actionLabel === 'Dispatch' && (
                            <button
                              type="button"
                              onClick={() => handleRequestAction(req.id, 'Dispatched to floor butler')}
                              className="bg-[#705535] hover:bg-[#5C452A] text-white text-[11px] font-bold px-3 py-1 rounded-lg transition shadow-2xs cursor-pointer"
                            >
                              Dispatch
                            </button>
                          )}
                          {req.actionLabel === 'Start' && (
                            <button
                              type="button"
                              onClick={() => handleRequestAction(req.id, 'Service started')}
                              className="bg-[#EDE7DE] hover:bg-[#DDD5CB] text-[#201A15] text-[11px] font-bold px-3 py-1 rounded-lg transition cursor-pointer"
                            >
                              Start
                            </button>
                          )}
                          {req.actionLabel === 'Complete' && (
                            <button
                              type="button"
                              onClick={() => handleRequestAction(req.id, 'Service marked complete')}
                              className="bg-[#EDE7DE] hover:bg-[#DDD5CB] text-[#201A15] text-[11px] font-bold px-3 py-1 rounded-lg transition cursor-pointer"
                            >
                              Complete
                            </button>
                          )}
                          {req.actionLabel === 'Details' && (
                            <button
                              type="button"
                              onClick={() => showToast('Opening archival log...')}
                              className="text-[#705535] hover:underline text-[11px] font-bold cursor-pointer"
                            >
                              Details
                            </button>
                          )}

                          {/* Quick Inspect Eye Icon */}
                          <button
                            type="button"
                            onClick={() => showToast(`Inspecting ticket ${req.id}`)}
                            className="text-[#8A8074] hover:text-[#201A15] p-1 transition cursor-pointer"
                            title="Inspect details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
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

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#705535] border-t-transparent animate-spin" />
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}
