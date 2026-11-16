'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Check,
  Clock,
  Bed,
  CheckCircle2,
  Home,
  ShieldCheck,
  Sparkles,
  Droplets,
  Flower2,
  Shirt,
  Wrench,
  ConciergeBell,
  ArrowRight,
} from 'lucide-react';
import { useNivora } from '@/context/NivoraContext';

/* Custom SVG Icons for Screen 8 */
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

function FoldedTowelIcon({ className = 'w-5 h-5' }: { className?: string }) {
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

function WaterBottleIcon({ className = 'w-5 h-5' }: { className?: string }) {
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
      <path d="M9 2h6v3H9z" />
      <path d="M10 5v2a3 3 0 0 1-1 2.2V20a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V9.2A3 3 0 0 1 14 7V5" />
      <line x1="9" y1="13" x2="15" y2="13" />
    </svg>
  );
}

function IroningIcon({ className = 'w-5 h-5' }: { className?: string }) {
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
      <path d="M3 18h18l-3-8H5l-2 8z" />
      <path d="M6 10V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4" />
      <line x1="7" y1="14" x2="7.01" y2="14" />
    </svg>
  );
}

interface ServiceCategory {
  id: string;
  name: string;
  badge?: string;
  badgeType?: 'bronze' | 'neutral';
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  allocations: string[];
}

const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'towels',
    name: 'Extra Towels',
    badge: 'Complimentary',
    badgeType: 'bronze',
    description: 'Fresh plush Egyptian cotton bath sheets, hand towels, or bath mat.',
    icon: FoldedTowelIcon,
    allocations: ['2 Bath Towels', '4 Bath Towels', 'Full ROOM Set', 'Floor Mat'],
  },
  {
    id: 'water',
    name: 'Drinking Water',
    badge: 'Signature',
    badgeType: 'neutral',
    description: 'Bottled still or sparkling natural mineral water carafes chilled on ice.',
    icon: WaterBottleIcon,
    allocations: ['2 Still Bottles', '2 Sparkling Carafes', 'Chilled Ice Bucket', 'Full Hydration Set'],
  },
  {
    id: 'toiletries',
    name: 'Toiletries',
    description: 'Artisanal shampoo, conditioner, dental kit, shaving set, or vanity ROOM set.',
    icon: Flower2,
    allocations: ['Dental & Shaving Kit', 'Bath Foam & Salts', 'Vanity Grooming Set', 'Complete Toiletries'],
  },
  {
    id: 'housekeeping',
    name: 'Housekeeping',
    description: 'Full ROOM refresh, evening turn-down service, or botanical linen renewal.',
    icon: Bed,
    allocations: ['Evening Turn-down', 'Full Room Refresh', 'Linen Renewal', 'Quick Tidy-up'],
  },
  {
    id: 'laundry',
    name: 'Laundry & Pressing',
    description: 'Express dry cleaning, delicate garment pressing, or valet collection.',
    icon: IroningIcon,
    allocations: ['Garment Pressing (2 pcs)', 'Express Dry Clean', 'Shoe Polish & Valet', 'Suit Steaming'],
  },
  {
    id: 'maintenance',
    name: 'Maintenance',
    description: 'Climate adjustment, lighting scenes, multimedia AV, or bathroom fixtures.',
    icon: Wrench,
    allocations: ['Climate Temperature', 'Lighting Scene Setting', 'TV & AV Support', 'Plumbing Check'],
  },
  {
    id: 'other',
    name: 'Other Request',
    description: 'Special custom arrangements or bespoke concierge assistance.',
    icon: ConciergeBell,
    allocations: ['Pillow Menu Selection', 'Luggage Assistance', 'Floral Arrangement', 'Custom Request'],
  },
];

function RoomServiceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { guest, addRoomRequest } = useNivora();

  const queryRoom = searchParams.get('room');
  const roomNumber = queryRoom || guest?.roomNumber || '{room_number}';

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isRequestSuccess, setIsRequestSuccess] = useState(false);
  const [successTicketId, setSuccessTicketId] = useState<string>('#SR-8491');

  const queryCategory = searchParams.get('category');
  const initialCategory = React.useMemo(() => {
    if (!queryCategory) return SERVICE_CATEGORIES[0];
    const cat = queryCategory.toLowerCase();
    return (
      SERVICE_CATEGORIES.find(
        (c) => c.id.toLowerCase() === cat || c.name.toLowerCase().includes(cat)
      ) || SERVICE_CATEGORIES[0]
    );
  }, [queryCategory]);

  // Selected Service Category (Default: Extra Towels matching the screenshot)
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>(initialCategory);

  // Selected Allocation Chip
  const [selectedAllocation, setSelectedAllocation] = useState<string>(initialCategory.allocations[0]);

  // Special Request Note
  const [requestNote, setRequestNote] = useState<string>('');

  // Delivery Window: 'standard' | 'schedule'
  const [deliveryWindow, setDeliveryWindow] = useState<'standard' | 'schedule'>('standard');

  // Mode switch: '{var}' | 'live'
  const initialMode = searchParams.get('mode');
  const [isLiteralMockup, setIsLiteralMockup] = useState(initialMode !== 'live');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectCategory = (category: ServiceCategory) => {
    setSelectedCategory(category);
    setSelectedAllocation(category.allocations[0]);
  };

  const handleSubmitRequest = () => {
    const finalNote = [
      selectedAllocation,
      requestNote.trim(),
      deliveryWindow === 'standard' ? 'Standard (15-20 mins)' : 'Scheduled evening',
    ]
      .filter(Boolean)
      .join(' — ');

    const ticket = addRoomRequest({
      roomNumber: roomNumber === '{room_number}' ? '104' : roomNumber,
      guestName: guest?.name || 'In-Room Guest',
      serviceCategory: selectedCategory.name,
      requestItem: selectedAllocation,
      urgency: deliveryWindow === 'standard' ? 'Immediate (10-15 mins)' : 'Later Today',
      notes: finalNote,
    });
    const ticketId = ticket.ticketNumber || '#NV-000000';
    setSuccessTicketId(ticketId);
    showToast(`Request sent to Housekeeping for Room ${roomNumber}!`);
    setTimeout(() => {
      router.push(`/guest/services/confirmation?id=${encodeURIComponent(ticketId)}&room=${encodeURIComponent(roomNumber)}`);
    }, 400);
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

      {/* Main Container - Full Width with Responsive Max Width */}
      <main className="w-full max-w-xl mx-auto px-4 sm:px-6 pt-3 sm:pt-6 space-y-4 sm:space-y-5">
        {/* Top Header Bar */}
        <header className="flex items-center justify-between pt-1 pb-1">
          <div className="flex items-center gap-2">
            <Link
              href="/guest"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#201A15] hover:bg-[#F2ECE3] transition"
              aria-label="Back to Guest Home"
            >
              <ChevronLeft className="w-6 h-6 text-[#201A15]" />
            </Link>

            <h1 className="font-serif text-lg sm:text-xl font-bold text-[#201A15] tracking-tight">
              Room Service
            </h1>
          </div>

          {/* Mode Switcher */}
          <button
            type="button"
            onClick={() => setIsLiteralMockup((v) => !v)}
            className="text-[9px] font-bold px-2 py-1 rounded bg-[#F2EDE7] text-[#7A6F63] hover:text-[#201A15] border border-[#E5DFD5] transition cursor-pointer"
            title="Toggle between Template Mockup and Live View"
          >
            {isLiteralMockup ? '{var}' : 'live'}
          </button>
        </header>

        {/* Card 1: Room & Verification Header Card */}
        <section className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EFE9DF] shadow-2xs space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Bed Icon Circle */}
              <div className="w-11 h-11 rounded-full bg-[#FDF0E2] text-[#8C5D29] flex items-center justify-center shrink-0 border border-[#F6E3CF]">
                <Bed className="w-5 h-5 text-[#8C5D29]" />
              </div>

              {/* Room Info */}
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A8074] leading-none">
                  ROOM
                </p>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#201A15] leading-tight">
                  {roomNumber}
                </h2>
                <p className="text-xs text-[#7A6F63] leading-tight">
                  Direct Butler &amp; Housekeeping Dispatch
                </p>
              </div>
            </div>

            {/* Right Status Badges */}
            <div className="text-right space-y-1">
              <span className="inline-block bg-[#EAE4DC] text-[#695D50] text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                VERIFIED
              </span>
              <p className="text-[9px] font-bold uppercase tracking-wider text-[#8A8074]">
                PRIORITY LINE
              </p>
            </div>
          </div>

          {/* Sub-row: Policy & Zero-Entry ID */}
          <div className="pt-2.5 border-t border-[#F2ECE3] flex items-center justify-between text-[11px] sm:text-xs">
            <div className="flex items-center gap-1.5 text-[#5A5046]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#705535] shrink-0" />
              <span>Policy: In-ROOM amenity dispatch</span>
            </div>

            <span className="font-bold uppercase tracking-wider text-[#201A15] text-[10px] sm:text-[11px]">
              ZERO-ENTRY ROOM ID
            </span>
          </div>
        </section>

        {/* Card 2: Luxury Suite Interior Hero Banner */}
        <section className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden shadow-xs select-none bg-[#2C241E]">
          <Image
            src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"
            alt="Nivora Luxury Suite Bedroom"
            fill
            unoptimized
            className="object-cover"
            priority
          />
          {/* Subtle warm vignette gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent pointer-events-none" />

          {/* Text Overlay on Bottom Left */}
          <div className="absolute bottom-4 left-4 right-4 text-white space-y-0.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E8DCCB]">
              BESPOKE GUEST SERVICES
            </p>
            <h3 className="font-serif text-lg sm:text-2xl font-bold text-white tracking-tight leading-snug">
              What may we prepare for you?
            </h3>
          </div>
        </section>

        {/* Section: Select Service Request */}
        <section className="space-y-3">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#201A15]">
              Select Service Request
            </h3>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#8A8074]">
              1 CATEGORY SELECTED
            </span>
          </div>

          <p className="text-xs text-[#7A6F63]">
            Dedicated team will attend directly to ROOM {roomNumber}.
          </p>

          {/* Service Cards List */}
          <div className="space-y-2.5 pt-1">
            {SERVICE_CATEGORIES.map((category) => {
              const isSelected = selectedCategory.id === category.id;
              const IconComp = category.icon;

              return (
                <div
                  key={category.id}
                  onClick={() => handleSelectCategory(category)}
                  className={`rounded-2xl p-4 border transition-all cursor-pointer relative shadow-2xs ${
                    isSelected
                      ? 'bg-[#FDF6EF] border-[#F2D7BF] ring-1 ring-[#E2B792]/40'
                      : 'bg-white border-[#EFE9DF] hover:border-[#DDD4C7] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Icon Box */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#705535] text-white shadow-xs'
                          : 'bg-[#F4EFEB] text-[#705535]'
                      }`}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>

                    {/* Content Details */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm sm:text-base text-[#201A15]">
                          {category.name}
                        </span>

                        {category.badge && (
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              category.badgeType === 'bronze'
                                ? 'bg-[#5D462D] text-white'
                                : 'bg-[#EDE7DE] text-[#695D50]'
                            }`}
                          >
                            {category.badge}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#7A6F63] leading-relaxed">
                        {category.description}
                      </p>
                    </div>

                    {/* Selected Checkmark on Right */}
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-[#705535] text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section: Request Details */}
        <section className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EFE9DF] shadow-2xs space-y-4">
          {/* Header Row */}
          <div className="flex items-center justify-between border-b border-[#F2ECE3] pb-3">
            <h3 className="font-serif text-lg font-bold text-[#201A15]">
              Request Details
            </h3>

            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#8A8074]">
              {isLiteralMockup
                ? '{SERVICE_CATEGORY}'
                : selectedCategory.name.toUpperCase()}
            </span>
          </div>

          {/* Recommended Allocation Chips */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">
              RECOMMENDED ALLOCATION
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              {selectedCategory.allocations.map((alloc) => {
                const isActive = selectedAllocation === alloc;
                return (
                  <button
                    key={alloc}
                    type="button"
                    onClick={() => setSelectedAllocation(alloc)}
                    className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer select-none ${
                      isActive
                        ? 'bg-[#705535] text-white shadow-xs'
                        : 'bg-[#EDE7DE] text-[#5A5046] hover:bg-[#E2DACF]'
                    }`}
                  >
                    {alloc}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Describe Your Request Note Box */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">
                DESCRIBE YOUR REQUEST
              </span>
              <span className="text-[#8A8074] text-[11px]">Optional Note</span>
            </div>

            <textarea
              rows={3}
              value={requestNote}
              onChange={(e) => setRequestNote(e.target.value)}
              placeholder={isLiteralMockup ? '{request_note}' : 'e.g. Please leave extra bath sheet on the vanity table.'}
              className="w-full bg-[#F8F5F0] border border-[#E8E2D8] rounded-xl p-3 text-xs text-[#201A15] placeholder:text-[#A89F93] focus:outline-none focus:ring-1 focus:ring-[#705535] focus:border-[#705535] transition resize-none"
            />

            <p className="text-[11px] text-[#8A8074] leading-tight">
              Attendant will knock gently unless Do Not Disturb is toggled.
            </p>
          </div>

          {/* Delivery Window */}
          <div className="space-y-2 pt-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">
              DELIVERY WINDOW
            </p>

            <div className="grid grid-cols-2 gap-3">
              {/* Option 1: Standard (15–20 minutes) */}
              <div
                onClick={() => setDeliveryWindow('standard')}
                className={`p-3 rounded-xl border transition cursor-pointer select-none space-y-0.5 ${
                  deliveryWindow === 'standard'
                    ? 'bg-[#FDF0E2] border-[#F6D7BC] ring-1 ring-[#F6D7BC]'
                    : 'bg-[#F8F5F0] border-[#E8E2D8] hover:bg-[#F2ECE3]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs sm:text-sm text-[#201A15]">
                    Standard
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#705535]" />
                </div>
                <p className="text-[11px] text-[#7A6F63]">15–20 minutes</p>
              </div>

              {/* Option 2: Schedule Later */}
              <div
                onClick={() => setDeliveryWindow('schedule')}
                className={`p-3 rounded-xl border transition cursor-pointer select-none space-y-0.5 ${
                  deliveryWindow === 'schedule'
                    ? 'bg-[#FDF0E2] border-[#F6D7BC] ring-1 ring-[#F6D7BC]'
                    : 'bg-[#F8F5F0] border-[#E8E2D8] hover:bg-[#F2ECE3]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs sm:text-sm text-[#201A15]">
                    Schedule Later
                  </span>
                  <Clock className="w-3.5 h-3.5 text-[#8A8074]" />
                </div>
                <p className="text-[11px] text-[#7A6F63]">Pick evening hour</p>
              </div>
            </div>
          </div>
        </section>

        {/* Guaranteed Nivora Standard Banner */}
        <section className="bg-[#FAF7F2] rounded-2xl p-3.5 sm:p-4 border border-[#EFE9DF] flex items-center gap-3.5 shadow-2xs">
          {/* Butler Avatar Image */}
          <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border border-[#DDD3C7] shadow-xs">
            <Image
              src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=300&q=80"
              alt="Certified Luxury Hospitality Butler"
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          <div className="space-y-0.5">
            <h4 className="font-bold text-xs sm:text-sm text-[#201A15] leading-snug">
              Guaranteed Nivora Standard
            </h4>
            <p className="text-xs text-[#7A6F63] leading-snug">
              Every request is fulfilled by certified luxury hospitality attendants.
            </p>
          </div>
        </section>

        {/* Request Service Action Button & Dispatch Note */}
        <div className="pt-2 space-y-2 text-center">
          <button
            type="button"
            onClick={handleSubmitRequest}
            className="w-full py-4 px-6 rounded-2xl bg-[#705535] hover:bg-[#5C452A] text-white font-bold text-sm sm:text-base shadow-md flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
          >
            <span>Request Service</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#8A8074] text-center leading-tight">
            AUTOMATED DISPATCH TO HOUSEKEEPING FOR ROOM{' '}
            {isLiteralMockup ? '{ROOM_NUMBER}' : roomNumber}
          </p>
        </div>
      </main>

      {/* Fixed Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAE3D8] shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-around h-16 px-4">
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

          {/* 3. Room Service (Active) */}
          <Link
            href="/guest/services"
            className="flex flex-col items-center justify-center gap-1 text-[#705535] font-bold text-xs transition"
          >
            <ConciergeHandBellIcon className="w-5 h-5 text-[#705535]" />
            <span className="leading-none">Room Service</span>
          </Link>
        </div>
      </nav>

      {/* Confirmation Modal */}
      {isRequestSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#EFE9DF] text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#705535]">
                Request Confirmed
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#201A15]">
                {successTicketId}
              </h3>
              <p className="text-xs text-[#665E55]">
                Your request for <strong>{selectedCategory.name}</strong> ({selectedAllocation}) has been dispatched to Housekeeping.
              </p>
            </div>

            <div className="rounded-2xl border border-[#EFE9DF] bg-[#FAF8F5] p-4 text-xs text-[#554C42] text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-[#887E72]">Destination:</span>
                <strong className="text-[#201A15]">ROOM {roomNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#887E72]">Estimated Time:</span>
                <span className="text-[#201A15] font-semibold">15–20 minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#887E72]">Billing:</span>
                <span className="text-emerald-700 font-bold">Complimentary In-Room Guest Service</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setIsRequestSuccess(false)}
                className="w-full py-3.5 px-4 rounded-xl bg-[#705535] hover:bg-[#5C452A] text-white font-bold text-xs shadow-md transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RoomServicePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#705535] border-t-transparent animate-spin" />
        </div>
      }
    >
      <RoomServiceContent />
    </Suspense>
  );
}
