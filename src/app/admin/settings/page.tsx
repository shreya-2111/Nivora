'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  LogOut,
  LayoutDashboard,
  UtensilsCrossed,
  Bed,
  QrCode,
  Sliders,
  SlidersHorizontal,
  ShieldCheck,
  Building2,
  Upload,
  X,
  Check,
  Lock,
  Edit3,
  Palette,
  Phone,
  MessageSquare,
  MapPin,
  Info,
  Bell,
  Sparkles,
  RefreshCw,
  Trash2,
  Eye,
  Camera,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Smartphone,
  RotateCcw,
} from 'lucide-react';

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

function ContactBookIcon({ className = 'w-5 h-5' }: { className?: string }) {
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
      <path d="M16 2v20" />
      <path d="M4 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <circle cx="10" cy="10" r="3" />
      <path d="M6 18a4 4 0 0 1 8 0" />
    </svg>
  );
}

function AdminSettingsContent() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode');
  const [isLiteralMockup, setIsLiteralMockup] = useState(initialMode !== 'live');

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Form States (matching screenshot)
  const [hotelName, setHotelName] = useState('Nivora Resort & Spa, Goa');
  const [logoFileName, setLogoFileName] = useState('nivora-crest-gold.svg');
  const [logoFormat, setLogoFormat] = useState('SVG Vector');
  const [coverImage, setCoverImage] = useState('/hero-balcony.jpg');
  const [coverTitle, setCoverTitle] = useState('Oceanfront Balcony ROOM Compendium Banner');
  const [coverMeta, setCoverMeta] = useState('Active since Nov 14, 2024 • High-Resolution Master');

  const [welcomeMessage, setWelcomeMessage] = useState(
    'Welcome to Nivora Resort & Spa. Elevate your stay with our bespoke in-room dining, artisan amenities, and private concierge service. Seamlessly ordered from your ROOM.'
  );

  const [primaryColor, setPrimaryColor] = useState('#8B6F47');
  const [secondaryColor, setSecondaryColor] = useState('#C5A880');

  const [phone, setPhone] = useState('+91 832 279 9000');
  const [whatsapp, setWhatsapp] = useState('+91 982 211 0');
  const [address, setAddress] = useState(
    'Villa Del Mar, Aguada Siolim Road, Sinquerim, Goa 403515, India'
  );

  // Guest Service Modules Toggle States
  const [moduleFood, setModuleFood] = useState(true);
  const [moduleRoomService, setModuleRoomService] = useState(true);
  const [moduleReception, setModuleReception] = useState(true);
  const [moduleInfo, setModuleInfo] = useState(true);

  // Modals
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleDiscardChanges = () => {
    setHotelName('Nivora Resort & Spa, Goa');
    setLogoFileName('nivora-crest-gold.svg');
    setCoverImage('/hero-balcony.jpg');
    setCoverTitle('Oceanfront Balcony ROOM Compendium Banner');
    setWelcomeMessage(
      'Welcome to Nivora Resort & Spa. Elevate your stay with our bespoke in-room dining, artisan amenities, and private concierge service. Seamlessly ordered from your ROOM.'
    );
    setPrimaryColor('#8B6F47');
    setSecondaryColor('#C5A880');
    setPhone('+91 832 279 9000');
    setWhatsapp('+91 982 211 0');
    setAddress('Villa Del Mar, Aguada Siolim Road, Sinquerim, Goa 403515, India');
    setModuleFood(true);
    setModuleRoomService(true);
    setModuleReception(true);
    setModuleInfo(true);
    setHasUnsavedChanges(false);
    showToast('Changes discarded. Restored resort defaults.');
  };

  const handleSaveChanges = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setHasUnsavedChanges(false);
    showToast('Hotel settings updated successfully across all guest touchpoints.');
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
        <aside className="w-full lg:w-64 bg-[#F8F5F0] border-r border-[#E8E2D8] p-5 flex flex-col justify-between shrink-0">
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

              {/* 6. QR Codes */}
              <Link
                href="/admin/qr"
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-[#5A5046] hover:bg-[#F2EDE7]"
              >
                <QrCode className="w-4 h-4" />
                <span>QR Codes</span>
              </Link>

              {/* 7. Settings (ACTIVE ON SCREEN 22) */}
              <Link
                href="/admin/settings"
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition bg-[#85653C] text-white shadow-xs"
              >
                <Sliders className="w-4 h-4 text-white" />
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
        <div className="flex-1 min-w-0 p-5 sm:p-8 lg:p-10 space-y-6">
          {/* Breadcrumb & Top Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#7A6F63] border-b border-[#EFE9DF] pb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[#8C8275]">Operations</span>
              <span className="text-[#B8AEA2]">/</span>
              <span className="text-[#8C8275]">Settings</span>
              <span className="text-[#B8AEA2]">/</span>
              <span className="font-semibold text-[#201A15]">Hotel Configuration</span>

              {/* Mode Toggle ({var} vs Live) */}
              <button
                type="button"
                onClick={() => setIsLiteralMockup(!isLiteralMockup)}
                className="ml-3 px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-[#EFE9DF] text-[#705535] hover:bg-[#E5DDCF] border border-[#DDD5C9] transition"
                title="Toggle template placeholder representation vs live values"
              >
                {isLiteralMockup ? '{var} Mode' : 'Live Mode'}
              </button>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/admin/login"
                className="flex items-center gap-1.5 text-xs font-medium text-[#7A6F63] hover:text-[#201A15] transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </Link>
            </div>
          </div>

          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-bold tracking-[0.2em] text-[#85653C] uppercase">
                  RESORT CORE • SCREEN 22
                </p>
              </div>
              <h2 className="font-serif text-3xl font-bold text-[#201A15] mt-1 tracking-tight">
                Hotel Settings
              </h2>
              <p className="text-xs text-[#7A6F63] max-w-2xl mt-1 leading-relaxed">
                Manage the information and services shown to hotel guests across the Nivora
                Concierge web application.
              </p>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              {/* Discard Changes Button */}
              <button
                type="button"
                onClick={handleDiscardChanges}
                className="px-4 py-2.5 rounded-xl border border-[#D8CEBF] bg-[#F2EDE7] hover:bg-[#EAE2D7] text-[#5A5046] text-xs font-bold shadow-2xs transition cursor-pointer"
              >
                Discard Changes
              </button>

              {/* Save Changes Button */}
              <button
                type="button"
                onClick={handleSaveChanges}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#705535] hover:bg-[#5C452A] text-white text-xs font-bold shadow-xs transition cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>

          {/* Two-Column Responsive Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: Hotel Branding, Guest Welcome, Brand Colors (Col Span 7) */}
            <div className="lg:col-span-7 space-y-6">
              {/* CARD 1: Hotel Branding */}
              <div className="bg-white rounded-2xl border border-[#E8E2D8] p-6 shadow-2xs space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#201A15]">
                      Hotel Branding
                    </h3>
                    <p className="text-xs text-[#7A6F63]">
                      Core visual identity presented on guest compendium and plaques.
                    </p>
                  </div>
                  <div className="text-[#85653C]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>

                {/* Field 1: Hotel Legal Display Name */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">
                    HOTEL LEGAL DISPLAY NAME
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={hotelName}
                      onChange={(e) => {
                        setHotelName(e.target.value);
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full bg-[#FAF8F5] border border-[#DDD5C9] rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-[#201A15] font-medium focus:outline-none focus:ring-1 focus:ring-[#705535]"
                    />
                    <Building2 className="w-4 h-4 text-[#8C8275] absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Field 2: Hotel Logo */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">
                    HOTEL LOGO {isLiteralMockup && <span className="font-mono text-[#85653C]">{'{LOGO}'}</span>}
                  </label>
                  <div className="p-4 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Square Logo Box */}
                    <div className="w-20 h-20 rounded-xl bg-[#FAF5EB] border border-[#E5DAC8] flex flex-col items-center justify-center p-2 text-center shrink-0 shadow-2xs">
                      <div className="w-8 h-8 rounded-full bg-[#705535] text-[#FAF5EB] font-serif font-bold text-sm flex items-center justify-center">
                        N
                      </div>
                      <span className="text-[8px] font-serif font-bold text-[#705535] tracking-widest uppercase mt-1">
                        NIVORA
                      </span>
                      <span className="text-[6px] tracking-wider text-[#8C8072] uppercase">
                        CONCIERGE
                      </span>
                    </div>

                    {/* Logo Info & Actions */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-[#201A15]">
                          {logoFileName}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EFE9DF] text-[#705535] border border-[#DDD5C9]">
                          {logoFormat}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7A6F63] leading-relaxed">
                        Recommended: Square format 512×512px. Transparent background preferred for
                        high-contrast header badges.
                      </p>
                      <div className="flex items-center gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsLogoModalOpen(true)}
                          className="px-3 py-1.5 rounded-lg border border-[#DDD5C9] bg-white hover:bg-[#F2ECE3] text-[11px] font-bold text-[#5A5046] transition cursor-pointer shadow-2xs"
                        >
                          Change Logo
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setLogoFileName('default-crest.svg');
                            setHasUnsavedChanges(true);
                            showToast('Logo reset to default resort placeholder.');
                          }}
                          className="text-[11px] font-bold text-red-600 hover:text-red-700 transition cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Field 3: Cover Image */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">
                      COVER IMAGE {isLiteralMockup && <span className="font-mono text-[#85653C]">{'{COVER_IMAGE}'}</span>}
                    </label>
                    <span className="text-[10px] font-bold text-[#8C8275]">
                      1920 × 1080px (16:9)
                    </span>
                  </div>

                  {/* 16:9 Hero Image Banner */}
                  <div className="relative rounded-2xl overflow-hidden border border-[#DDD5C9] aspect-16/9 bg-[#241C15] group shadow-inner">
                    <Image
                      src={coverImage}
                      alt="Resort Cover Banner"
                      fill
                      className="object-cover transition duration-300 group-hover:scale-102"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

                    {/* Overlay Details */}
                    <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
                      <div>
                        <h4 className="font-serif font-bold text-sm sm:text-base text-white tracking-wide drop-shadow-sm">
                          {coverTitle}
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-[#D8CEBF] drop-shadow-xs mt-0.5">
                          {coverMeta}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsCoverModalOpen(true)}
                        className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F2ECE3] text-[#241C15] text-[11px] font-bold shadow-md transition flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#705535]" />
                        <span>Upload New Cover</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: Guest Welcome */}
              <div className="bg-white rounded-2xl border border-[#E8E2D8] p-6 shadow-2xs space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#201A15]">
                      Guest Welcome
                    </h3>
                    <p className="text-xs text-[#7A6F63]">
                      Displayed on the guest welcome landing screen (Screen 01 &amp; 02).
                    </p>
                  </div>
                  <div className="text-[#85653C]">
                    <Edit3 className="w-5 h-5" />
                  </div>
                </div>

                {/* Field: Welcome Message */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">
                    WELCOME MESSAGE {isLiteralMockup && <span className="font-mono text-[#85653C]">{'{WELCOME_MESSAGE}'}</span>}
                  </label>
                  <textarea
                    rows={4}
                    value={welcomeMessage}
                    maxLength={300}
                    onChange={(e) => {
                      setWelcomeMessage(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full bg-[#FAF8F5] border border-[#DDD5C9] rounded-xl p-3.5 text-xs text-[#201A15] leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#705535]"
                  />

                  {/* Character Counter & Tip */}
                  <div className="flex items-center justify-between text-[11px] text-[#8C8275] pt-0.5">
                    <span>
                      Supports plain typographic linebreaks. Dynamic guest tokens supported.
                    </span>
                    <span className="font-mono font-medium">
                      {welcomeMessage.length} / 300 characters
                    </span>
                  </div>
                </div>
              </div>

              {/* CARD 3: Brand Colors */}
              <div className="bg-white rounded-2xl border border-[#E8E2D8] p-6 shadow-2xs space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#201A15]">
                      Brand Colors
                    </h3>
                    <p className="text-xs text-[#7A6F63]">
                      Defines the primary and accent palette on guest-facing mobile interfaces.
                    </p>
                  </div>
                  <div className="text-[#85653C]">
                    <Palette className="w-5 h-5" />
                  </div>
                </div>

                {/* 2-Column Color Swatches */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Primary Color Box */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">
                      PRIMARY COLOR {isLiteralMockup && <span className="font-mono text-[#85653C]">{'{PRIMARY_COLOR}'}</span>}
                    </label>
                    <div className="p-3 rounded-xl border border-[#DDD5C9] bg-[#FAF8F5] flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg shadow-2xs border border-black/10 shrink-0"
                        style={{ backgroundColor: primaryColor }}
                      />
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={primaryColor}
                          onChange={(e) => {
                            setPrimaryColor(e.target.value);
                            setHasUnsavedChanges(true);
                          }}
                          className="font-mono font-bold text-xs text-[#201A15] bg-transparent focus:outline-none w-full uppercase"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-[#7A6F63]">Warm Luxury Bronze</p>
                  </div>

                  {/* Secondary Accent Box */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">
                      SECONDARY ACCENT {isLiteralMockup && <span className="font-mono text-[#85653C]">{'{SECONDARY_COLOR}'}</span>}
                    </label>
                    <div className="p-3 rounded-xl border border-[#DDD5C9] bg-[#FAF8F5] flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg shadow-2xs border border-black/10 shrink-0"
                        style={{ backgroundColor: secondaryColor }}
                      />
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={secondaryColor}
                          onChange={(e) => {
                            setSecondaryColor(e.target.value);
                            setHasUnsavedChanges(true);
                          }}
                          className="font-mono font-bold text-xs text-[#201A15] bg-transparent focus:outline-none w-full uppercase"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-[#7A6F63]">Gilded Champagne Accent</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Contact Information, Guest Service Modules (Col Span 5) */}
            <div className="lg:col-span-5 space-y-6">
              {/* CARD 4: Contact Information */}
              <div className="bg-white rounded-2xl border border-[#E8E2D8] p-6 shadow-2xs space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#201A15]">
                      Contact Information
                    </h3>
                    <p className="text-xs text-[#7A6F63]">
                      Direct communication touchpoints provided to in-house guests.
                    </p>
                  </div>
                  <div className="text-[#85653C]">
                    <ContactBookIcon className="w-5 h-5" />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">
                    PHONE {isLiteralMockup && <span className="font-mono text-[#85653C]">{'{PHONE}'}</span>}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#8C8275] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full bg-[#FAF8F5] border border-[#DDD5C9] rounded-xl pl-9.5 pr-3.5 py-2.5 text-xs text-[#201A15] font-medium focus:outline-none focus:ring-1 focus:ring-[#705535]"
                    />
                  </div>
                  <p className="text-[10px] text-[#8C8275] pl-1">
                    Resort Concierge Desk (24/7 Internal PBX)
                  </p>
                </div>

                {/* WhatsApp Dispatch */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">
                    WHATSAPP DISPATCH {isLiteralMockup && <span className="font-mono text-[#85653C]">{'{WHATSAPP}'}</span>}
                  </label>
                  <div className="relative">
                    <MessageSquare className="w-4 h-4 text-[#8C8275] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={whatsapp}
                      onChange={(e) => {
                        setWhatsapp(e.target.value);
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full bg-[#FAF8F5] border border-[#DDD5C9] rounded-xl pl-9.5 pr-3.5 py-2.5 text-xs text-[#201A15] font-medium focus:outline-none focus:ring-1 focus:ring-[#705535]"
                    />
                  </div>
                  <p className="text-[10px] text-[#8C8275] pl-1">
                    Instant Butler WhatsApp Dispatch routing
                  </p>
                </div>

                {/* Resort Address */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">
                    RESORT ADDRESS {isLiteralMockup && <span className="font-mono text-[#85653C]">{'{ADDRESS}'}</span>}
                  </label>
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full bg-[#FAF8F5] border border-[#DDD5C9] rounded-xl p-3 text-xs text-[#201A15] leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#705535]"
                  />
                </div>
              </div>

              {/* CARD 5: Guest Service Modules */}
              <div className="bg-white rounded-2xl border border-[#E8E2D8] p-6 shadow-2xs space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#201A15]">
                      Guest Service Modules
                    </h3>
                    <p className="text-xs text-[#7A6F63]">
                      Toggle specific guest services live or offline. Disabled modules are hidden
                      from guest UI.
                    </p>
                  </div>
                  <div className="text-[#85653C]">
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                </div>

                {/* 4 Interactive Service Module Rows */}
                <div className="space-y-3">
                  {/* Module 1: Food Ordering */}
                  <div className="p-3.5 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] transition hover:border-[#D8CEBF] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#FAF5EB] border border-[#E5DAC8] flex items-center justify-center text-[#705535] shrink-0">
                          <UtensilsCrossed className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-xs text-[#201A15]">
                              Food Ordering
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                                moduleFood
                                  ? 'bg-[#EBF7EE] text-[#1E7E34]'
                                  : 'bg-[#F0EDE8] text-[#8C8275]'
                              }`}
                            >
                              {moduleFood ? 'ACTIVE' : 'OFFLINE'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Luxury Toggle Switch */}
                      <button
                        type="button"
                        onClick={() => {
                          setModuleFood(!moduleFood);
                          setHasUnsavedChanges(true);
                          showToast(`Food Ordering module set to ${!moduleFood ? 'ACTIVE' : 'OFFLINE'}.`);
                        }}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${
                          moduleFood ? 'bg-[#705535]' : 'bg-[#DDD5C9]'
                        }`}
                        aria-label="Toggle Food Ordering"
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-200 ${
                            moduleFood ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-[11px] text-[#7A6F63] pl-11 leading-relaxed">
                      Enables guest in-room dining menu, item customization, cart, and food order
                      submission.
                    </p>
                  </div>

                  {/* Module 2: Room Service */}
                  <div className="p-3.5 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] transition hover:border-[#D8CEBF] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#FAF5EB] border border-[#E5DAC8] flex items-center justify-center text-[#705535] shrink-0">
                          <ConciergeHandBellIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-xs text-[#201A15]">
                              Room Service
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                                moduleRoomService
                                  ? 'bg-[#EBF7EE] text-[#1E7E34]'
                                  : 'bg-[#F0EDE8] text-[#8C8275]'
                              }`}
                            >
                              {moduleRoomService ? 'ACTIVE' : 'OFFLINE'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setModuleRoomService(!moduleRoomService);
                          setHasUnsavedChanges(true);
                          showToast(
                            `Room Service module set to ${!moduleRoomService ? 'ACTIVE' : 'OFFLINE'}.`
                          );
                        }}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${
                          moduleRoomService ? 'bg-[#705535]' : 'bg-[#DDD5C9]'
                        }`}
                        aria-label="Toggle Room Service"
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-200 ${
                            moduleRoomService ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-[11px] text-[#7A6F63] pl-11 leading-relaxed">
                      Enables guest housekeeping, extra linens, turn-down, and amenity requests.
                    </p>
                  </div>

                  {/* Module 3: Contact Reception */}
                  <div className="p-3.5 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] transition hover:border-[#D8CEBF] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#FAF5EB] border border-[#E5DAC8] flex items-center justify-center text-[#705535] shrink-0">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-xs text-[#201A15]">
                              Contact Reception
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                                moduleReception
                                  ? 'bg-[#EBF7EE] text-[#1E7E34]'
                                  : 'bg-[#F0EDE8] text-[#8C8275]'
                              }`}
                            >
                              {moduleReception ? 'ACTIVE' : 'OFFLINE'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setModuleReception(!moduleReception);
                          setHasUnsavedChanges(true);
                          showToast(
                            `Contact Reception module set to ${!moduleReception ? 'ACTIVE' : 'OFFLINE'}.`
                          );
                        }}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${
                          moduleReception ? 'bg-[#705535]' : 'bg-[#DDD5C9]'
                        }`}
                        aria-label="Toggle Contact Reception"
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-200 ${
                            moduleReception ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-[11px] text-[#7A6F63] pl-11 leading-relaxed">
                      Enables direct WhatsApp and phone call concierge routing.
                    </p>
                  </div>

                  {/* Module 4: Hotel Information */}
                  <div className="p-3.5 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] transition hover:border-[#D8CEBF] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#FAF5EB] border border-[#E5DAC8] flex items-center justify-center text-[#705535] shrink-0">
                          <Info className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-xs text-[#201A15]">
                              Hotel Information
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                                moduleInfo
                                  ? 'bg-[#EBF7EE] text-[#1E7E34]'
                                  : 'bg-[#F0EDE8] text-[#8C8275]'
                              }`}
                            >
                              {moduleInfo ? 'ACTIVE' : 'OFFLINE'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setModuleInfo(!moduleInfo);
                          setHasUnsavedChanges(true);
                          showToast(
                            `Hotel Information module set to ${!moduleInfo ? 'ACTIVE' : 'OFFLINE'}.`
                          );
                        }}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${
                          moduleInfo ? 'bg-[#705535]' : 'bg-[#DDD5C9]'
                        }`}
                        aria-label="Toggle Hotel Information"
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-200 ${
                            moduleInfo ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-[11px] text-[#7A6F63] pl-11 leading-relaxed">
                      Enables resort guide, spa compendium, pool timings, and property amenities.
                    </p>
                  </div>
                </div>

                {/* Live Preview Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPreviewModalOpen(true)}
                    className="w-full py-2.5 px-4 rounded-xl border border-[#D8CEBF] bg-[#F5EFEB] hover:bg-[#EAE2D7] text-xs font-bold text-[#705535] transition flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Preview Guest Experience (Screen 01 &amp; 02)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Change Logo Modal */}
      {isLogoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#D8CEBF] max-w-md w-full p-6 shadow-2xl relative text-[#201A15]">
            <button
              type="button"
              onClick={() => setIsLogoModalOpen(false)}
              className="absolute right-4 top-4 text-[#8A8074] hover:text-[#201A15] p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-[#E8E2D8] pb-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#705535] text-white flex items-center justify-center font-bold">
                <Upload className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#201A15]">
                  Update Resort Monogram &amp; Logo
                </h3>
                <p className="text-xs text-[#7A6F63]">
                  Select or upload vector SVG or transparent PNG (512×512).
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setLogoFileName('nivora-crest-gold.svg');
                    setLogoFormat('SVG Vector');
                    setIsLogoModalOpen(false);
                    setHasUnsavedChanges(true);
                    showToast('Selected Nivora Gold Crest Vector.');
                  }}
                  className="p-3 rounded-xl border border-[#C5A880] bg-[#FAF5EB] hover:bg-[#F2EAE0] text-center space-y-2 transition cursor-pointer"
                >
                  <div className="w-10 h-10 mx-auto rounded-full bg-[#705535] text-white font-serif font-bold flex items-center justify-center">
                    N
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#201A15]">Gold Crest (Default)</p>
                    <p className="text-[10px] text-[#8C8275]">Vector SVG • 512px</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLogoFileName('nivora-minimal-bronze.png');
                    setLogoFormat('PNG 24-bit');
                    setIsLogoModalOpen(false);
                    setHasUnsavedChanges(true);
                    showToast('Selected Nivora Minimal Bronze Crest.');
                  }}
                  className="p-3 rounded-xl border border-[#DDD5C9] bg-white hover:bg-[#F5EFEB] text-center space-y-2 transition cursor-pointer"
                >
                  <div className="w-10 h-10 mx-auto rounded-full bg-[#201A15] text-[#D4AF37] font-serif font-bold flex items-center justify-center">
                    N
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#201A15]">Midnight Monogram</p>
                    <p className="text-[10px] text-[#8C8275]">High Contrast • 512px</p>
                  </div>
                </button>
              </div>

              <div className="border-2 border-dashed border-[#DDD5C9] rounded-xl p-4 text-center hover:border-[#705535] transition cursor-pointer bg-white">
                <Camera className="w-6 h-6 mx-auto text-[#8C8275] mb-1" />
                <p className="text-xs font-bold text-[#201A15]">Click to browse custom file</p>
                <p className="text-[10px] text-[#8C8275]">Supports SVG, PNG, WEBP max 2MB</p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogoModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#705535] text-white hover:bg-[#5C452A] transition"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Upload Cover Modal */}
      {isCoverModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#D8CEBF] max-w-lg w-full p-6 shadow-2xl relative text-[#201A15]">
            <button
              type="button"
              onClick={() => setIsCoverModalOpen(false)}
              className="absolute right-4 top-4 text-[#8A8074] hover:text-[#201A15] p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-[#E8E2D8] pb-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#705535] text-white flex items-center justify-center font-bold">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#201A15]">
                  Select Compendium Hero Cover
                </h3>
                <p className="text-xs text-[#7A6F63]">
                  High resolution photography shown on the in-room guest landing portal.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCoverImage('/hero-balcony.jpg');
                    setCoverTitle('Oceanfront Balcony ROOM Compendium Banner');
                    setCoverMeta('Active since Nov 14, 2024 • High-Resolution Master');
                    setIsCoverModalOpen(false);
                    setHasUnsavedChanges(true);
                    showToast('Assigned Oceanfront Balcony Cover.');
                  }}
                  className="relative rounded-xl overflow-hidden aspect-16/9 border-2 border-[#705535] shadow-xs group text-left p-2 flex flex-col justify-end"
                >
                  <Image
                    src="/hero-balcony.jpg"
                    alt="Oceanfront Balcony"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50" />
                  <span className="relative z-10 text-[10px] font-bold text-white drop-shadow-xs">
                    Balcony &amp; Dining (Default)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCoverImage('/hero-clean.jpg');
                    setCoverTitle('Sunset Infinity Pool & Horizon Villa');
                    setCoverMeta('Uploaded Nov 16, 2026 • 1920 × 1080 Ultra HD');
                    setIsCoverModalOpen(false);
                    setHasUnsavedChanges(true);
                    showToast('Assigned Sunset Infinity Pool Cover.');
                  }}
                  className="relative rounded-xl overflow-hidden aspect-16/9 border border-[#DDD5C9] hover:border-[#705535] shadow-xs group text-left p-2 flex flex-col justify-end"
                >
                  <Image
                    src="/hero-clean.jpg"
                    alt="Sunset Infinity Pool"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50" />
                  <span className="relative z-10 text-[10px] font-bold text-white drop-shadow-xs">
                    Sunset Pool &amp; Horizon
                  </span>
                </button>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsCoverModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#705535] text-white hover:bg-[#5C452A] transition"
                >
                  Confirm Cover
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Live Guest Preview Modal (Screen 01 & 02 Simulation) */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#241C15] rounded-3xl border border-[#44382F] max-w-sm w-full p-4 shadow-2xl relative text-white">
            <button
              type="button"
              onClick={() => setIsPreviewModalOpen(false)}
              className="absolute right-3.5 top-3.5 text-[#B8AEA2] hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Mobile Viewport Simulation */}
            <div className="bg-[#FAF8F5] rounded-2xl overflow-hidden text-[#201A15] shadow-inner border border-[#DDD5C9]">
              {/* Header Banner */}
              <div className="relative aspect-16/9 w-full bg-black">
                <Image
                  src={coverImage}
                  alt="Guest Preview Banner"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold">
                    {hotelName}
                  </span>
                  <h5 className="font-serif font-bold text-sm">Welcome, Honored Guest</h5>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                <p className="text-[11px] text-[#4A3E31] leading-relaxed italic">
                  &ldquo;{welcomeMessage}&rdquo;
                </p>

                {/* Active Modules Preview */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[#8A8074]">
                    Available Services:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div
                      className={`p-2 rounded-lg border flex items-center gap-1.5 ${
                        moduleFood
                          ? 'border-[#C5A880] bg-[#FAF5EB] text-[#705535] font-bold'
                          : 'border-dashed border-gray-300 text-gray-400 line-through'
                      }`}
                    >
                      <UtensilsCrossed className="w-3.5 h-3.5 shrink-0" />
                      <span>Food Ordering</span>
                    </div>

                    <div
                      className={`p-2 rounded-lg border flex items-center gap-1.5 ${
                        moduleRoomService
                          ? 'border-[#C5A880] bg-[#FAF5EB] text-[#705535] font-bold'
                          : 'border-dashed border-gray-300 text-gray-400 line-through'
                      }`}
                    >
                      <ConciergeHandBellIcon className="w-3.5 h-3.5 shrink-0" />
                      <span>Room Service</span>
                    </div>

                    <div
                      className={`p-2 rounded-lg border flex items-center gap-1.5 ${
                        moduleReception
                          ? 'border-[#C5A880] bg-[#FAF5EB] text-[#705535] font-bold'
                          : 'border-dashed border-gray-300 text-gray-400 line-through'
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      <span>Reception Desk</span>
                    </div>

                    <div
                      className={`p-2 rounded-lg border flex items-center gap-1.5 ${
                        moduleInfo
                          ? 'border-[#C5A880] bg-[#FAF5EB] text-[#705535] font-bold'
                          : 'border-dashed border-gray-300 text-gray-400 line-through'
                      }`}
                    >
                      <Info className="w-3.5 h-3.5 shrink-0" />
                      <span>Resort Guide</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#EAE1D3] text-[10px] text-[#8C8275]">
                  <p className="font-bold text-[#201A15]">Direct Concierge Phone:</p>
                  <p>{phone}</p>
                </div>
              </div>
            </div>

            <div className="mt-3 flex justify-between items-center px-1">
              <span className="text-[10px] text-[#A39686]">Simulated Guest Screen 01</span>
              <Link
                href="/guest"
                target="_blank"
                className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Open in Tab</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
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

export default function AdminSettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-xs text-[#7A6F63]">
          Loading hotel configuration...
        </div>
      }
    >
      <AdminSettingsContent />
    </Suspense>
  );
}
