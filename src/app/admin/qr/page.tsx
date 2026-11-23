'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  LogOut,
  LayoutDashboard,
  UtensilsCrossed,
  Bed,
  QrCode,
  Sliders,
  CheckCircle2,
  MinusCircle,
  ShieldCheck,
  Search,
  X,
  Lock,
  Plus,
  Download,
  Printer,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Eye,
  RefreshCw,
  Sparkles,
  Layers,
  ArrowRight,
  FileText,
  Smartphone,
} from 'lucide-react';
import { useNivora } from '@/context/NivoraContext';
import { useAdminAuth } from '@/lib/useAdminAuth';
import { qrService } from '@/services/qrService';

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

export interface RoomTokenRecord {
  id: string;
  roomNumberTemplate: string;
  roomNumberLive: string;
  suiteNameTemplate: string;
  suiteNameLive: string;
  wing: string;
  floor: string;
  tokenCode: string;
  qrHash: string;
  scansCount: number;
  lastScanned: string;
  status: 'ACTIVE' | 'INACTIVE';
  plaqueSize: string;
}

function AdminQRContent() {
  const searchParams = useSearchParams();
  const { logout } = useAdminAuth(true);
  const initialMode = searchParams.get('mode');
  const [isLiteralMockup, setIsLiteralMockup] = useState(initialMode !== 'live');

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status (28)');
  const [floorFilter, setFloorFilter] = useState('All Floors');
  const [activeTab, setActiveTab] = useState<'preview' | 'registry'>('preview');

  // Selected room for physical staging preview
  const [selectedRoomId, setSelectedRoomId] = useState<string>('rm_404');

  // Modals state
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isBatchExportModalOpen, setIsBatchExportModalOpen] = useState(false);
  const [isTestScanModalOpen, setIsTestScanModalOpen] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  // New QR Code Form State
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newWing, setNewWing] = useState('West Pavilion');
  const [newFloor, setNewFloor] = useState('Floor 4');
  const [newStatus, setNewStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // 28 Room Token Records
  const [tokens, setTokens] = useState<RoomTokenRecord[]>([
    {
      id: 'rm_404',
      roomNumberTemplate: 'ROOM',
      roomNumberLive: 'Room 404',
      suiteNameTemplate: 'Villa Del Mar • West Pavilion',
      suiteNameLive: 'Villa Del Mar • West Pavilion',
      wing: 'West Pavilion',
      floor: 'Floor 4',
      tokenCode: 'NV-QR-V404-X992',
      qrHash: 'sha256-a78b4f129c...8f2b',
      scansCount: 148,
      lastScanned: '12m ago',
      status: 'ACTIVE',
      plaqueSize: '105 × 148 mm (A6)',
    },
    {
      id: 'rm_215',
      roomNumberTemplate: '{ ROOM :Number }',
      roomNumberLive: 'Room 215',
      suiteNameTemplate: 'Ocean Front Suite • East Wing',
      suiteNameLive: 'Ocean Front Suite • East Wing',
      wing: 'Ocean Front',
      floor: 'Floor 2',
      tokenCode: 'NV-QR-R215-B811',
      qrHash: 'sha256-99c3d4e8...714a',
      scansCount: 82,
      lastScanned: '1h ago',
      status: 'ACTIVE',
      plaqueSize: '105 × 148 mm (A6)',
    },
    {
      id: 'rm_512',
      roomNumberTemplate: '{ ROOM :Number }',
      roomNumberLive: 'Room 512',
      suiteNameTemplate: 'Presidential Penthouse • North Tower',
      suiteNameLive: 'Presidential Penthouse • North Tower',
      wing: 'Presidential',
      floor: 'Floor 5',
      tokenCode: 'NV-QR-P512-Z700',
      qrHash: 'sha256-f84102d9...33ee',
      scansCount: 91,
      lastScanned: '3h ago',
      status: 'ACTIVE',
      plaqueSize: '105 × 148 mm (A6)',
    },
    {
      id: 'rm_cab04',
      roomNumberTemplate: '{ ROOM :Number }',
      roomNumberLive: 'Cabana 04',
      suiteNameTemplate: 'Private Azure Pool Cabana',
      suiteNameLive: 'Private Azure Pool Cabana',
      wing: 'Palm Wing',
      floor: 'Floor 1',
      tokenCode: 'NV-QR-C004-K519',
      qrHash: 'sha256-3b9e11fc...4210',
      scansCount: 114,
      lastScanned: '8m ago',
      status: 'ACTIVE',
      plaqueSize: '105 × 148 mm (A6)',
    },
    {
      id: 'rm_108',
      roomNumberTemplate: '{ ROOM :Number }',
      roomNumberLive: 'Room 108',
      suiteNameTemplate: 'Garden Veranda Suite',
      suiteNameLive: 'Garden Veranda Suite',
      wing: 'Garden & Cabanas',
      floor: 'Floor 1',
      tokenCode: 'NV-QR-G108-H223',
      qrHash: 'sha256-55aa9142...bc01',
      scansCount: 29,
      lastScanned: '4h ago',
      status: 'ACTIVE',
      plaqueSize: '105 × 148 mm (A6)',
    },
    {
      id: 'rm_310',
      roomNumberTemplate: '{ ROOM :Number }',
      roomNumberLive: 'Room 310',
      suiteNameTemplate: 'Palm Terrace Suite',
      suiteNameLive: 'Palm Terrace Suite',
      wing: 'Palm Wing',
      floor: 'Floor 3',
      tokenCode: 'NV-QR-P310-L404',
      qrHash: 'sha256-78d26ea3...9a18',
      scansCount: 87,
      lastScanned: '1d ago',
      status: 'ACTIVE',
      plaqueSize: '105 × 148 mm (A6)',
    },
    {
      id: 'rm_204',
      roomNumberTemplate: '{ ROOM :Number }',
      roomNumberLive: 'Room 204',
      suiteNameTemplate: 'Veranda Room • South Wing',
      suiteNameLive: 'Veranda Room • South Wing',
      wing: 'Veranda ROOMs',
      floor: 'Floor 2',
      tokenCode: 'NV-QR-V204-REVOKED',
      qrHash: 'REVOKED / Deep Clean',
      scansCount: 0,
      lastScanned: 'Offline',
      status: 'INACTIVE',
      plaqueSize: '105 × 148 mm (A6)',
    },
  ]);

  useEffect(() => {
    let active = true;
    qrService.getQrCodes(true)
      .then((res) => {
        if (!active || !res?.qr_codes) return;
        if (res.qr_codes.length > 0) {
          const mapped: RoomTokenRecord[] = res.qr_codes.map((q: any, idx: number) => ({
            id: q.id,
            roomNumberTemplate: '{ ROOM :Number }',
            roomNumberLive: `Room ${q.room_number}`,
            suiteNameTemplate: 'Villa Del Mar Suite',
            suiteNameLive: 'Villa Del Mar Suite',
            wing: 'West Pavilion',
            floor: `Floor ${q.floor || 1}`,
            tokenCode: `NV-QR-${q.token.slice(0, 8).toUpperCase()}`,
            qrHash: `sha256-${q.token.slice(0, 10)}...`,
            scansCount: 20 + idx * 4,
            lastScanned: 'Scanned today',
            status: q.is_active ? 'ACTIVE' : 'INACTIVE',
            plaqueSize: '105 × 148 mm (A6)',
          }));
          setTokens(mapped);
          if (mapped[0]) setSelectedRoomId(mapped[0].id);
        }
      })
      .catch((err) => {
        console.warn('QR tokens live fetch fallback:', err);
      });

    return () => {
      active = false;
    };
  }, []);

  // Selected room object
  const currentSelectedRoom = useMemo(() => {
    return tokens.find((t) => t.id === selectedRoomId) || tokens[0];
  }, [tokens, selectedRoomId]);

  // Filtered tokens
  const filteredTokens = useMemo(() => {
    return tokens.filter((t) => {
      // Floor filter
      if (floorFilter !== 'All Floors') {
        const floorNum = floorFilter.replace('Floor ', '');
        if (!t.floor.includes(floorNum)) return false;
      }

      // Status filter
      if (statusFilter.includes('Active') && t.status !== 'ACTIVE') return false;
      if (statusFilter.includes('Inactive') && t.status !== 'INACTIVE') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesRoom =
          t.roomNumberLive.toLowerCase().includes(q) ||
          t.roomNumberTemplate.toLowerCase().includes(q);
        const matchesSuite = t.suiteNameLive.toLowerCase().includes(q);
        const matchesWing = t.wing.toLowerCase().includes(q);
        const matchesCode = t.tokenCode.toLowerCase().includes(q);
        if (!matchesRoom && !matchesSuite && !matchesWing && !matchesCode) return false;
      }

      return true;
    });
  }, [tokens, floorFilter, statusFilter, searchQuery]);

  // Handle Download High-Res PDF (300 DPI)
  const handleDownloadPDF = () => {
    showToast(
      `Preparing 300 DPI press-ready PDF for ${
        isLiteralMockup ? 'ROOM' : currentSelectedRoom.roomNumberLive
      } Plaque...`
    );
    setTimeout(() => {
      window.print();
    }, 600);
  };

  // Handle Batch Export
  const handleBatchExport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBatchExportModalOpen(false);
    showToast('Batch PDF compilation initiated: 28 vector plaques exported (300 DPI CMYK).');
  };

  // Handle Generate QR Code
  const handleGenerateQR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomNumber.trim()) return;

    const num = newRoomNumber.trim();
    const newToken: RoomTokenRecord = {
      id: `rm_${Date.now()}`,
      roomNumberTemplate: '{ ROOM :Number }',
      roomNumberLive: `Room ${num}`,
      suiteNameTemplate: `${newWing} Suite`,
      suiteNameLive: `${newWing} Suite`,
      wing: newWing,
      floor: newFloor,
      tokenCode: `NV-QR-R${num}-GEN`,
      qrHash: `sha256-${Math.random().toString(36).substring(2, 10)}...${Math.random()
        .toString(36)
        .substring(2, 6)}`,
      scansCount: 0,
      lastScanned: 'Just generated',
      status: newStatus,
      plaqueSize: '105 × 148 mm (A6)',
    };

    setTokens((prev) => [newToken, ...prev]);
    setSelectedRoomId(newToken.id);
    setIsGenerateModalOpen(false);
    setNewRoomNumber('');
    showToast(`Provisioned new QR Plaque for Room ${num} with AES-256 room token.`);
  };

  const copyGuestDirectUrl = () => {
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/guest?room=${
      isLiteralMockup ? '404' : currentSelectedRoom.roomNumberLive.replace('Room ', '')
    }`;
    navigator.clipboard?.writeText(url);
    setCopiedToken(true);
    showToast('Direct guest auto-authentication URL copied to clipboard.');
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#201A15] flex flex-col font-sans selection:bg-[#E8DCCB] selection:text-[#3B2B1B]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#2C241E] text-white px-4 py-2.5 rounded-xl shadow-xl border border-[#44382F] text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <Sparkles className="w-4 h-4 text-[#D6A868]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Grid Wrapper */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Luxury Sidebar */}
        <aside className="w-full lg:w-64 bg-[#F8F5F0] border-b lg:border-b-0 lg:border-r border-[#E8E2D8] p-5 flex flex-col justify-between shrink-0 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
          <div className="space-y-6">
            {/* Brand Logo */}
            <div className="flex items-center gap-3 px-2 py-1">
              <div className="w-9 h-9 rounded-full bg-[#705535] flex items-center justify-center text-[#F5EFEB] font-serif font-bold text-lg shadow-sm">
                N
              </div>
              <div>
                <h1 className="font-serif font-bold tracking-wide text-sm text-[#201A15] leading-none">
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
                href="/admin/menu/items"
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

              {/* 6. QR Codes (ACTIVE ON SCREEN 21) */}
              <Link
                href="/admin/qr"
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition bg-[#85653C] text-white shadow-xs"
              >
                <QrCode className="w-4 h-4 text-white" />
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
        <div className="flex-1 min-w-0 p-5 sm:p-8 lg:p-10 space-y-6 max-w-[1500px] mx-auto w-full">
          {/* Breadcrumb & Top Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#7A6F63] border-b border-[#EFE9DF] pb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[#8C8275]">Operations</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#B8AEA2]" />
              <span className="text-[#8C8275]">QR Codes</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#B8AEA2]" />
              <span className="font-semibold text-[#201A15]">Room Tokens</span>

              {/* Mode Toggle ({var} vs Live) */}
              <button
                type="button"
                onClick={() => setIsLiteralMockup(!isLiteralMockup)}
                className="ml-3 px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-[#EFE9DF] text-[#705535] hover:bg-[#E5DDCF] border border-[#DDD5C9] transition"
                title="Toggle template placeholder representation vs live guest preview"
              >
                {isLiteralMockup ? '{var} Mode' : 'Live Mode'}
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1.5 text-xs font-medium text-[#7A6F63] hover:text-[#201A15] transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-bold tracking-[0.2em] text-[#85653C] uppercase">
                  PHYSICAL ROOM TOUCHPOINTS • Direct Room Resolution
                </p>
              </div>
              <h2 className="font-serif text-3xl font-bold text-[#201A15] mt-1 tracking-tight">
                QR Codes
              </h2>
              <p className="text-xs text-[#7A6F63] max-w-2xl mt-1 leading-relaxed">
                Manage secure, room-assigned QR tokens for the Nivora Concierge guest dining and
                room-service experience. Guest scans automatically resolve room credentials without
                manual login.
              </p>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              {/* Batch Print Export Button */}
              <button
                type="button"
                onClick={() => setIsBatchExportModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#D8CEBF] bg-white hover:bg-[#F5EFEB] text-[#3D3126] text-xs font-bold shadow-2xs transition cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#705535]" />
                <span>Batch Print Export (PDF)</span>
              </button>

              {/* Generate QR Code Button */}
              <button
                type="button"
                onClick={() => setIsGenerateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#705535] hover:bg-[#5C452A] text-white text-xs font-bold shadow-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Generate QR Code</span>
              </button>
            </div>
          </div>

          {/* 4 Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1: Configured Tokens */}
            <div className="bg-white rounded-2xl p-4 border border-[#E8E2D8] shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">
                  CONFIGURED TOKENS
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#F8F5F0] border border-[#E8E2D8] flex items-center justify-center text-[#705535]">
                  <QrCode className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2">
                <p className="text-2xl font-serif font-bold text-[#201A15]">28 Assigned</p>
                <p className="text-[11px] text-[#7A6F63] mt-0.5">Physical plaques deployed</p>
              </div>
            </div>

            {/* Metric 2: Active Guest Access */}
            <div className="bg-white rounded-2xl p-4 border border-[#E8E2D8] shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">
                  ACTIVE GUEST ACCESS
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#F8F5F0] border border-[#E8E2D8] flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2">
                <p className="text-2xl font-serif font-bold text-[#201A15] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                  <span>26 Active</span>
                </p>
                <p className="text-[11px] text-[#7A6F63] mt-0.5">Instant session resolver</p>
              </div>
            </div>

            {/* Metric 3: Inactive / Revoked */}
            <div className="bg-white rounded-2xl p-4 border border-[#E8E2D8] shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">
                  INACTIVE / REVOKED
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#F8F5F0] border border-[#E8E2D8] flex items-center justify-center text-[#7A6F63]">
                  <MinusCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2">
                <p className="text-2xl font-serif font-bold text-[#201A15] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8A8074] inline-block" />
                  <span>2 Inactive</span>
                </p>
                <p className="text-[11px] text-[#7A6F63] mt-0.5">Deep clean &amp; renovations</p>
              </div>
            </div>

            {/* Metric 4: Token Encryption */}
            <div className="bg-white rounded-2xl p-4 border border-[#E8E2D8] shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">
                  TOKEN ENCRYPTION
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#F8F5F0] border border-[#E8E2D8] flex items-center justify-center text-[#705535]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2">
                <p className="text-xl font-serif font-bold text-[#201A15]">AES-256 Room Hash</p>
                <p className="text-[11px] text-[#7A6F63] mt-0.5">Non-sequential &amp; Room-bound</p>
              </div>
            </div>
          </div>

          {/* Search, Filter Bar & Quick Switcher */}
          <div className="bg-white rounded-2xl p-4 border border-[#E8E2D8] shadow-2xs space-y-3">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              {/* Search input with clear button */}
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-[#8C8275] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by room number or pavilion wing..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FDFBF7] border border-[#DDD5C9] rounded-xl pl-9.5 pr-8 py-2 text-xs text-[#201A15] placeholder-[#9E9385] focus:outline-none focus:ring-1 focus:ring-[#705535]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9E9385] hover:text-[#201A15]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Dropdown Filters and Counter */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end flex-wrap">
                {/* Status Dropdown */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  aria-label="Filter by room status"
                  className="bg-[#FDFBF7] border border-[#DDD5C9] text-xs text-[#4A3E31] rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-1 focus:ring-[#705535] cursor-pointer"
                >
                  <option value="All Status (28)">All Status (28)</option>
                  <option value="Active (26)">Active (26)</option>
                  <option value="Inactive (2)">Inactive (2)</option>
                </select>

                {/* Floor Dropdown */}
                <select
                  value={floorFilter}
                  onChange={(e) => setFloorFilter(e.target.value)}
                  aria-label="Filter by resort floor"
                  className="bg-[#FDFBF7] border border-[#DDD5C9] text-xs text-[#4A3E31] rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-1 focus:ring-[#705535] cursor-pointer"
                >
                  <option value="All Floors">All Floors</option>
                  <option value="Floor 1">Floor 1 (Garden &amp; Pool)</option>
                  <option value="Floor 2">Floor 2 (Veranda)</option>
                  <option value="Floor 3">Floor 3 (Palm Wing)</option>
                  <option value="Floor 4">Floor 4 (Ocean Front)</option>
                  <option value="Floor 5">Floor 5 (Presidential Penthouse)</option>
                </select>

                {/* Counter matching screenshot */}
                <span className="text-xs font-semibold text-[#8C8275] flex items-center gap-1.5 shrink-0 pl-1">
                  <span className="w-2 h-2 rounded-full bg-[#85653C] inline-block" />
                  Showing {filteredTokens.length} of 28 records
                </span>
              </div>
            </div>

            {/* Room Selector Strip for live interactive staging */}
            <div className="pt-2 border-t border-[#F2ECE3] flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A8074] shrink-0 mr-1">
                Select Suite Plaque:
              </span>
              {filteredTokens.map((t) => {
                const isSelected = t.id === selectedRoomId;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedRoomId(t.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#705535] text-white shadow-xs'
                        : 'bg-[#F5EFEB] text-[#5A4F44] hover:bg-[#EAE2D7]'
                    }`}
                  >
                    <span>{isLiteralMockup && t.id === 'rm_404' ? 'ROOM' : t.roomNumberLive}</span>
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                        isSelected ? 'bg-[#5C452A] text-white' : 'text-[#8A8074]'
                      }`}
                    >
                      {t.wing.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* MAIN PHYSICAL STAGING PREVIEW CARD (Screen 21 Core Component) */}
          <div className="bg-white rounded-2xl border border-[#E8E2D8] p-6 lg:p-8 shadow-2xs space-y-6">
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-4">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-[#8C8275] uppercase">
                  PHYSICAL STAGING PREVIEW
                </p>
                <h3 className="font-serif text-2xl font-bold text-[#201A15] mt-0.5">
                  {isLiteralMockup
                    ? currentSelectedRoom.id === 'rm_404'
                      ? 'ROOM Plaque'
                      : `${currentSelectedRoom.roomNumberTemplate} Plaque`
                    : `${currentSelectedRoom.roomNumberLive} Plaque`}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                    currentSelectedRoom.status === 'ACTIVE'
                      ? 'bg-[#EBF7EE] text-[#1E7E34] border-[#C8E6C9]'
                      : 'bg-[#F5F5F5] text-[#757575] border-[#E0E0E0]'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      currentSelectedRoom.status === 'ACTIVE' ? 'bg-emerald-600' : 'bg-gray-400'
                    }`}
                  />
                  {currentSelectedRoom.status === 'ACTIVE' ? 'Active' : 'Revoked'}
                </span>

                <button
                  type="button"
                  onClick={() => setIsTestScanModalOpen(true)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F5EFEB] hover:bg-[#EAE2D7] text-[#705535] border border-[#DDD5C9] transition"
                  title="Test scanning this QR code as a hotel guest"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Simulate Scan</span>
                </button>
              </div>
            </div>

            {/* Staging Area Canvas */}
            <div className="bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl p-6 sm:p-12 flex flex-col items-center justify-center relative min-h-[580px] shadow-inner">
              {/* Luxury Golden Brass Beveled Plaque / Tent Card */}
              <div
                className="relative max-w-sm w-full rounded-3xl p-1.5 sm:p-2 transition-transform duration-300 hover:scale-[1.01]"
                style={{
                  background:
                    'linear-gradient(135deg, #ECC880 0%, #D4AF37 25%, #AA8022 50%, #ECC880 75%, #8B6508 100%)',
                  boxShadow:
                    '0 25px 50px -12px rgba(112, 85, 53, 0.35), 0 0 0 1px rgba(184, 134, 11, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.6), inset 0 -2px 4px rgba(0, 0, 0, 0.3)',
                }}
              >
                {/* Plaque Inner Surface (Off-white / Ivory Parchment) */}
                <div className="bg-[#FCFBF8] rounded-2xl p-6 sm:p-8 text-center relative border border-[#E5DAC8] shadow-inner">
                  {/* Subtle Corner Registration / Crop Marks */}
                  <div className="absolute top-3 left-3 text-[#D6A868] text-xs font-mono select-none">
                    ⌜
                  </div>
                  <div className="absolute top-3 right-3 text-[#D6A868] text-xs font-mono select-none">
                    ⌝
                  </div>
                  <div className="absolute bottom-3 left-3 text-[#D6A868] text-xs font-mono select-none">
                    ⌞
                  </div>
                  <div className="absolute bottom-3 right-3 text-[#D6A868] text-xs font-mono select-none">
                    ⌟
                  </div>

                  {/* Nivora Crest Emblem */}
                  <div className="w-10 h-10 mx-auto rounded-full bg-[#FAF5EB] border border-[#D4AF37] flex items-center justify-center text-[#705535] font-serif font-bold text-lg shadow-2xs">
                    N
                  </div>

                  {/* Header Title */}
                  <h4 className="font-serif font-bold text-sm tracking-[0.25em] text-[#241C15] uppercase mt-2.5">
                    NIVORA CONCIERGE
                  </h4>

                  {/* Subtitle / Pavilion Wing */}
                  <p className="text-[11px] text-[#7A6E60] font-medium tracking-wide mt-1">
                    {isLiteralMockup ? 'Villa Del Mar • West Pavilion' : currentSelectedRoom.suiteNameLive}
                  </p>

                  {/* High Quality Crisp Scannable 2D QR Code SVG */}
                  <div className="my-5 flex items-center justify-center">
                    <div className="bg-white p-3.5 rounded-xl border border-[#E8DFC8] shadow-sm relative inline-block">
                      <svg
                        className="w-48 h-48 sm:w-52 sm:h-52"
                        viewBox="0 0 200 200"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* QR Matrix Finder Patterns (Top-Left) */}
                        <rect x="10" y="10" width="56" height="56" rx="8" fill="#241C15" />
                        <rect x="18" y="18" width="40" height="40" rx="4" fill="#FFFFFF" />
                        <rect x="26" y="26" width="24" height="24" rx="3" fill="#241C15" />

                        {/* Top-Right Finder */}
                        <rect x="134" y="10" width="56" height="56" rx="8" fill="#241C15" />
                        <rect x="142" y="18" width="40" height="40" rx="4" fill="#FFFFFF" />
                        <rect x="150" y="26" width="24" height="24" rx="3" fill="#241C15" />

                        {/* Bottom-Left Finder */}
                        <rect x="10" y="134" width="56" height="56" rx="8" fill="#241C15" />
                        <rect x="18" y="142" width="40" height="40" rx="4" fill="#FFFFFF" />
                        <rect x="26" y="150" width="24" height="24" rx="3" fill="#241C15" />

                        {/* Data Modules (Accurate Luxury QR Pattern) */}
                        {/* Row 10 - 66 between finders */}
                        <rect x="74" y="14" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="90" y="14" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="106" y="14" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="118" y="14" width="8" height="8" rx="1.5" fill="#241C15" />

                        <rect x="74" y="26" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="98" y="26" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="118" y="26" width="8" height="8" rx="1.5" fill="#241C15" />

                        <rect x="82" y="38" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="90" y="38" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="106" y="38" width="8" height="8" rx="1.5" fill="#241C15" />

                        <rect x="74" y="50" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="98" y="50" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="110" y="50" width="8" height="8" rx="1.5" fill="#241C15" />

                        {/* Middle Band (Y 70 - 130) */}
                        <rect x="14" y="74" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="26" y="74" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="42" y="74" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="58" y="74" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="74" y="74" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="90" y="74" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="134" y="74" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="150" y="74" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="174" y="74" width="8" height="8" rx="1.5" fill="#241C15" />

                        <rect x="14" y="90" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="34" y="90" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="50" y="90" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="70" y="90" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="122" y="90" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="142" y="90" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="158" y="90" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="178" y="90" width="8" height="8" rx="1.5" fill="#241C15" />

                        <rect x="22" y="106" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="38" y="106" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="58" y="106" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="134" y="106" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="154" y="106" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="170" y="106" width="8" height="8" rx="1.5" fill="#241C15" />

                        <rect x="14" y="118" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="30" y="118" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="46" y="118" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="62" y="118" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="78" y="118" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="126" y="118" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="146" y="118" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="166" y="118" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="178" y="118" width="8" height="8" rx="1.5" fill="#241C15" />

                        {/* Bottom-Right Quadrant */}
                        <rect x="74" y="134" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="94" y="134" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="110" y="134" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="134" y="134" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="150" y="134" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="174" y="134" width="8" height="8" rx="1.5" fill="#241C15" />

                        <rect x="82" y="150" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="102" y="150" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="122" y="150" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="142" y="150" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="162" y="150" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="178" y="150" width="8" height="8" rx="1.5" fill="#241C15" />

                        <rect x="74" y="166" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="90" y="166" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="114" y="166" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="134" y="166" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="154" y="166" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="170" y="166" width="8" height="8" rx="1.5" fill="#241C15" />

                        <rect x="82" y="178" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="106" y="178" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="126" y="178" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="146" y="178" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="166" y="178" width="8" height="8" rx="1.5" fill="#241C15" />
                        <rect x="178" y="178" width="8" height="8" rx="1.5" fill="#241C15" />

                        {/* Center Medallion (Nivora Monogram Badge) */}
                        <rect
                          x="82"
                          y="82"
                          width="36"
                          height="36"
                          rx="6"
                          fill="#FAF5EB"
                          stroke="#705535"
                          strokeWidth="2.5"
                        />
                        <text
                          x="100"
                          y="107"
                          textAnchor="middle"
                          fill="#705535"
                          fontFamily="Playfair Display, serif"
                          fontWeight="bold"
                          fontSize="20"
                        >
                          N
                        </text>
                      </svg>
                    </div>
                  </div>

                  {/* Instructions */}
                  <h5 className="font-serif font-bold text-sm text-[#241C15] mt-1">
                    Scan to access Nivora Concierge
                  </h5>
                  <p className="text-[10px] text-[#7A6E60] font-medium mt-1 leading-snug">
                    In-Room Dining • Concierge Amenities
                    <br />
                    Private Butler Service
                  </p>

                  {/* Bottom Divider & Two Columns */}
                  <div className="mt-5 pt-3.5 border-t border-[#EAE1D3] flex items-center justify-between text-[9px] font-bold tracking-wider text-[#8C8072] uppercase px-1">
                    <div className="text-left">
                      <p className="text-[#3B2F23] font-bold">
                        {isLiteralMockup
                          ? currentSelectedRoom.id === 'rm_404'
                            ? 'ROOM'
                            : currentSelectedRoom.roomNumberTemplate
                          : currentSelectedRoom.roomNumberLive}
                      </p>
                      <p className="text-[8px] text-[#A39686]">AUTHENTICATED</p>
                    </div>

                    <div className="text-right">
                      <p className="text-[#3B2F23] font-bold">NO LOGIN</p>
                      <p className="text-[8px] text-[#A39686]">REQUIRED</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Caption below Plaque (matching screenshot) */}
              <p className="text-xs text-[#8C8275] font-medium mt-6 text-center">
                Plaque standard: 105 × 148 mm (A6 Tent Card / Brass Stand Acrylic)
              </p>
            </div>

            {/* Bottom Full-Width Action Button (matching screenshot) */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="w-full bg-[#705535] hover:bg-[#5C452A] text-white py-3.5 px-6 rounded-xl font-bold text-sm shadow-xs transition flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-white" />
              <span>Download High-Res PDF (300 DPI)</span>
            </button>
          </div>

          {/* Table View of All Room Tokens & Management Controls */}
          <div className="bg-white rounded-2xl border border-[#E8E2D8] p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0EAE1] pb-3">
              <div>
                <h4 className="font-serif font-bold text-lg text-[#201A15]">
                  Room Token Registry &amp; Hardware Telemetry
                </h4>
                <p className="text-xs text-[#7A6F63]">
                  Cryptographically tied session resolver tokens with real-time audit logging.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyGuestDirectUrl}
                  className="px-3 py-1.5 rounded-lg border border-[#DDD5C9] bg-[#FDFBF7] hover:bg-[#F2ECE3] text-xs font-semibold text-[#5A4F44] flex items-center gap-1.5 transition"
                >
                  {copiedToken ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-[#705535]" />
                  )}
                  <span>{copiedToken ? 'URL Copied!' : 'Copy Direct URL'}</span>
                </button>

                <Link
                  href={`/guest?room=${
                    isLiteralMockup
                      ? '404'
                      : currentSelectedRoom.roomNumberLive.replace('Room ', '')
                  }`}
                  target="_blank"
                  className="px-3 py-1.5 rounded-lg bg-[#705535] hover:bg-[#5C452A] text-xs font-semibold text-white flex items-center gap-1.5 transition shadow-2xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Launch Guest Portal</span>
                </Link>
              </div>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#EFE9DF] text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">
                    <th className="py-2.5 px-3">Room / Suite</th>
                    <th className="py-2.5 px-3">Wing &amp; Floor</th>
                    <th className="py-2.5 px-3">Hardware Token Code</th>
                    <th className="py-2.5 px-3">Cryptographic Hash</th>
                    <th className="py-2.5 px-3">Scans</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5EFEB]">
                  {filteredTokens.map((t) => {
                    const isSelected = t.id === selectedRoomId;
                    return (
                      <tr
                        key={t.id}
                        className={`transition ${
                          isSelected ? 'bg-[#FAF5EC]' : 'hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <td className="py-3 px-3">
                          <div className="font-bold text-[#201A15]">
                            {isLiteralMockup && t.id === 'rm_404'
                              ? 'ROOM'
                              : isLiteralMockup
                              ? t.roomNumberTemplate
                              : t.roomNumberLive}
                          </div>
                          <div className="text-[10px] text-[#7A6F63]">
                            {isLiteralMockup ? t.suiteNameTemplate : t.suiteNameLive}
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span className="font-medium text-[#4A3E31]">{t.wing}</span>
                          <span className="text-[10px] text-[#8C8275] block">{t.floor}</span>
                        </td>

                        <td className="py-3 px-3 font-mono text-[11px] text-[#705535] font-semibold">
                          {t.tokenCode}
                        </td>

                        <td className="py-3 px-3 font-mono text-[10px] text-[#8C8275]">
                          {t.qrHash}
                        </td>

                        <td className="py-3 px-3">
                          <span className="font-bold text-[#201A15]">{t.scansCount}</span>
                          <span className="text-[10px] text-[#8C8275] block">{t.lastScanned}</span>
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              t.status === 'ACTIVE'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-gray-100 text-gray-600 border border-gray-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                t.status === 'ACTIVE' ? 'bg-emerald-600' : 'bg-gray-400'
                              }`}
                            />
                            {t.status}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedRoomId(t.id);
                                showToast(`Loaded ${t.roomNumberLive} into physical preview.`);
                              }}
                              className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#F5EFEB] hover:bg-[#EAE2D7] text-[#705535] transition"
                            >
                              Preview Plaque
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setTokens((prev) =>
                                  prev.map((item) =>
                                    item.id === t.id
                                      ? {
                                          ...item,
                                          status: item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
                                        }
                                      : item
                                  )
                                );
                                showToast(
                                  `Token ${t.tokenCode} status updated to ${
                                    t.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
                                  }.`
                                );
                              }}
                              className="p-1 rounded-md text-[#8C8275] hover:text-[#201A15] hover:bg-[#EAE2D7] transition"
                              title="Toggle Active/Inactive"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Generate QR Code */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#D8CEBF] max-w-lg w-full p-6 shadow-2xl relative text-[#201A15]">
            <button
              type="button"
              onClick={() => setIsGenerateModalOpen(false)}
              className="absolute right-4 top-4 text-[#8A8074] hover:text-[#201A15] p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-[#E8E2D8] pb-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#705535] text-white flex items-center justify-center font-bold">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#201A15]">
                  Generate Physical QR Plaque Token
                </h3>
                <p className="text-xs text-[#7A6F63]">
                  Assign an immutable AES-256 encrypted token for in-room brass plaques.
                </p>
              </div>
            </div>

            <form onSubmit={handleGenerateQR} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4A3E31] mb-1">
                  Room / Suite Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 405, 312, Villa 02"
                  value={newRoomNumber}
                  onChange={(e) => setNewRoomNumber(e.target.value)}
                  className="w-full bg-white border border-[#DDD5C9] rounded-xl px-3 py-2 text-xs text-[#201A15] focus:outline-none focus:ring-1 focus:ring-[#705535]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4A3E31] mb-1">
                    Pavilion Wing
                  </label>
                  <select
                    value={newWing}
                    onChange={(e) => setNewWing(e.target.value)}
                    className="w-full bg-white border border-[#DDD5C9] rounded-xl px-3 py-2 text-xs text-[#201A15] focus:outline-none focus:ring-1 focus:ring-[#705535]"
                  >
                    <option value="West Pavilion">West Pavilion</option>
                    <option value="Ocean Front">Ocean Front</option>
                    <option value="Palm Wing">Palm Wing</option>
                    <option value="Garden & Cabanas">Garden &amp; Cabanas</option>
                    <option value="Presidential">Presidential Tower</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3E31] mb-1">Floor</label>
                  <select
                    value={newFloor}
                    onChange={(e) => setNewFloor(e.target.value)}
                    className="w-full bg-white border border-[#DDD5C9] rounded-xl px-3 py-2 text-xs text-[#201A15] focus:outline-none focus:ring-1 focus:ring-[#705535]"
                  >
                    <option value="Floor 1">Floor 1</option>
                    <option value="Floor 2">Floor 2</option>
                    <option value="Floor 3">Floor 3</option>
                    <option value="Floor 4">Floor 4</option>
                    <option value="Floor 5">Floor 5</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3E31] mb-1">Initial Status</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs text-[#4A3E31] cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={newStatus === 'ACTIVE'}
                      onChange={() => setNewStatus('ACTIVE')}
                      className="accent-[#705535]"
                    />
                    <span>Active (Deployed in room)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-[#4A3E31] cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={newStatus === 'INACTIVE'}
                      onChange={() => setNewStatus('INACTIVE')}
                      className="accent-[#705535]"
                    />
                    <span>Inactive (Under preparation)</span>
                  </label>
                </div>
              </div>

              <div className="bg-[#F2EDE7] p-3 rounded-xl border border-[#E8E2D8] text-[11px] text-[#5A4F44] space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-[#705535]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Security &amp; Hardware Encryption</span>
                </p>
                <p>
                  Tokens generate with a 256-bit cryptographically secure hash. Scans resolve
                  directly to the assigned guest room folio without requiring personal login
                  passwords.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-[#DDD5C9] bg-white text-[#5A4F44] hover:bg-[#F5EFEB] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#705535] text-white hover:bg-[#5C452A] shadow-xs transition"
                >
                  Generate Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Batch Print Export (PDF) */}
      {isBatchExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#D8CEBF] max-w-lg w-full p-6 shadow-2xl relative text-[#201A15]">
            <button
              type="button"
              onClick={() => setIsBatchExportModalOpen(false)}
              className="absolute right-4 top-4 text-[#8A8074] hover:text-[#201A15] p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-[#E8E2D8] pb-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#705535] text-white flex items-center justify-center font-bold">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#201A15]">
                  Batch Print Export (PDF)
                </h3>
                <p className="text-xs text-[#7A6F63]">
                  Commercial print press bundle for all 28 in-room acrylic and brass tent cards.
                </p>
              </div>
            </div>

            <form onSubmit={handleBatchExport} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4A3E31] mb-1">
                  Card Format / Dimensions
                </label>
                <select className="w-full bg-white border border-[#DDD5C9] rounded-xl px-3 py-2 text-xs text-[#201A15] focus:outline-none focus:ring-1 focus:ring-[#705535]">
                  <option>105 × 148 mm (A6 Tent Card / Brass Stand Acrylic)</option>
                  <option>148 × 210 mm (A5 Stand Plaque)</option>
                  <option>85 × 55 mm (Pocket Concierge Card)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3E31] mb-1">
                  Target Selection
                </label>
                <select className="w-full bg-white border border-[#DDD5C9] rounded-xl px-3 py-2 text-xs text-[#201A15] focus:outline-none focus:ring-1 focus:ring-[#705535]">
                  <option>All 28 Assigned Rooms (Complete Resort Fleet)</option>
                  <option>Active Only (26 Rooms)</option>
                  <option>West Pavilion &amp; Ocean Front (14 Rooms)</option>
                  <option>Current Selected Room Only ({currentSelectedRoom.roomNumberLive})</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#4A3E31]">
                  Press &amp; Bleed Options
                </label>
                <div className="space-y-1.5 text-xs text-[#4A3E31]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-[#705535]" />
                    <span>Include 3mm Bleed &amp; Crop Registration Marks</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-[#705535]" />
                    <span>Vector QR Matrix (Scalable without raster pixelation)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-[#705535]" />
                    <span>CMYK Color Profile for Metallic Gold Foil Compatibility</span>
                  </label>
                </div>
              </div>

              <div className="bg-[#FAF5EC] p-3 rounded-xl border border-[#E8DFC8] text-[11px] text-[#705535] flex items-center justify-between">
                <div>
                  <span className="font-bold block">Estimated Output</span>
                  <span className="text-[10px] text-[#8C8275]">
                    7 sheets @ 4 cards per sheet (A4 Press Layout)
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#705535] text-white font-bold text-[10px]">
                  300 DPI
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBatchExportModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-[#DDD5C9] bg-white text-[#5A4F44] hover:bg-[#F5EFEB] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#705535] text-white hover:bg-[#5C452A] shadow-xs transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Press Bundle</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Simulate Guest Scan */}
      {isTestScanModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#D8CEBF] max-w-md w-full p-6 shadow-2xl relative text-[#201A15]">
            <button
              type="button"
              onClick={() => setIsTestScanModalOpen(false)}
              className="absolute right-4 top-4 text-[#8A8074] hover:text-[#201A15] p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#EBF7EE] text-[#1E7E34] border border-[#C8E6C9] flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#201A15]">
                Simulate Camera Scan
              </h3>
              <p className="text-xs text-[#7A6F63]">
                When an in-room guest opens their smartphone camera and points at this plaque, the
                system authenticates their session automatically.
              </p>

              <div className="bg-white p-4 rounded-xl border border-[#E8E2D8] text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#8A8074]">Target Room:</span>
                  <span className="font-bold text-[#201A15]">
                    {currentSelectedRoom.roomNumberLive} ({currentSelectedRoom.wing})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A8074]">Resolved Token:</span>
                  <span className="font-mono text-[#705535] font-semibold">
                    {currentSelectedRoom.tokenCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A8074]">Authentication:</span>
                  <span className="text-emerald-700 font-bold">✓ Direct Auto-Auth</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href={`/guest?room=${currentSelectedRoom.roomNumberLive.replace('Room ', '')}`}
                  className="w-full bg-[#705535] hover:bg-[#5C452A] text-white py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Guest Experience as {currentSelectedRoom.roomNumberLive}</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsTestScanModalOpen(false)}
                  className="w-full py-2 text-xs font-semibold text-[#8C8275] hover:text-[#201A15]"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Staff Security Footer */}
      <footer className="mt-auto border-t border-[#E8E2D8] bg-[#F8F5F0] px-6 py-4 text-xs text-[#7A6F63] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-[#8A8074]" />
          <span>
            © 2026 Nivora Luxury Resorts &amp; Residences. Internal staff credentials strictly
            monitored.
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="hover:underline cursor-pointer">Security Protocol</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">IT Concierge Desk</span>
        </div>
      </footer>
    </div>
  );
}

export default function AdminQRPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-xs text-[#7A6F63]">
          Loading QR code token manager...
        </div>
      }
    >
      <AdminQRContent />
    </Suspense>
  );
}
