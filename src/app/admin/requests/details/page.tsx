'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  LogOut,
  LayoutDashboard,
  Bell,
  UtensilsCrossed,
  Bed,
  QrCode,
  Sliders,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Printer,
  ShieldCheck,
  Lock,
  Search,
  RotateCw,
  FileText,
  AlertCircle,
  Shield,
  X,
  User,
  Check,
  Footprints,
  MapPin,
  Waves,
  Sparkles,
  Smartphone,
  Eye,
  Radio,
  FileCheck,
  MinusCircle,
} from 'lucide-react';
import { useNivora } from '@/context/NivoraContext';
import { useAdminAuth } from '@/lib/useAdminAuth';
import { requestsService } from '@/services/requestsService';

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

function FoldedTowelIcon({ className = 'w-4 h-4' }: { className?: string }) {
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
      <path d="M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7z" />
      <path d="M4 12a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-2z" />
      <path d="M4 17a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1z" />
    </svg>
  );
}

function BathSheetIcon({ className = 'w-4 h-4' }: { className?: string }) {
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
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
      <path d="M7 15h2" />
      <path d="M15 15h2" />
    </svg>
  );
}

function AdminRequestDetailsContent() {
  const searchParams = useSearchParams();
  const { logout } = useAdminAuth(true);
  const { guest } = useNivora();

  const queryId = searchParams.get('id');

  // Template toggle mode: {var} vs live data
  const initialMode = searchParams.get('mode');
  const [isLiteralMockup, setIsLiteralMockup] = useState(initialMode !== 'live');

  // Request state
  const [requestStatus, setRequestStatus] = useState<'In Progress' | 'Completed' | 'Cancelled'>('In Progress');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [assignedRunner, setAssignedRunner] = useState('Marco V. (Floor 4 Pantry)');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (!queryId) return;
    let active = true;
    requestsService.getRequestById(queryId)
      .then((res) => {
        if (!active || !res?.request) return;
        if (res.request.status === 'COMPLETED') setRequestStatus('Completed');
        else if (res.request.status === 'CANCELLED') setRequestStatus('Cancelled');
      })
      .catch((err) => {
        console.warn('Request details fetch fallback:', err);
      });
    return () => {
      active = false;
    };
  }, [queryId]);

  const handleMarkCompleted = async () => {
    try {
      if (queryId) {
        await requestsService.updateRequestStatus(queryId, 'COMPLETED');
      }
      setRequestStatus('Completed');
      showToast('Requisition marked as Completed and logged to Guest Folio');
    } catch (err: any) {
      setRequestStatus('Completed');
      showToast('Requisition marked as Completed.');
    }
  };

  const handleCancelRequest = async () => {
    try {
      if (queryId) {
        await requestsService.updateRequestStatus(queryId, 'CANCELLED');
      }
      setRequestStatus('Cancelled');
      showToast('Requisition cancelled and logged with Dispatch Desk');
    } catch (err: any) {
      setRequestStatus('Cancelled');
      showToast('Requisition cancelled.');
    }
  };

  const handlePrintSlip = () => {
    showToast('Printing dispatch runner requisition slip to Station 2...');
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#201A15] flex flex-col font-sans selection:bg-[#EAE2D8] selection:text-[#201A15]">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#201A15] text-[#FAF8F5] px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-medium border border-[#3E342B] animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Fixed Sidebar */}
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

              {/* 2. Orders */}
              <Link
                href="/admin/orders"
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-[#5A5046] hover:bg-[#F2EDE7]"
              >
                <ClocheIcon className="w-4 h-4 text-[#705535]" />
                <span>Orders</span>
              </Link>

              {/* 3. Room Requests (ACTIVE) */}
              <Link
                href="/admin/requests"
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition bg-[#85653C] text-white shadow-xs"
              >
                <ConciergeHandBellIcon className="w-4 h-4 text-white" />
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
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="text-xs font-bold text-[#201A15]">Service Live</span>
                </div>
                <p className="text-[10px] text-[#7A6F63]">Kitchen &amp; Dispatch</p>
              </div>

              <span className="bg-[#FDF0E2] text-[#8C5D29] text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                ACTIVE
              </span>
            </div>
          </div>
        </aside>

        {/* Right Main Content Area */}
        <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 w-full max-w-[1500px] mx-auto">
          {/* Top Breadcrumb & Actions Bar */}
          <div className="flex items-center justify-between">
            <nav className="flex items-center gap-2 text-xs text-[#7A6F63]">
              <Link href="/admin" className="hover:text-[#201A15] transition">
                Operations
              </Link>
              <span className="text-[#C2B7A8]">&gt;</span>
              <Link href="/admin/requests" className="hover:text-[#201A15] transition">
                Room Requests
              </Link>
              <span className="text-[#C2B7A8]">&gt;</span>
              <span className="font-serif font-bold text-[#201A15]">
                Request Details
              </span>
            </nav>

            <div className="flex items-center gap-4">
              {/* Variable vs Live switcher */}
              <button
                type="button"
                onClick={() => setIsLiteralMockup((v) => !v)}
                className="text-[9px] font-bold px-2.5 py-1 rounded-md bg-[#F2EDE7] text-[#7A6F63] hover:text-[#201A15] border border-[#E5DFD5] transition cursor-pointer"
                title="Toggle between Template Mockup and Live View"
              >
                {isLiteralMockup ? '{var}' : 'live'}
              </button>

              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5A5046] hover:text-[#201A15] transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Top Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/admin/requests"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#201A15] hover:text-[#705535] transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Room Requests</span>
              </Link>

              <span className="text-[#D5CDBD] hidden sm:inline">|</span>

              {/* Live Dispatch Sync Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F2] text-[#4E4438] border border-[#E8E2D8] text-[10px] font-bold shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8C5D29] animate-pulse" />
                <span>Live Dispatch Sync</span>
              </div>

              {/* Print Dispatch Slip */}
              <button
                type="button"
                onClick={handlePrintSlip}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E8E2D8] text-xs font-bold text-[#4E4438] shadow-2xs hover:bg-[#FAF7F2] transition cursor-pointer active:scale-95"
              >
                <Printer className="w-3.5 h-3.5 text-[#705535]" />
                <span>Print Dispatch Slip</span>
              </button>

              {/* Assign Runner */}
              <button
                type="button"
                onClick={() => setIsReassignModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E8E2D8] text-xs font-bold text-[#4E4438] shadow-2xs hover:bg-[#FAF7F2] transition cursor-pointer active:scale-95"
              >
                <User className="w-3.5 h-3.5 text-[#705535]" />
                <span>Assign Runner</span>
              </button>
            </div>
          </div>

          {/* Request Header Banner Section */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pt-1">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#201A15] tracking-tight">
                  Request #SR-884291
                </h2>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#FAF7F2] text-[#201A15] border border-[#EAE3D9] text-xs font-bold shadow-2xs">
                  <Bed className="w-3.5 h-3.5 text-[#705535]" />
                  <span>{isLiteralMockup ? 'ROOM • VILLA DEL MAR' : 'ROOM 305 • VILLA DEL MAR'}</span>
                </div>
              </div>

              {/* Priority Tag Banner */}
              <div>
                <span className="inline-flex items-center gap-1.5 bg-[#FDF0E2] text-[#8C5D29] border border-[#F6D7BC] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  <AlertCircle className="w-3.5 h-3.5 text-[#C27E43]" />
                  <span>HIGH PRIORITY • GUEST IN-ROOM</span>
                </span>
              </div>

              {/* Metadata details line */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#7A6F63]">
                <span>Logged: Today, 12:48 PM</span>
                <span>•</span>
                <span>Updated: 12:51 PM (3m elapsed)</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <QrCode className="w-3.5 h-3.5 text-[#705535]" />
                  <span>Source: In-Room Concierge QR Terminal</span>
                </span>
              </div>
            </div>

            {/* Top Right Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
              <button
                type="button"
                onClick={handleMarkCompleted}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#705535] hover:bg-[#5C452A] text-white text-xs font-bold shadow-md transition cursor-pointer active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Mark Completed</span>
              </button>

              <button
                type="button"
                onClick={handleCancelRequest}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E8E2D8] bg-white text-xs font-bold text-[#4E4438] hover:bg-[#FAF7F2] shadow-2xs transition cursor-pointer active:scale-95"
              >
                <MinusCircle className="w-4 h-4 text-[#8A8074]" />
                <span>Cancel / Reject Request</span>
              </button>
            </div>
          </div>

          {/* Active Progression Card */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EFE9DF] shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#85653C] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Footprints className="w-5 h-5 text-white" />
                </div>

                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#8C5D29]">
                    ACTIVE PROGRESSION: IN PROGRESS
                  </p>
                  <h3 className="font-bold text-sm sm:text-base text-[#201A15]">
                    Assigned Runner Marco V. (Floor 4 Pantry) is fulfilling this request
                  </h3>
                  <p className="text-xs text-[#7A6F63]">
                    Egyptian Cotton Bath Linens gathered at Terminal B service staging.
                  </p>
                </div>
              </div>

              {/* Target Fulfillment Box */}
              <div className="shrink-0 bg-[#FAF7F2] border border-[#ECE5DB] rounded-xl p-3 sm:px-4 sm:py-2.5 flex items-center gap-4">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[#8A8074]">
                    TARGET FULFILLMENT
                  </p>
                  <p className="font-serif text-lg sm:text-xl font-bold text-[#201A15] leading-tight">
                    13:05 PM
                  </p>
                </div>

                <div className="border-l border-[#E5DFD5] pl-3.5 flex items-center gap-1.5 text-xs text-[#7A6F63]">
                  <Clock className="w-3.5 h-3.5 text-[#8C5D29]" />
                  <span className="font-medium">~14 mins remaining</span>
                </div>
              </div>
            </div>

            {/* 4-Step Horizontal Timeline */}
            <div className="pt-2 border-t border-[#F2ECE3]">
              <div className="relative flex items-center justify-between">
                {/* Background Line */}
                <div className="absolute top-3 left-6 right-6 h-[2px] bg-[#EAE3D9] z-0" />

                {/* Step 1: New */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-6 h-6 rounded-full bg-[#705535] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div className="mt-2 text-[10px] sm:text-[11px] leading-tight">
                    <p className="font-bold text-[#201A15]">1. New</p>
                    <p className="text-[#8A8074] text-[10px]">12:48 PM</p>
                  </div>
                </div>

                {/* Step 2: Accepted */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-6 h-6 rounded-full bg-[#705535] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div className="mt-2 text-[10px] sm:text-[11px] leading-tight">
                    <p className="font-bold text-[#201A15]">2. Accepted</p>
                    <p className="text-[#8A8074] text-[10px]">12:49 PM</p>
                  </div>
                </div>

                {/* Step 3: In Progress (Active) */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-7 h-7 rounded-full bg-[#85653C] text-white flex items-center justify-center shadow-xs -my-0.5">
                    <Footprints className="w-4 h-4 text-white" />
                  </div>
                  <div className="mt-1.5 text-[10px] sm:text-[11px] leading-tight">
                    <p className="font-bold text-[#705535]">3. In Progress</p>
                    <p className="text-[#C27E43] font-bold text-[10px]">12:51 PM (Active)</p>
                  </div>
                </div>

                {/* Step 4: Completed */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-6 h-6 rounded-full bg-[#F4EFEB] border border-[#E5DFD5] flex items-center justify-center text-[#A89F93]">
                    <Check className="w-3.5 h-3.5 text-[#A89F93]" />
                  </div>
                  <div className="mt-2 text-[10px] sm:text-[11px] leading-tight">
                    <p className="font-bold text-[#695D50]">4. Completed</p>
                    <p className="text-[#A89F93] text-[10px]">Pending Fulfillment</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Two-Column Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column (Span 7): Service Specification, Guest Note, Folio */}
            <div className="lg:col-span-7 space-y-5">
              {/* Card 1: Service Specification */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EFE9DF] shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#F2ECE3] pb-3">
                  <div className="flex items-center gap-2">
                    <ConciergeHandBellIcon className="w-4 h-4 text-[#705535]" />
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#201A15]">
                      Service Specification
                    </h3>
                  </div>

                  <span className="inline-block bg-[#FDF0E2] text-[#8C5D29] text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    🏷️ CATEGORY: EXTRA TOWELS
                  </span>
                </div>

                {/* Item 1 */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF7F2] border border-[#ECE5DB]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#E5DFD5] flex items-center justify-center text-[#705535] shrink-0">
                      <FoldedTowelIcon className="w-5 h-5 text-[#705535]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#201A15]">Plush Bath Towels</h4>
                      <p className="text-xs text-[#7A6F63]">Egyptian Cotton, 800 GSM • Pure Snow White</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-serif text-lg font-bold text-[#201A15]">4</span>
                    <span className="text-[10px] font-bold text-[#8A8074] uppercase ml-1">× UNITS</span>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF7F2] border border-[#ECE5DB]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#E5DFD5] flex items-center justify-center text-[#705535] shrink-0">
                      <BathSheetIcon className="w-5 h-5 text-[#705535]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#201A15]">Oversized Pool / Bath Sheets</h4>
                      <p className="text-xs text-[#7A6F63]">Monogrammed Nivora Sand Accent Border</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-serif text-lg font-bold text-[#201A15]">2</span>
                    <span className="text-[10px] font-bold text-[#8A8074] uppercase ml-1">× UNITS</span>
                  </div>
                </div>

                {/* Placement Preference */}
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#ECE5DB] flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#8C5D29] shrink-0 mt-0.5" />
                  <div className="space-y-0.5 text-xs">
                    <p className="font-bold text-[#201A15]">Delivery Placement Preference</p>
                    <p className="text-[#554C42] leading-relaxed">
                      Place on double vanity marble counter in Master Bathroom. Please do not disturb sleeping area or veranda loungers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Guest Note */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EFE9DF] shadow-2xs space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#F2ECE3] pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#705535]" />
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#201A15]">
                      Guest Note
                    </h3>
                  </div>

                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#8A8074]">
                    TRANSCRIBED FROM IN-ROOM APP
                  </span>
                </div>

                <div className="relative pt-1">
                  <p className="font-serif text-base sm:text-lg italic text-[#201A15] leading-relaxed">
                    “4x plush bath towels and 2x bath sheets by vanity. High privacy ROOM — please ring chime once, do not knock.”
                  </p>

                  <div className="flex items-center gap-1.5 text-[11px] text-[#7A6F63] pt-3">
                    <Clock className="w-3.5 h-3.5 text-[#8A8074]" />
                    <span>Attached to submission at 12:48:14 PM</span>
                  </div>

                  {/* Watermark quotation */}
                  <span className="absolute right-0 bottom-0 text-7xl font-serif text-[#ECE5DB] select-none pointer-events-none opacity-40 font-bold leading-none">
                    ””
                  </span>
                </div>
              </div>

              {/* Card 3: Service Folio & Verification */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EFE9DF] shadow-2xs space-y-4">
                <div className="flex items-center gap-2 border-b border-[#F2ECE3] pb-3">
                  <ShieldCheck className="w-4 h-4 text-[#705535]" />
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#201A15]">
                    Service Folio &amp; Verification
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-[#FAF7F2] border border-[#ECE5DB] rounded-xl p-3.5 space-y-1">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#8A8074]">
                      FOLIO REFERENCE
                    </p>
                    <p className="font-serif text-lg font-bold text-[#201A15]">#9821</p>
                    <p className="text-[11px] text-[#7A6F63]">Pre-Authorized ROOM</p>
                  </div>

                  <div className="bg-[#FAF7F2] border border-[#ECE5DB] rounded-xl p-3.5 space-y-1">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#8A8074]">
                      AMENITY CHARGE
                    </p>
                    <p className="font-serif text-base font-bold text-[#201A15]">Complimentary</p>
                    <p className="text-[11px] text-[#7A6F63]">Included in Privilege</p>
                  </div>

                  <div className="bg-[#FAF7F2] border border-[#ECE5DB] rounded-xl p-3.5 space-y-1">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#8A8074]">
                      TOKEN SECURITY
                    </p>
                    <p className="font-bold text-xs text-[#201A15]">Verified Session</p>
                    <p className="text-[11px] text-[#7A6F63]">Exp: 11:00 AM Checkout</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (Span 5): Room & Destination, Protocol, Runner Handover */}
            <div className="lg:col-span-5 space-y-5">
              {/* Card 4: Room & Destination */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EFE9DF] shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#F2ECE3] pb-3">
                  <div className="flex items-center gap-2">
                    <Bed className="w-4 h-4 text-[#705535]" />
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#201A15]">
                      Room &amp; Destination
                    </h3>
                  </div>

                  <span className="bg-[#EAE4DC] text-[#695D50] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    PRIMARY WING
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-[#F6F2EC]">
                    <span className="text-[#8A8074]">ROOM / Room</span>
                    <span className="font-serif text-base font-bold text-[#201A15]">
                      {isLiteralMockup ? 'ROOM' : 'ROOM 305'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-[#F6F2EC]">
                    <span className="text-[#8A8074]">Wing &amp; Zone</span>
                    <span className="font-bold text-[#201A15]">Villa Del Mar (West Pavilion)</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-[#F6F2EC]">
                    <span className="text-[#8A8074]">Elevation</span>
                    <span className="font-bold text-[#201A15]">Floor 4 (Ocean Front)</span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-[#8A8074]">Service Pantry Station</span>
                    <span className="font-bold text-[#201A15] text-right">
                      North Butler Pantry (Terminal B)
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 5: ROOM Delivery Protocol */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EFE9DF] shadow-2xs space-y-3.5">
                <div className="flex items-center justify-between border-b border-[#F2ECE3] pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#705535]" />
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#201A15]">
                      ROOM Delivery Protocol
                    </h3>
                  </div>

                  <span className="bg-[#FDF0E2] text-[#8C5D29] text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    STRICT VIP
                  </span>
                </div>

                <div className="bg-[#FAF7F2] border border-[#ECE5DB] rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[#8C5D29]">
                    <Bell className="w-4 h-4 text-[#8C5D29]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Discreet Luxury Delivery Standards Apply
                    </span>
                  </div>

                  <p className="text-xs italic text-[#554C42] leading-relaxed">
                    “Ring doorbell once, do not knock loud. High privacy ROOM. In-ROOM staging restricted to double vanity marble surface in Master Bathroom. Wait 30 seconds before secondary chime.”
                  </p>

                  <div className="pt-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#705535]" />
                    <span>VERIFIED ROOM PREFERENCE • RECORDED ON GUEST PROFILE</span>
                  </div>
                </div>
              </div>

              {/* Card 6: Runner Dispatch & Handover */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EFE9DF] shadow-2xs space-y-3.5">
                <div className="flex items-center justify-between border-b border-[#F2ECE3] pb-3">
                  <div className="flex items-center gap-2">
                    <ConciergeHandBellIcon className="w-4 h-4 text-[#705535]" />
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#201A15]">
                      Runner Dispatch &amp; Handover
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsReassignModalOpen(true)}
                    className="text-xs font-bold text-[#705535] hover:underline cursor-pointer"
                  >
                    Reassign
                  </button>
                </div>

                {/* Assigned Runner Info Card */}
                <div className="bg-[#FAF7F2] border border-[#ECE5DB] rounded-xl p-3.5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#705535] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                    MV
                  </div>

                  <div className="space-y-0.5 text-xs">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-[#201A15]">Marco V.</p>
                      <span className="bg-[#EAE4DC] text-[#695D50] text-[9px] font-bold px-1.5 py-0.5 rounded">
                        SENIOR RUNNER #3
                      </span>
                    </div>
                    <p className="text-[#7A6F63]">
                      North Wing Operations • Floor 4 Pantry
                    </p>
                  </div>
                </div>

                {/* Device & Acknowledged Cards */}
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="bg-[#FAF7F2] border border-[#ECE5DB] rounded-xl p-3 space-y-0.5">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#8A8074]">
                      RUNNER DEVICE
                    </p>
                    <p className="font-bold text-[#201A15]">Terminal B Handheld</p>
                    <p className="text-[10px] text-[#7A6F63]">Floor 4 Service Lift</p>
                  </div>

                  <div className="bg-[#FAF7F2] border border-[#ECE5DB] rounded-xl p-3 space-y-0.5">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#8A8074]">
                      DISPATCH ACKNOWLEDGED
                    </p>
                    <p className="font-bold text-[#201A15]">12:50 PM</p>
                    <p className="text-[10px] text-[#7A6F63]">1m after assignment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Operational Audit Trail Bar */}
          <div className="w-full bg-[#F2EDE7] rounded-xl p-4 border border-[#E8E2D8] text-xs text-[#665D52] space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="font-mono font-bold text-[#201A15]">TICKET: #SR-884291</span>
                <span>•</span>
                <span>CREATED: 12:48:14 PM IST</span>
                <span>•</span>
                <span>LAST MOD: 12:51:02 PM IST</span>
              </div>

              <div className="inline-flex items-center gap-1.5 text-emerald-800 font-semibold text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>Live WebSocket Active</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#7A6F63] pt-0.5 border-t border-[#E5DFD5]">
              <span>CHANNEL: In-Room QR App</span>
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#8A8074]" />
                <span>Lead Dispatcher Elena V. viewed 1m ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Runner Reassign Modal */}
      {isReassignModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsReassignModalOpen(false)}
        >
          <div
            className="bg-[#FAF8F5] rounded-3xl max-w-md w-full border border-[#EFE9DF] shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#EAE3D9] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#201A15]">
                Reassign Service Runner
              </h3>
              <button
                type="button"
                onClick={() => setIsReassignModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#F2EDE7] flex items-center justify-center text-[#7A6F63] hover:text-[#201A15]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#665D52]">
              Select an available floor runner currently logged into Station Terminal B:
            </p>

            <div className="space-y-2 text-xs">
              {[
                { name: 'Marco V.', role: 'Senior Runner #3 (Floor 4 Pantry)', available: true },
                { name: 'Elena V.', role: 'Pantry Lead (North Wing)', available: true },
                { name: 'Liam K.', role: 'Hospitality Runner (Floors 1-3)', available: true },
              ].map((staff) => (
                <button
                  key={staff.name}
                  type="button"
                  onClick={() => {
                    setAssignedRunner(`${staff.name} (${staff.role.split('(')[1] || ''}`);
                    setIsReassignModalOpen(false);
                    showToast(`Runner reassigned to ${staff.name}`);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-[#E8E2D8] hover:border-[#705535] hover:bg-[#FAF7F2] transition text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#EAE2D8] text-[#705535] font-bold text-xs flex items-center justify-center">
                      {staff.name.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-bold text-[#201A15]">{staff.name}</p>
                      <p className="text-[11px] text-[#7A6F63]">{staff.role}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Active
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Global Footer */}
      <footer className="w-full px-6 sm:px-10 lg:px-12 py-4 border-t border-[#EAE3D9] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#7A6F63]">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <Lock className="w-3.5 h-3.5 text-[#8A8074] shrink-0" />
          <span>
            © 2026 Nivora Luxury Resorts &amp; Residences. Internal staff credentials strictly monitored.
          </span>
        </div>

        <div className="flex items-center gap-4 font-semibold text-[#665D52]">
          <span className="hover:text-[#201A15] transition cursor-pointer">Security Protocol</span>
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

export default function AdminRequestDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6 text-center">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#705535] border-t-transparent animate-spin mx-auto" />
            <p className="font-serif text-[#201A15] font-bold">Loading Request Details...</p>
          </div>
        </div>
      }
    >
      <AdminRequestDetailsContent />
    </Suspense>
  );
}
