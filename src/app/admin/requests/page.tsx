'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
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
  Search,
  RotateCw,
  X,
  Lock,
  MinusCircle,
  ClipboardCheck,
  Footprints,
  GitFork,
  ChevronDown,
  Sparkles,
  Wrench,
  Shirt,
  Droplets,
  Check,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  User,
  Shield,
  Printer,
} from 'lucide-react';
import { useNivora } from '@/context/NivoraContext';
import { useAdminAuth } from '@/lib/useAdminAuth';
import { requestsService } from '@/services/requestsService';
import { BackendRequestStatus } from '@/types/api';

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

function WaterBottleIcon({ className = 'w-4 h-4' }: { className?: string }) {
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

function IroningIcon({ className = 'w-4 h-4' }: { className?: string }) {
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

function FlowerLotusIcon({ className = 'w-4 h-4' }: { className?: string }) {
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
      <path d="M12 3c-2 4-3 7-3 10a3 3 0 0 0 6 0c0-3-1-6-3-10z" />
      <path d="M5 14c2-4 5-6 7-6s5 2 7 6" />
      <path d="M3 18c3-2 6-2 9-2s6 0 9 2" />
    </svg>
  );
}

export type RequestStatusCategory = 'NEW' | 'ACCEPTED' | 'IN PROGRESS' | 'COMPLETED' | 'REJECTED';

export interface RoomRequestItem {
  id: string;
  roomTemplate: string;
  roomLive: string;
  wing: string;
  service: string;
  serviceCategory: 'Extra Towels' | 'Housekeeping' | 'Drinking Water' | 'Toiletries' | 'Maintenance' | 'Laundry' | 'Other Request';
  guestNote: string;
  subTag?: string;
  subTagType?: 'priority' | 'assigned' | 'completed' | 'info';
  status: RequestStatusCategory;
  timeLogged: string;
  timeAgo: string;
  assignedStaff?: string;
}

function AdminRoomRequestsContent() {
  const searchParams = useSearchParams();
  const { logout } = useAdminAuth(true);
  const { guest } = useNivora();

  // Template toggle mode: {var} vs live
  const initialMode = searchParams.get('mode');
  const [isLiteralMockup, setIsLiteralMockup] = useState(initialMode !== 'live');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceFilter, setSelectedServiceFilter] = useState('All Services');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showPushBanner, setShowPushBanner] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<RoomRequestItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 7 Mockup items matching the user's Figma screenshot
  const initialRequests: RoomRequestItem[] = useMemo(
    () => [
      {
        id: '#NV-000000',
        roomTemplate: '{ ROOM :Number }',
        roomLive: 'ROOM 305',
        wing: 'Villa Del Mar',
        service: 'Extra Towels',
        serviceCategory: 'Extra Towels',
        guestNote: '"4x plush bath towels and 2x bath sheets by vanity. High privacy..."',
        subTag: 'HIGH PRIORITY',
        subTagType: 'priority',
        status: 'NEW',
        timeLogged: '12:48 PM',
        timeAgo: '2m ago',
        assignedStaff: 'Unassigned',
      },
      {
        id: '#NV-000000',
        roomTemplate: '{ ROOM :Number }',
        roomLive: 'ROOM 412',
        wing: 'Ocean Wing East',
        service: 'Housekeeping',
        serviceCategory: 'Housekeeping',
        guestNote: '"Evening turn-down service requested between 7:00 - 7:30..."',
        subTag: 'Assigned: Dispatch Runner #3',
        subTagType: 'assigned',
        status: 'ACCEPTED',
        timeLogged: '12:35 PM',
        timeAgo: '15m ago',
        assignedStaff: 'Dispatch Runner #3',
      },
      {
        id: '#NV-000000',
        roomTemplate: '{ ROOM :Number }',
        roomLive: 'ROOM 208',
        wing: 'Palm Pavilion',
        service: 'Drinking Water',
        serviceCategory: 'Drinking Water',
        guestNote: '"3 chilled bottles of artisanal sparkling mineral water with fresh"',
        subTag: 'Runner: Marco S. (Floor 5)',
        subTagType: 'assigned',
        status: 'IN PROGRESS',
        timeLogged: '12:18 PM',
        timeAgo: '32m ago',
        assignedStaff: 'Marco S. (Floor 5)',
      },
      {
        id: '#NV-000000',
        roomTemplate: '{ ROOM :Number }',
        roomLive: 'ROOM 502',
        wing: 'Royal Penthouse',
        service: 'Toiletries',
        serviceCategory: 'Toiletries',
        guestNote: '"Replenish luxury botanical bath amenities (shampoo, body balm)."',
        subTag: 'Runner: Elena V.',
        subTagType: 'assigned',
        status: 'IN PROGRESS',
        timeLogged: '12:05 PM',
        timeAgo: '45m ago',
        assignedStaff: 'Elena V.',
      },
      {
        id: '#NV-000000',
        roomTemplate: '{ ROOM :Number }',
        roomLive: 'ROOM 118',
        wing: 'Garden Terrace',
        service: 'Maintenance',
        serviceCategory: 'Maintenance',
        guestNote: '"Master bathroom climate controller calibration check."',
        subTag: 'Technician notified',
        subTagType: 'info',
        status: 'ACCEPTED',
        timeLogged: '11:40 AM',
        timeAgo: '1h 10m ago',
        assignedStaff: 'Engineering On-Duty',
      },
      {
        id: '#NV-000000',
        roomTemplate: '{ ROOM :Number }',
        roomLive: 'ROOM 314',
        wing: 'Villa Del Mar',
        service: 'Laundry',
        serviceCategory: 'Laundry',
        guestNote: '"Urgent evening pressing for 2 formal garments before 6 PM."',
        subTag: 'Delivered & Hung in Wardrobe',
        subTagType: 'completed',
        status: 'COMPLETED',
        timeLogged: '11:15 AM',
        timeAgo: '1h 35m ago',
        assignedStaff: 'Valet Pressing Attendant',
      },
      {
        id: '#NV-000000',
        roomTemplate: '{ ROOM :Number }',
        roomLive: 'ROOM 401',
        wing: 'Lagoon Villas',
        service: 'Other Request',
        serviceCategory: 'Other Request',
        guestNote: '"Request baby cot setup with hypoallergenic infant bedding."',
        subTag: 'Delivered by Concierge Support',
        subTagType: 'completed',
        status: 'COMPLETED',
        timeLogged: '10:30 AM',
        timeAgo: '2h 20m ago',
        assignedStaff: 'Concierge Support Team',
      },
    ],
    []
  );

  const [requestsList, setRequestsList] = useState<RoomRequestItem[]>(initialRequests);

  useEffect(() => {
    let active = true;
    requestsService.getRequests()
      .then((res) => {
        if (!active || !res?.requests) return;
        if (res.requests.length > 0) {
          const mapped: RoomRequestItem[] = res.requests.map((r) => {
            const catName = (r.service_category_name || 'Housekeeping') as RoomRequestItem['serviceCategory'];
            return {
              id: r.request_number || `#NV-${r.id.slice(0, 6)}`,
              roomTemplate: '{ ROOM :Number }',
              roomLive: `ROOM ${r.room_number || '104'}`,
              wing: 'Villa Del Mar',
              service: catName,
              serviceCategory: catName,
              guestNote: r.custom_request ? `"${r.custom_request}"` : 'Guest Requisition logged.',
              subTag: r.status === 'NEW' ? 'HIGH PRIORITY' : undefined,
              subTagType: r.status === 'NEW' ? 'priority' : 'info',
              status: (r.status === 'IN_PROGRESS' ? 'IN PROGRESS' : r.status) as RequestStatusCategory,
              timeLogged: new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              timeAgo: 'recently',
              assignedStaff: 'On-Duty Dispatch',
            };
          });
          setRequestsList(mapped);
        }
      })
      .catch((err) => {
        console.warn('Requests live fetch fallback:', err);
      });

    return () => {
      active = false;
    };
  }, []);

  // Filter requests
  const filteredRequests = useMemo(() => {
    return requestsList.filter((req) => {
      // Status filter
      if (statusFilter !== 'ALL' && req.status !== statusFilter) {
        return false;
      }

      // Service filter
      if (selectedServiceFilter !== 'All Services' && req.serviceCategory !== selectedServiceFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = req.id.toLowerCase().includes(q);
        const matchesRoom = req.roomLive.toLowerCase().includes(q) || req.roomTemplate.toLowerCase().includes(q);
        const matchesNote = req.guestNote.toLowerCase().includes(q);
        const matchesService = req.service.toLowerCase().includes(q);
        if (!matchesId && !matchesRoom && !matchesNote && !matchesService) {
          return false;
        }
      }

      return true;
    });
  }, [requestsList, statusFilter, selectedServiceFilter, searchQuery]);

  // Handle Action changes for request modal
  const handleUpdateStatus = (reqId: string, newStatus: RequestStatusCategory) => {
    setRequestsList((prev) =>
      prev.map((item) => (item.id === reqId ? { ...item, status: newStatus } : item))
    );
    if (selectedRequest && selectedRequest.id === reqId) {
      setSelectedRequest((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showToast(`Request status updated to ${newStatus}`);
  };

  // Render Service Icon for badge
  const renderServiceIcon = (category: string) => {
    switch (category) {
      case 'Extra Towels':
        return <FoldedTowelIcon className="w-3.5 h-3.5 text-[#705535]" />;
      case 'Housekeeping':
        return <Bed className="w-3.5 h-3.5 text-[#705535]" />;
      case 'Drinking Water':
        return <WaterBottleIcon className="w-3.5 h-3.5 text-[#705535]" />;
      case 'Toiletries':
        return <FlowerLotusIcon className="w-3.5 h-3.5 text-[#705535]" />;
      case 'Maintenance':
        return <Wrench className="w-3.5 h-3.5 text-[#705535]" />;
      case 'Laundry':
        return <IroningIcon className="w-3.5 h-3.5 text-[#705535]" />;
      case 'Other Request':
      default:
        return <ConciergeHandBellIcon className="w-3.5 h-3.5 text-[#705535]" />;
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
          {/* Breadcrumb & Top Bar */}
          <div className="flex items-center justify-between">
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-[#7A6F63]">
              <span className="uppercase tracking-wider text-[11px] font-semibold">OPERATIONS</span>
              <span className="text-[#C2B7A8]">/</span>
              <span className="font-serif font-bold text-[#201A15] text-sm sm:text-base">
                Concierge Live Desk
              </span>
            </nav>

            <div className="flex items-center gap-4">
              {/* Variable vs Live data switcher */}
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

          {/* Header Title & Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#8A8074]">
                OPERATIONS / ROOM REQUESTS
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#201A15] tracking-tight">
                Room Service &amp; Amenity Desk
              </h2>
              <p className="text-xs sm:text-sm text-[#665D52]">
                Real-time dispatch and guest hospitality fulfillment across all ROOMs and cabanas.
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
                onClick={() => showToast('Requests synchronized with hotel PMS')}
                className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-[#E8E2D8] text-[#705535] shadow-2xs hover:bg-[#FAF7F2] transition cursor-pointer active:scale-95"
                title="Refresh Requests"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 6 Metric Stat Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-3.5">
            {/* Card 1: ALL REQUESTS */}
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`bg-white rounded-2xl p-4 border text-left transition cursor-pointer hover:border-[#85653C] ${
                statusFilter === 'ALL' ? 'border-[#85653C] shadow-xs' : 'border-[#EFE9DF] shadow-2xs'
              } space-y-1`}
            >
              <div className="flex items-center justify-between text-[#8A8074]">
                <p className="text-[10px] font-bold uppercase tracking-wider">ALL REQUESTS</p>
                <GitFork className="w-3.5 h-3.5 text-[#8A8074]" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#201A15]">18</span>
                <span className="text-xs text-[#7A6F63]">Total</span>
              </div>
              <p className="text-[10px] text-[#8A8074]">100% active folio log</p>
            </button>

            {/* Card 2: NEW (Action Required) */}
            <button
              type="button"
              onClick={() => setStatusFilter('NEW')}
              className={`bg-white rounded-2xl p-4 border text-left transition cursor-pointer hover:border-[#F6D7BC] ${
                statusFilter === 'NEW' ? 'border-[#C27E43] ring-1 ring-[#C27E43]' : 'border-[#F6D7BC]'
              } shadow-2xs space-y-1 relative overflow-hidden`}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#C27E43]" />
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#8C5D29]">NEW</p>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C27E43]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#8C5D29]">4</span>
                <span className="bg-[#FDF0E2] text-[#8C5D29] text-[9px] font-bold px-2 py-0.5 rounded-full">
                  Action Req
                </span>
              </div>
              <p className="text-[10px] text-[#8C5D29]">Avg. wait: 1.4 min</p>
            </button>

            {/* Card 3: ACCEPTED */}
            <button
              type="button"
              onClick={() => setStatusFilter('ACCEPTED')}
              className={`bg-white rounded-2xl p-4 border text-left transition cursor-pointer hover:border-[#85653C] ${
                statusFilter === 'ACCEPTED' ? 'border-[#85653C] shadow-xs' : 'border-[#EFE9DF] shadow-2xs'
              } space-y-1`}
            >
              <div className="flex items-center justify-between text-[#8A8074]">
                <p className="text-[10px] font-bold uppercase tracking-wider">ACCEPTED</p>
                <ClipboardCheck className="w-3.5 h-3.5 text-[#8A8074]" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#201A15]">3</span>
                <span className="text-xs text-[#7A6F63]">Dispatched</span>
              </div>
              <p className="text-[10px] text-[#8A8074]">Queued for runner</p>
            </button>

            {/* Card 4: IN PROGRESS */}
            <button
              type="button"
              onClick={() => setStatusFilter('IN PROGRESS')}
              className={`bg-white rounded-2xl p-4 border text-left transition cursor-pointer hover:border-[#85653C] ${
                statusFilter === 'IN PROGRESS' ? 'border-[#85653C] shadow-xs' : 'border-[#EFE9DF] shadow-2xs'
              } space-y-1`}
            >
              <div className="flex items-center justify-between text-[#8A8074]">
                <p className="text-[10px] font-bold uppercase tracking-wider">IN PROGRESS</p>
                <Footprints className="w-3.5 h-3.5 text-[#8A8074]" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#201A15]">5</span>
                <span className="text-xs text-[#7A6F63]">Underway</span>
              </div>
              <p className="text-[10px] text-[#8A8074]">Runners en route</p>
            </button>

            {/* Card 5: COMPLETED */}
            <button
              type="button"
              onClick={() => setStatusFilter('COMPLETED')}
              className={`bg-white rounded-2xl p-4 border text-left transition cursor-pointer hover:border-[#85653C] ${
                statusFilter === 'COMPLETED' ? 'border-[#85653C] shadow-xs' : 'border-[#EFE9DF] shadow-2xs'
              } space-y-1`}
            >
              <div className="flex items-center justify-between text-[#8A8074]">
                <p className="text-[10px] font-bold uppercase tracking-wider">COMPLETED</p>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6B44]" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#201A15]">6</span>
                <span className="text-xs font-bold text-[#2E6B44]">Fulfilled</span>
              </div>
              <p className="text-[10px] text-[#8A8074]">Shift target: 100%</p>
            </button>

            {/* Card 6: REJECTED */}
            <button
              type="button"
              onClick={() => setStatusFilter('REJECTED')}
              className={`bg-white rounded-2xl p-4 border text-left transition cursor-pointer hover:border-[#85653C] ${
                statusFilter === 'REJECTED' ? 'border-[#85653C] shadow-xs' : 'border-[#EFE9DF] shadow-2xs'
              } space-y-1`}
            >
              <div className="flex items-center justify-between text-[#8A8074]">
                <p className="text-[10px] font-bold uppercase tracking-wider">REJECTED</p>
                <MinusCircle className="w-3.5 h-3.5 text-[#8A8074]" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#201A15]">0</span>
                <span className="text-xs text-[#7A6F63]">Logged</span>
              </div>
              <p className="text-[10px] text-[#8A8074]">Zero service denials</p>
            </button>
          </div>

          {/* Live Dispatch Push Banner */}
          {showPushBanner && (
            <div className="bg-white rounded-2xl p-4 border border-[#EFE9DF] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#FCEEE1] text-[#8C5D29] flex items-center justify-center shrink-0 border border-[#F6D7BC]">
                  <Bell className="w-4 h-4 text-[#8C5D29]" />
                </div>

                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-[#FDF0E2] text-[#8C5D29] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      NEW REQUEST
                    </span>
                    <span className="text-xs font-bold text-[#201A15]">
                      {isLiteralMockup ? 'ROOM • Villa Del Mar' : 'ROOM 305 • Villa Del Mar'}
                    </span>
                    <span className="text-xs text-[#8A8074]">40s ago</span>
                  </div>

                  <p className="text-xs text-[#554C42]">
                    Guest requested: <strong className="font-semibold text-[#201A15]">Extra Towels &amp; Chilled Drinking Water</strong> (Folio #9821)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <Link
                  href="/admin/requests/details"
                  className="bg-[#705535] hover:bg-[#5C452A] text-white text-xs font-bold px-4 py-2 rounded-xl inline-flex items-center gap-1.5 shadow-xs transition cursor-pointer active:scale-98"
                >
                  <span>Review Request</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={() => setShowPushBanner(false)}
                  className="text-[#8A8074] hover:text-[#201A15] p-1.5 transition cursor-pointer"
                  aria-label="Dismiss banner"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Search & Service Filter Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#8A8074] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search requests by ID"
                className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl pl-9 pr-4 py-2 text-xs text-[#201A15] placeholder:text-[#8A8074] focus:outline-none focus:border-[#705535] transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8074] hover:text-[#201A15]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Service Category Dropdown */}
            <div className="relative">
              <select
                value={selectedServiceFilter}
                onChange={(e) => setSelectedServiceFilter(e.target.value)}
                className="appearance-none bg-white border border-[#E8E2D8] rounded-xl px-4 py-2 pr-9 text-xs font-bold text-[#201A15] shadow-2xs hover:bg-[#FAF7F2] transition cursor-pointer focus:outline-none focus:border-[#705535]"
              >
                <option value="All Services">All Services</option>
                <option value="Extra Towels">Extra Towels</option>
                <option value="Housekeeping">Housekeeping</option>
                <option value="Drinking Water">Drinking Water</option>
                <option value="Toiletries">Toiletries</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Laundry">Laundry</option>
                <option value="Other Request">Other Request</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#705535] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Room Requests Table Container */}
          <div className="bg-white rounded-2xl border border-[#EFE9DF] shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#F2ECE3] bg-[#FAF8F5]/50">
                    <th className="py-3.5 px-4 sm:px-6 text-[10px] font-bold uppercase tracking-wider text-[#8A8074] w-28">
                      REQUEST ID
                    </th>
                    <th className="py-3.5 px-4 sm:px-6 text-[10px] font-bold uppercase tracking-wider text-[#8A8074] w-36">
                      ROOM &amp; WING
                    </th>
                    <th className="py-3.5 px-4 sm:px-6 text-[10px] font-bold uppercase tracking-wider text-[#8A8074] w-36">
                      SERVICE
                    </th>
                    <th className="py-3.5 px-4 sm:px-6 text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">
                      DETAILS &amp; GUEST NOTE
                    </th>
                    <th className="py-3.5 px-4 sm:px-6 text-[10px] font-bold uppercase tracking-wider text-[#8A8074] w-32">
                      STATUS
                    </th>
                    <th className="py-3.5 px-4 sm:px-6 text-[10px] font-bold uppercase tracking-wider text-[#8A8074] w-28 text-right">
                      TIME LOGGED
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F6F2EC] text-xs">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-[#8A8074]">
                        <ConciergeHandBellIcon className="w-8 h-8 mx-auto text-[#C2B7A8] mb-2" />
                        <p className="font-bold text-sm text-[#201A15]">No requests match your filter</p>
                        <p className="text-xs text-[#8A8074] mt-0.5">Try clearing the search or service filter.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((req, idx) => (
                      <tr
                        key={idx}
                        onClick={() => setSelectedRequest(req)}
                        className="hover:bg-[#FAF7F2] transition cursor-pointer group"
                      >
                        {/* 1. Request ID */}
                        <td className="py-4 px-4 sm:px-6 align-middle font-mono font-bold text-[#201A15]">
                          <div className="leading-tight">
                            <span>#NV-</span>
                            <span className="block text-[11px] text-[#7A6F63]">000000</span>
                          </div>
                        </td>

                        {/* 2. Room & Wing */}
                        <td className="py-4 px-4 sm:px-6 align-middle">
                          <p className="font-bold text-sm text-[#201A15]">
                            {isLiteralMockup ? req.roomTemplate : req.roomLive}
                          </p>
                          {!isLiteralMockup && (
                            <p className="text-[10px] text-[#8A8074]">{req.wing}</p>
                          )}
                        </td>

                        {/* 3. Service Pill Badge */}
                        <td className="py-4 px-4 sm:px-6 align-middle">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#EAE3D9] text-xs font-bold text-[#554C42]">
                            {renderServiceIcon(req.serviceCategory)}
                            <span>{req.service}</span>
                          </div>
                        </td>

                        {/* 4. Details & Guest Note */}
                        <td className="py-4 px-4 sm:px-6 align-middle space-y-1">
                          <p className="text-xs text-[#443D35] italic leading-snug">
                            {req.guestNote}
                          </p>

                          {/* Sub Tag (Priority, Assigned Runner, or Completed note) */}
                          {req.subTag && (
                            <div>
                              {req.subTagType === 'priority' ? (
                                <span className="text-[10px] font-bold text-[#C2410C] uppercase tracking-wider">
                                  {req.subTag}
                                </span>
                              ) : req.subTagType === 'completed' ? (
                                <span className="text-[11px] font-semibold text-[#2E6B44]">
                                  {req.subTag}
                                </span>
                              ) : (
                                <span className="text-[11px] text-[#7A6F63]">
                                  {req.subTag}
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* 5. Status Badge */}
                        <td className="py-4 px-4 sm:px-6 align-middle">
                          {req.status === 'NEW' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FDF0E2] text-[#8C5D29] border border-[#F6D7BC] text-[10px] font-bold tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C27E43]" />
                              <span>NEW</span>
                            </span>
                          )}

                          {req.status === 'ACCEPTED' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF0E4] text-[#85653C] border border-[#EFE2D2] text-[10px] font-bold tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#85653C]" />
                              <span>ACCEPTED</span>
                            </span>
                          )}

                          {req.status === 'IN PROGRESS' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EAF3FA] text-[#2970A8] border border-[#D5E6F5] text-[10px] font-bold tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2970A8]" />
                              <span>IN PROGRESS</span>
                            </span>
                          )}

                          {req.status === 'COMPLETED' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EAF5ED] text-[#2E6B44] border border-[#D0EADB] text-[10px] font-bold tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2E6B44]" />
                              <span>COMPLETED</span>
                            </span>
                          )}

                          {req.status === 'REJECTED' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FBF0EE] text-[#C2410C] border border-[#F5D5CE] text-[10px] font-bold tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C]" />
                              <span>REJECTED</span>
                            </span>
                          )}
                        </td>

                        {/* 6. Time Logged */}
                        <td className="py-4 px-4 sm:px-6 align-middle text-right">
                          <p className="font-bold text-xs text-[#201A15]">{req.timeLogged}</p>
                          <p className="text-[11px] text-[#8C5D29] font-medium">{req.timeAgo}</p>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination / Table Footer */}
            <div className="py-3 px-4 sm:px-6 border-t border-[#F2ECE3] bg-[#FAF8F5]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7A6F63]">
              <p>
                Showing <strong className="font-bold text-[#201A15]">{filteredRequests.length}</strong> of{' '}
                <strong className="font-bold text-[#201A15]">18</strong> active room service requests
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg border border-[#E8E2D8] bg-white text-xs font-bold text-[#5A5046] hover:bg-[#FAF7F2] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  Previous
                </button>

                <span className="text-xs font-bold text-[#201A15] px-2">
                  Page {currentPage} of 3
                </span>

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
                  className="px-3 py-1.5 rounded-lg border border-[#E8E2D8] bg-white text-xs font-bold text-[#5A5046] hover:bg-[#FAF7F2] transition cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-over / Modal for Request Details */}
      {selectedRequest && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedRequest(null)}
        >
          <div
            className="bg-[#FAF8F5] rounded-3xl max-w-lg w-full border border-[#EFE9DF] shadow-2xl overflow-hidden p-6 space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#EAE3D9] pb-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-[#201A15]">
                    {selectedRequest.id}
                  </span>
                  <span className="bg-[#FAF0E4] text-[#85653C] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {selectedRequest.status}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#201A15]">
                  {selectedRequest.service} Requisition
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="w-8 h-8 rounded-full bg-[#F2EDE7] text-[#7A6F63] hover:text-[#201A15] flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Room & Service Details */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white rounded-xl p-3 border border-[#EAE3D9] space-y-0.5">
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#8A8074]">DESTINATION</p>
                <p className="font-bold text-[#201A15]">
                  {isLiteralMockup ? selectedRequest.roomTemplate : selectedRequest.roomLive}
                </p>
                <p className="text-[10px] text-[#7A6F63]">{selectedRequest.wing}</p>
              </div>

              <div className="bg-white rounded-xl p-3 border border-[#EAE3D9] space-y-0.5">
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#8A8074]">ASSIGNED STAFF</p>
                <p className="font-bold text-[#201A15]">{selectedRequest.assignedStaff || 'Unassigned'}</p>
                <p className="text-[10px] text-[#7A6F63]">Logged: {selectedRequest.timeLogged}</p>
              </div>
            </div>

            {/* Guest Note */}
            <div className="bg-white rounded-xl p-4 border border-[#EAE3D9] space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">GUEST NOTE &amp; SPECIFICATION</p>
              <p className="text-xs italic text-[#443D35] leading-relaxed">
                {selectedRequest.guestNote}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 pt-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">OPERATIONAL DISPATCH ACTIONS</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedRequest.id, 'ACCEPTED')}
                  className="py-2.5 px-3 rounded-xl bg-[#FAF0E4] hover:bg-[#F2E4D4] text-[#85653C] text-xs font-bold border border-[#EFE2D2] transition cursor-pointer"
                >
                  Accept
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedRequest.id, 'IN PROGRESS')}
                  className="py-2.5 px-3 rounded-xl bg-[#EAF3FA] hover:bg-[#D8EBF7] text-[#2970A8] text-xs font-bold border border-[#D5E6F5] transition cursor-pointer"
                >
                  Dispatch
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedRequest.id, 'COMPLETED')}
                  className="py-2.5 px-3 rounded-xl bg-[#705535] hover:bg-[#5C452A] text-white text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  Complete
                </button>
              </div>

              {/* Full Details Page Link */}
              <div className="pt-3 text-center border-t border-[#EAE3D9]">
                <Link
                  href="/admin/requests/details"
                  className="text-xs font-bold text-[#705535] hover:underline inline-flex items-center gap-1.5"
                >
                  <span>View Full Expediter Slip &amp; Audit Trail</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Bottom Footer */}
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

export default function AdminRoomRequestsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6 text-center">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#705535] border-t-transparent animate-spin mx-auto" />
            <p className="font-serif text-[#201A15] font-bold">Loading Room Requests...</p>
          </div>
        </div>
      }
    >
      <AdminRoomRequestsContent />
    </Suspense>
  );
}
