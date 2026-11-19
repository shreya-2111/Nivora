'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ChevronLeft,
  Check,
  Clock,
  FileText,
  Headphones,
  CheckCircle2,
  Home,
  ShieldCheck,
} from 'lucide-react';
import { useNivora } from '@/context/NivoraContext';
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

function SilverTrayIcon({ className = 'w-4 h-4' }: { className?: string }) {
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
      <path d="M3 18h18" />
      <path d="M6 14h12" />
      <path d="M7 14a5 5 0 0 1 10 0" />
      <circle cx="12" cy="7" r="1" fill="currentColor" />
    </svg>
  );
}

function SuiteDoorIcon({ className = 'w-4 h-4' }: { className?: string }) {
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
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <circle cx="15" cy="12" r="1.5" fill="currentColor" />
      <path d="M4 21h16" />
    </svg>
  );
}

function OrderStatusContent() {
  const searchParams = useSearchParams();
  const { guest, orders, activeOrder, refreshOrder } = useNivora();

  const queryRoom = searchParams.get('room');
  const roomNumber = queryRoom || guest?.roomNumber || '{room_number}';
  const queryOrderId = searchParams.get('id');

  const latestOrder = orders.find((order) => order.id === queryOrderId) || orders[0] || activeOrder;
  const orderId = latestOrder?.orderNumber || '#NV-000000';

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);
  const [trackingError, setTrackingError] = useState<string | null>(null);

  const initialMode = searchParams.get('mode');
  const [isLiteralMockup, setIsLiteralMockup] = useState(initialMode === 'mock');

  const currentStep = latestOrder?.status === 'placed' ? 1
    : latestOrder?.status === 'preparing' ? 3
      : latestOrder?.status === 'on_the_way' ? 4
        : latestOrder?.status === 'delivered' ? 5
          : 1;

  useEffect(() => {
    if (!queryOrderId) return;
    let active = true;
    const refresh = () => {
      void refreshOrder(queryOrderId).then(() => {
        if (active) setTrackingError(null);
      }).catch((error: unknown) => {
        if (active) {
          setTrackingError(error instanceof Error ? error.message : 'Unable to refresh order status.');
        }
      });
    };
    refresh();
    const timer = window.setInterval(refresh, 15000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [queryOrderId, refreshOrder]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] text-[#221B14] selection:bg-[#705535]/20 selection:text-[#221B14] pb-28 antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-full bg-[#2A231C] px-5 py-2.5 text-xs font-medium text-white shadow-xl flex items-center gap-2 border border-[#44382F] animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
      {trackingError && (
        <p role="alert" className="mx-auto mt-3 max-w-2xl px-4 text-center text-xs text-rose-700">
          {trackingError}
        </p>
      )}

      {/* Main Container - Responsive Full Width */}
      <main className="w-full max-w-2xl mx-auto px-4 sm:px-6 pt-3 sm:pt-6 space-y-4 sm:space-y-5">
        {/* Top Header Bar: < Order Status • ORDER #NV-2 */}
        <header className="flex items-center justify-between pt-1 pb-1">
          <div className="flex items-center gap-2">
            <Link
              href="/guest/confirmation"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#201A15] hover:bg-[#F2ECE3] transition"
              aria-label="Back to Order Confirmation"
            >
              <ChevronLeft className="w-6 h-6 text-[#201A15]" />
            </Link>

            <h1 className="font-serif text-lg sm:text-xl font-bold text-[#201A15] tracking-tight">
              Order Status
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Order Reference Pill: • ORDER #NV-2 */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAE4DC] text-[#695D50] border border-[#DDD5CB] text-[11px] font-bold shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#705535] inline-block" />
              <span className="uppercase tracking-wider">
                {isLiteralMockup ? 'ORDER #NV-2' : `ORDER ${orderId}`}
              </span>
            </div>

            {/* Template Toggle Pill */}
            <button
              type="button"
              onClick={() => setIsLiteralMockup((v) => !v)}
              className="text-[9px] font-bold px-2 py-1 rounded bg-[#F2EDE7] text-[#7A6F63] hover:text-[#201A15] border border-[#E5DFD5] transition cursor-pointer"
              title="Toggle between Template Mockup and Live View"
            >
              {isLiteralMockup ? '{var}' : 'live'}
            </button>
          </div>
        </header>

        {/* Card 1: Room & Billing Header Card */}
        <section className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EFE9DF] shadow-2xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            {/* Cloche Icon Circle */}
            <div className="w-11 h-11 rounded-full bg-[#F4EFEB] flex items-center justify-center text-[#705535] shrink-0 border border-[#EAE3D9]">
              <ClocheIcon className="w-5 h-5 text-[#705535]" />
            </div>

            {/* Room Details */}
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A8074] leading-none">
                ROOM
              </p>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-lg sm:text-xl font-bold text-[#201A15] leading-tight">
                  {roomNumber}
                </span>
                <ShieldCheck className="w-4 h-4 text-[#705535] shrink-0" />
              </div>
              <p className="text-xs text-[#8A8074] leading-tight">
                {isLiteralMockup ? '{order_date_time}' : 'Today, 12:40 PM'}
              </p>
            </div>
          </div>

          {/* Right Action Badge: CHARGE TO ROOM FOLIO */}
          <div className="rounded-full bg-[#F2EDE7] px-3 sm:px-3.5 py-1.5 border border-[#E8E2D8] text-[9px] sm:text-[10px] font-bold text-[#7A6F63] text-center leading-tight">
            CHARGE TO ROOM
            <br />
            FOLIO
          </div>
        </section>

        {/* Card 2: Kitchen Atelier Status Banner */}
        <section className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#ECE5DB] shadow-2xs space-y-2.5">
          {/* Top Row: Atelier & IN PROGRESS */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A8074]">
              KITCHEN ATELIER
            </span>

            <span className="inline-block bg-[#FDF0E2] border border-[#F6E3CF] text-[#8C5D29] text-[10px] sm:text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
              IN PROGRESS
            </span>
          </div>

          {/* Preparing Headline */}
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#201A15] tracking-tight">
            Preparing
          </h2>

          <p className="text-xs sm:text-sm text-[#665D52] font-medium leading-relaxed">
            Your order is being prepared by the in-house culinary atelier.
          </p>

          {/* Delivery Note */}
          <div className="pt-1 flex items-center gap-2 text-xs text-[#5A5046]">
            <Clock className="w-4 h-4 text-[#705535] shrink-0" />
            <span>
              Delivering to ROOM {roomNumber} • Freshly prepared
            </span>
          </div>
        </section>

        {/* Card 3: Catering Progress (Vertical Timeline) */}
        <section className="bg-white rounded-2xl p-5 border border-[#EFE9DF] shadow-2xs space-y-5">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base sm:text-lg text-[#201A15]">
              Catering Progress
            </h3>

            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#8A8074]">
              STEP {currentStep} OF 5
            </span>
          </div>

          {/* Vertical Stepper Timeline */}
          <div className="space-y-4 pt-1">
            {/* Step 1: New (Done) */}
            <div className="flex items-start gap-3.5 relative">
              {/* Icon Circle & Vertical Line */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-7 h-7 rounded-full bg-[#705535] text-white flex items-center justify-center shadow-xs">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div className="w-0.5 bg-[#705535] h-8 sm:h-9 my-1" />
              </div>

              {/* Text Details */}
              <div className="pt-0.5 space-y-0.5">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-sm sm:text-base text-[#201A15]">
                    New
                  </span>
                  <span className="text-xs text-[#8A8074]">12:40 PM</span>
                </div>
                <p className="text-xs text-[#7A6F63]">
                  Order received &amp; registered in ROOM folio
                </p>
              </div>
            </div>

            {/* Step 2: Accepted (Done) */}
            <div className="flex items-start gap-3.5 relative">
              {/* Icon Circle & Vertical Line */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-7 h-7 rounded-full bg-[#705535] text-white flex items-center justify-center shadow-xs">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div className="w-0.5 bg-[#705535] h-8 sm:h-9 my-1" />
              </div>

              {/* Text Details */}
              <div className="pt-0.5 space-y-0.5">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-sm sm:text-base text-[#201A15]">
                    Accepted
                  </span>
                  <span className="text-xs text-[#8A8074]">12:42 PM</span>
                </div>
                <p className="text-xs text-[#7A6F63]">
                  Kitchen acknowledged order &amp; inventory verified
                </p>
              </div>
            </div>

            {/* Step 3: Preparing (Current) */}
            <div className="flex items-start gap-3.5 relative">
              {/* Icon Circle & Vertical Line */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-7 h-7 rounded-full bg-[#FCEEE1] border border-[#F6D7BC] text-[#8C5D29] flex items-center justify-center shadow-xs">
                  <SteamingPanIcon className="w-4 h-4 text-[#8C5D29]" />
                </div>
                <div className="w-0.5 bg-[#EAE3D9] h-8 sm:h-9 my-1" />
              </div>

              {/* Text Details */}
              <div className="pt-0.5 space-y-0.5">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-sm sm:text-base text-[#705535]">
                    Preparing
                  </span>
                  <span className="text-xs font-bold text-[#C27E43]">Current</span>
                </div>
                <p className="text-xs text-[#7A6F63]">
                  In-house culinary atelier crafting your items
                </p>
              </div>
            </div>

            {/* Step 4: Ready (Pending) */}
            <div className="flex items-start gap-3.5 relative">
              {/* Icon Circle & Vertical Line */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-7 h-7 rounded-full bg-[#F2EDE7] text-[#A89F93] flex items-center justify-center border border-[#E5DFD5]">
                  <SilverTrayIcon className="w-4 h-4 text-[#A89F93]" />
                </div>
                <div className="w-0.5 bg-[#EAE3D9] h-8 sm:h-9 my-1" />
              </div>

              {/* Text Details */}
              <div className="pt-0.5 space-y-0.5">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-sm sm:text-base text-[#554C42]">
                    Ready
                  </span>
                  <span className="text-xs text-[#A89F93]">Pending</span>
                </div>
                <p className="text-xs text-[#9E9486]">
                  Plated, cloched &amp; staged for silver-tray delivery
                </p>
              </div>
            </div>

            {/* Step 5: Delivered (Pending) */}
            <div className="flex items-start gap-3.5 relative">
              {/* Icon Circle */}
              <div className="w-7 h-7 rounded-full bg-[#F2EDE7] text-[#A89F93] flex items-center justify-center border border-[#E5DFD5] shrink-0">
                <SuiteDoorIcon className="w-4 h-4 text-[#A89F93]" />
              </div>

              {/* Text Details */}
              <div className="pt-0.5 space-y-0.5">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-sm sm:text-base text-[#554C42]">
                    Delivered
                  </span>
                  <span className="text-xs text-[#A89F93]">Pending</span>
                </div>
                <p className="text-xs text-[#9E9486]">
                  Placed in ROOM {roomNumber} dining area
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Card 4: Order Summary */}
        <section className="bg-white rounded-2xl p-5 border border-[#EFE9DF] shadow-2xs space-y-4">
          {/* Header Row */}
          <div className="flex items-center justify-between border-b border-[#F2ECE3] pb-3">
            <h3 className="font-bold text-base sm:text-lg text-[#201A15] leading-tight">
              Order
              <br />
              Summary
            </h3>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EDE7DE] text-[#695D50] text-[10px] font-bold uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5 text-[#695D50]" />
              <span>KITCHEN REQUISITION</span>
            </div>
          </div>

          {/* Dish Item 1 */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[#201A15]">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm sm:text-base text-[#201A15]">
                  {isLiteralMockup ? '{food_name}' : 'Overwater Continental Breakfast'}
                </span>
                <span className="bg-[#EAE4DC] text-[#695D50] text-[10px] font-bold px-2 py-0.5 rounded">
                  Qty: {isLiteralMockup ? '{quantity}' : '1'}
                </span>
              </div>
              <span className="font-bold text-sm sm:text-base text-[#201A15]">
                ₹{isLiteralMockup ? '{item_total}' : '1,030'}
              </span>
            </div>
            <p className="text-xs text-[#8A8074]">
              {isLiteralMockup ? '{selected_options}' : 'Fresh Croissants, Tropical Fruits, Espresso'}
            </p>
          </div>

          {/* Dish Item 2: Highland Roasted Artisanal Greens */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-[#201A15]">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm sm:text-base text-[#201A15] truncate max-w-[200px] sm:max-w-none">
                  Highland Roasted Artisanal Gr...
                </span>
                <span className="bg-[#EAE4DC] text-[#695D50] text-[10px] font-bold px-2 py-0.5 rounded">
                  Qty: 1
                </span>
              </div>
              <span className="font-bold text-sm sm:text-base text-[#201A15]">
                ₹620
              </span>
            </div>
            <p className="text-xs text-[#8A8074]">
              Vinaigrette on side • No shallots
            </p>
          </div>

          {/* Total Box */}
          <div className="bg-[#F9F6F1] rounded-xl p-4 border border-[#ECE5DB] space-y-2">
            <div className="flex justify-between items-center text-xs text-[#7A6F63]">
              <span>Direct ROOM Folio Billing</span>
              <span>Room {roomNumber}</span>
            </div>
            <div className="flex justify-between items-baseline pt-1 border-t border-[#EDE5DA]">
              <span className="font-bold text-base sm:text-lg text-[#201A15]">
                Total
              </span>
              <span className="font-serif text-xl sm:text-2xl font-bold text-[#705535]">
                ₹{isLiteralMockup ? '{order_total}' : '1,650'}
              </span>
            </div>
          </div>
        </section>

        {/* Card 5: Concierge Assistance Card */}
        <section className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#EFE9DF] flex items-start gap-3 text-xs text-[#6B6155] leading-relaxed shadow-2xs">
          <div className="w-8 h-8 rounded-full bg-[#EAE2D8] flex items-center justify-center text-[#705535] shrink-0 mt-0.5">
            <Headphones className="w-4 h-4 text-[#705535]" />
          </div>
          <div>
            Need to modify your order? Contact Concierge Desk at{' '}
            <strong className="font-bold text-[#201A15]">{isLiteralMockup ? '{phone_number}' : '+91 22 4589 1200'}</strong>{' '}
            or dial <strong className="font-bold text-[#201A15]">Ext 0</strong> from your ROOM phone.
          </div>
        </section>
      </main>

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

          {/* 2. Orders (Active) */}
          <Link
            href="/guest/orders"
            className="flex flex-col items-center justify-center gap-1 text-[#705535] font-bold text-xs transition"
          >
            <ClocheIcon className="w-5 h-5 text-[#705535]" />
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

export default function OrderStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#705535] border-t-transparent animate-spin" />
        </div>
      }
    >
      <OrderStatusContent />
    </Suspense>
  );
}
