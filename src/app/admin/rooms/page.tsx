'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
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
  Plus,
  Download,
  ExternalLink,
  Pencil,
  Trash2,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  Check,
  Radio,
  Printer,
  Copy,
  DoorClosed,
} from 'lucide-react';
import { useNivora } from '@/context/NivoraContext';
import { apiRequest } from '@/lib/api';

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

function BroomIcon({ className = 'w-5 h-5' }: { className?: string }) {
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
      <path d="m14 4 6 6" />
      <path d="m18 8-8.5 8.5a2.12 2.12 0 0 1-3 0L5 15" />
      <path d="m3 21 6-6" />
      <path d="M2 18h4v4" />
    </svg>
  );
}

export interface RoomRecord {
  id: string;
  roomNumber: string;
  roomLive: string;
  floorLive: string;
  qrCode: string;
  qrId?: string;
  qrUrl?: string;
  qrImage?: string;
  scanTime: string;
  scanCount: number;
  qrActive: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  lastUpdated: string;
}

function AdminRoomsContent() {
  const [isLoading, setIsLoading] = useState(true);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [floorFilter, setFloorFilter] = useState('All Floors');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomRecord | null>(null);
  const [selectedQrRoom, setSelectedQrRoom] = useState<RoomRecord | null>(null);

  // New room form state
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newFloor, setNewFloor] = useState('Floor 4');
  const [newStatus, setNewStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');

  const showToast = React.useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const [rooms, setRooms] = useState<RoomRecord[]>([]);
  const loadRooms = React.useCallback(async () => {
    try {
      const [roomResponse, qrResponse] = await Promise.all([
        apiRequest<{ rooms: Array<{ id: string; room_number: string; floor: string | null; status: 'ACTIVE' | 'INACTIVE'; created_at: string; updated_at: string }> }>('/rooms'),
        apiRequest<{ qr_codes: Array<{ id: string; room_id: string; token: string; url: string; is_active: boolean; qr_image?: string }> }>('/qr?include_image=true'),
      ]);
      const qrByRoom = new Map<string, (typeof qrResponse.qr_codes)[number]>();
      for (const qr of qrResponse.qr_codes) {
        if (!qrByRoom.has(qr.room_id)) qrByRoom.set(qr.room_id, qr);
      }
      setRooms(roomResponse.rooms.map((room) => {
        const qr = qrByRoom.get(room.id);
        const floor = room.floor || 'Unassigned';
        return {
          id: room.id,
          roomNumber: room.room_number,
          roomLive: room.room_number.match(/^room\s/i) ? room.room_number : `Room ${room.room_number}`,
          floorLive: floor,
          qrCode: qr ? qr.token.slice(0, 12) : 'No QR code',
          qrId: qr?.id,
          qrUrl: qr?.url,
          qrImage: qr?.qr_image,
          scanTime: qr ? (qr.is_active ? 'QR token active' : 'QR token inactive') : 'QR token not generated',
          scanCount: 0,
          qrActive: qr?.is_active ?? false,
          status: room.status,
          createdAt: new Date(room.created_at).toLocaleDateString(),
          lastUpdated: new Date(room.updated_at).toLocaleDateString(),
        };
      }));
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to load rooms.');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    void loadRooms();
  }, [loadRooms]);

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      // Floor filter
      if (floorFilter !== 'All Floors') {
        const floorNum = floorFilter.replace('Floor ', '');
        if (!r.floorLive.includes(floorNum)) return false;
      }

      // Status filter
      if (statusFilter === 'Active' && r.status !== 'ACTIVE') return false;
      if (statusFilter === 'Inactive' && r.status !== 'INACTIVE') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesRoom = r.roomLive.toLowerCase().includes(q);
        const matchesQr = r.qrCode.toLowerCase().includes(q);
        if (!matchesRoom && !matchesQr) return false;
      }

      return true;
    });
  }, [rooms, floorFilter, statusFilter, searchQuery]);

  // Add Room
  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomNumber.trim()) return;
    try {
      const { room } = await apiRequest<{ room: { id: string } }>('/rooms', {
        method: 'POST',
        body: JSON.stringify({ room_number: newRoomNumber.trim(), floor: newFloor, status: newStatus }),
      });
      if (newStatus === 'ACTIVE') {
        await apiRequest('/qr', {
          method: 'POST',
          body: JSON.stringify({ room_id: room.id }),
        });
      }
      await loadRooms();
      setIsAddModalOpen(false);
      setNewRoomNumber('');
      showToast(`Room ${newRoomNumber.trim()} registered`);
    } catch (error) {
      await loadRooms();
      showToast(error instanceof Error ? error.message : 'Unable to create the room.');
    }
  };

  // Save Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;
    try {
      await apiRequest(`/rooms/${editingRoom.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          room_number: editingRoom.roomNumber,
          floor: editingRoom.floorLive,
          status: editingRoom.status,
        }),
      });
      if (editingRoom.qrId) {
        await apiRequest(`/qr/${editingRoom.qrId}`, {
          method: 'PATCH',
          body: JSON.stringify({ is_active: editingRoom.status === 'ACTIVE' }),
        });
      } else if (editingRoom.status === 'ACTIVE') {
        await apiRequest('/qr', {
          method: 'POST',
          body: JSON.stringify({ room_id: editingRoom.id }),
        });
      }
      await loadRooms();
      setEditingRoom(null);
      showToast('Room settings saved');
    } catch (error) {
      await loadRooms();
      showToast(error instanceof Error ? error.message : 'Unable to save room settings.');
    }
  };

  // Delete Room
  const handleDeleteRoom = async (id: string, roomName: string) => {
    if (confirm(`Are you sure you want to delete ${roomName}?`)) {
      try {
        await apiRequest(`/rooms/${id}`, { method: 'DELETE' });
        await loadRooms();
        showToast('Room removed');
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Unable to delete the room.');
      }
    }
  };

  // Batch Export action
  const handleBatchExport = () => {
    showToast('Exporting Batch QR Tokens: Generating 28 high-res tent card PDFs...');
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

              {/* 5. Rooms (ACTIVE) */}
              <Link
                href="/admin/rooms"
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition bg-[#85653C] text-white shadow-xs"
              >
                <Bed className="w-4 h-4 text-white" />
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
        <div className="flex-1 min-w-0 p-5 sm:p-8 lg:p-10 space-y-6 max-w-[1500px] mx-auto w-full">
          {/* Breadcrumb & Top Bar */}
          <div className="flex items-center justify-between">
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-[#7A6F63]">
              <Link href="/admin" className="hover:text-[#201A15] transition">
                Operations
              </Link>
              <span className="text-[#C2B7A8]">/</span>
              <span className="font-serif font-bold text-[#201A15] text-sm sm:text-base">
                Rooms Management
              </span>
            </nav>

            <div className="flex items-center gap-4">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5A5046] hover:text-[#201A15] transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </Link>
            </div>
          </div>

          {/* Subheader & Top Action Buttons */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-1">
              <nav className="text-[11px] text-[#7A6F63]">
                <span>Operations</span>
                <span className="mx-1.5">/</span>
                <span>Rooms</span>
                <span className="mx-1.5">/</span>
                <span className="font-semibold text-[#201A15]">Active Inventory</span>
              </nav>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#201A15] tracking-tight">
                Rooms
              </h2>
              <p className="text-xs sm:text-sm text-[#665D52] max-w-2xl">
                Manage physical ROOMs &amp; pool cabanas linked to the Nivora Concierge QR dining network.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto shrink-0">
              {/* Add Room Button */}
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#705535] hover:bg-[#5C452A] text-white text-xs font-bold shadow-sm transition cursor-pointer active:scale-98"
              >
                <Plus className="w-4 h-4 text-white" />
                <span>+ Add Room</span>
              </button>

              {/* Batch QR Export */}
              <button
                type="button"
                onClick={handleBatchExport}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E8E2D8] text-xs font-bold text-[#201A15] shadow-2xs hover:bg-[#FAF7F2] transition cursor-pointer active:scale-95"
              >
                <Download className="w-4 h-4 text-[#705535]" />
                <span>Batch QR Export</span>
              </button>
            </div>
          </div>

          {/* 4 Metric KPI Stat Cards Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {/* Card 1: CONFIGURED ROOMS */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EFE9DF] shadow-2xs flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#8A8074]">
                  CONFIGURED ROOMS
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#201A15]">
                    {rooms.length}
                  </span>
                  <span className="text-xs text-[#7A6F63]">Total</span>
                </div>
              </div>

              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center text-[#705535] shrink-0">
                <DoorClosed className="w-5 h-5 text-[#705535]" />
              </div>
            </div>

            {/* Card 2: ACTIVE & QR SYNCED */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EFE9DF] shadow-2xs flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#8A8074]">
                  ACTIVE &amp; QR SYNCED
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#201A15]">
                    {rooms.filter((room) => room.status === 'ACTIVE' && room.qrActive).length}
                  </span>
                  <span className="text-xs text-[#7A6F63]">Online</span>
                </div>
              </div>

              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center text-[#705535] shrink-0">
                <QrCode className="w-5 h-5 text-[#705535]" />
              </div>
            </div>

            {/* Card 3: INACTIVE / CLEANING */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EFE9DF] shadow-2xs flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#8A8074]">
                  INACTIVE / CLEANING
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#201A15]">
                    {rooms.filter((room) => room.status === 'INACTIVE').length}
                  </span>
                  <span className="text-xs text-[#7A6F63]">Offline</span>
                </div>
              </div>

              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center text-[#705535] shrink-0">
                <BroomIcon className="w-5 h-5 text-[#705535]" />
              </div>
            </div>

            {/* Card 4: MESH TELEMETRY */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EFE9DF] shadow-2xs flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[#8A8074]">
                    MESH TELEMETRY
                  </p>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#201A15]">
                    Terminal
                  </span>
                  <span className="font-mono text-sm font-bold text-[#705535]">#04</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] text-[10px] font-bold text-[#8C5D29]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>Live</span>
              </div>
            </div>
          </div>

          {/* Search, Floor & Status Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#8A8074] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search room"
                className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl pl-9 pr-8 py-2 text-xs text-[#201A15] placeholder:text-[#8A8074] focus:outline-none focus:border-[#705535] transition"
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

            <div className="flex flex-wrap items-center gap-3">
              {/* Floor Dropdown */}
              <div className="bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3 py-1.5 text-xs font-bold text-[#201A15] flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase text-[#8A8074]">FLOOR:</span>
                <select
                  value={floorFilter}
                  onChange={(e) => setFloorFilter(e.target.value)}
                  className="bg-transparent font-bold text-xs text-[#201A15] focus:outline-none cursor-pointer"
                >
                  <option value="All Floors">All Floors</option>
                  <option value="Floor 1">Floor 1</option>
                  <option value="Floor 2">Floor 2</option>
                  <option value="Floor 3">Floor 3</option>
                  <option value="Floor 4">Floor 4</option>
                  <option value="Floor 5">Floor 5</option>
                </select>
              </div>

              {/* Status Dropdown */}
              <div className="bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3 py-1.5 text-xs font-bold text-[#201A15] flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase text-[#8A8074]">STATUS:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent font-bold text-xs text-[#201A15] focus:outline-none cursor-pointer"
                >
                  <option value="All Status">All Status</option>
                  <option value="Active">Active Only</option>
                  <option value="Inactive">Inactive / Offline</option>
                </select>
              </div>

              <span className="text-xs font-bold text-[#8A8074] whitespace-nowrap">
                {filteredRooms.length} of {rooms.length} rooms
              </span>
            </div>
          </div>

          {/* Wing & Pavilion Inventory Distribution Card */}
          <div className="bg-white rounded-2xl p-5 border border-[#EFE9DF] shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#705535]" />
                <h4 className="font-bold text-xs sm:text-sm text-[#201A15]">
                  Wing &amp; Pavilion Inventory Distribution
                </h4>
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">
                HARDWARE QR TOKENS: SYNCED
              </span>
            </div>

            {/* Labels Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-[11px] text-[#554C42]">
              <div>
                <span className="font-bold text-[#201A15]">Ocean Front (F4)</span>
                <span className="text-[#8A8074]"> • 8 Rooms</span>
              </div>
              <div>
                <span className="font-bold text-[#201A15]">Veranda ROOMs (F2)</span>
                <span className="text-[#8A8074]"> • 6 Rooms</span>
              </div>
              <div>
                <span className="font-bold text-[#201A15]">Palm Wing (F3)</span>
                <span className="text-[#8A8074]"> • 6 Rooms</span>
              </div>
              <div>
                <span className="font-bold text-[#201A15]">Garden &amp; Cabanas (F1)</span>
                <span className="text-[#8A8074]"> • 6 Rooms</span>
              </div>
              <div>
                <span className="font-bold text-[#201A15]">Presidential (F5)</span>
                <span className="text-[#8A8074]"> • 2 Rooms</span>
              </div>
            </div>

            {/* Segmented Progress Bar */}
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-[#FAF7F2] p-0.5 border border-[#EAE3D9]">
              <div style={{ width: '28.6%' }} className="h-full bg-[#705535] rounded-l-full" title="Ocean Front (F4) • 8 Rooms" />
              <div style={{ width: '21.4%' }} className="h-full bg-[#8C5D29] ml-0.5" title="Veranda ROOMs (F2) • 6 Rooms" />
              <div style={{ width: '21.4%' }} className="h-full bg-[#A87C4F] ml-0.5" title="Palm Wing (F3) • 6 Rooms" />
              <div style={{ width: '21.4%' }} className="h-full bg-[#C49B72] ml-0.5" title="Garden & Cabanas (F1) • 6 Rooms" />
              <div style={{ width: '7.2%' }} className="h-full bg-[#E0BE9D] ml-0.5 rounded-r-full" title="Presidential (F5) • 2 Rooms" />
            </div>
          </div>

          {/* Rooms Table */}
          <div className="bg-white rounded-2xl border border-[#EFE9DF] shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#F2ECE3] bg-[#FAF8F5]/60 text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">
                    <th className="py-3.5 px-4 sm:px-6 w-36">ROOM NUMBER</th>
                    <th className="py-3.5 px-4 sm:px-6 w-24">FLOOR</th>
                    <th className="py-3.5 px-4 sm:px-6">ASSOCIATED QR CODE</th>
                    <th className="py-3.5 px-4 sm:px-6 w-32">ROOM STATUS</th>
                    <th className="py-3.5 px-4 sm:px-6 w-36">CREATED AT</th>
                    <th className="py-3.5 px-4 sm:px-6 w-32">LAST UPDATED</th>
                    <th className="py-3.5 px-4 sm:px-6 w-28 text-right">ACTIONS</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F6F2EC] text-xs">
                  {filteredRooms.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-[#8A8074]">
                        <Bed className="w-8 h-8 mx-auto text-[#C2B7A8] mb-2" />
                        <p className="font-bold text-sm text-[#201A15]">
                          {isLoading ? 'Loading rooms…' : 'No rooms match your filter criteria'}
                        </p>
                        <p className="text-xs text-[#8A8074] mt-0.5">Try resetting search or floor selection.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredRooms.map((room) => (
                      <tr
                        key={room.id}
                        className="hover:bg-[#FAF7F2] transition group"
                      >
                        {/* 1. Room Number */}
                        <td className="py-4 px-4 sm:px-6 align-middle font-bold text-sm text-[#201A15]">
                          <div>
                            <span>{room.roomLive}</span>
                          </div>
                        </td>

                        {/* 2. Floor */}
                        <td className="py-4 px-4 sm:px-6 align-middle text-xs text-[#554C42]">
                          <span>{room.floorLive}</span>
                        </td>

                        {/* 3. Associated QR Code */}
                        <td className="py-4 px-4 sm:px-6 align-middle">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center text-[#705535] shrink-0">
                              <QrCode className="w-4 h-4 text-[#705535]" />
                            </div>

                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-bold text-xs text-[#201A15]">
                                  {room.qrCode}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setSelectedQrRoom(room)}
                                  className="text-[#8A8074] hover:text-[#705535] transition cursor-pointer"
                                  title="View QR Code"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              </div>

                              <p className={`text-[11px] ${room.qrActive ? 'text-[#7A6F63]' : 'text-[#8A8074] italic'}`}>
                                {room.scanTime} {room.scanCount > 0 ? `• ${room.scanCount} scans` : ''}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* 4. Room Status */}
                        <td className="py-4 px-4 sm:px-6 align-middle">
                          {room.status === 'ACTIVE' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FDF0E2] text-[#8C5D29] border border-[#F6D7BC] text-[10px] font-bold tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C27E43]" />
                              <span>ACTIVE</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F2EDE7] text-[#7A6F63] border border-[#E8E2D8] text-[10px] font-bold tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#8A8074]" />
                              <span>INACTIVE</span>
                            </span>
                          )}
                        </td>

                        {/* 5. Created At */}
                        <td className="py-4 px-4 sm:px-6 align-middle text-xs text-[#554C42]">
                          <span>{room.createdAt}</span>
                        </td>

                        {/* 6. Last Updated */}
                        <td className="py-4 px-4 sm:px-6 align-middle text-xs font-medium text-[#201A15]">
                          <span>{room.lastUpdated}</span>
                        </td>

                        {/* 7. Actions */}
                        <td className="py-4 px-4 sm:px-6 align-middle text-right">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <button
                              type="button"
                              onClick={() => setSelectedQrRoom(room)}
                              className="p-1.5 rounded-lg border border-[#E8E2D8] bg-white hover:bg-[#FAF7F2] text-[#705535] transition cursor-pointer shadow-2xs"
                              title="Show In-Room QR Code"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setEditingRoom(room)}
                              className="p-1.5 rounded-lg border border-[#E8E2D8] bg-white hover:bg-[#FAF7F2] text-[#4E4438] transition cursor-pointer shadow-2xs"
                              title="Edit Room"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteRoom(room.id, room.roomLive)}
                              className="p-1.5 rounded-lg border border-[#E8E2D8] bg-white hover:bg-[#FAF7F2] text-[#C2410C] transition cursor-pointer shadow-2xs"
                              title="Delete Room"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="py-3 px-4 sm:px-6 border-t border-[#F2ECE3] bg-[#FAF8F5]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7A6F63]">
              <p>Showing {filteredRooms.length} of {rooms.length} rooms</p>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="w-7 h-7 rounded-lg border border-[#E8E2D8] bg-white flex items-center justify-center text-[#5A5046] hover:bg-[#FAF7F2] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {[1, 2, 3, 4].map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition cursor-pointer ${
                      currentPage === page
                        ? 'bg-[#705535] text-white shadow-xs'
                        : 'bg-white border border-[#E8E2D8] text-[#5A5046] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === 4}
                  onClick={() => setCurrentPage((p) => Math.min(4, p + 1))}
                  className="w-7 h-7 rounded-lg border border-[#E8E2D8] bg-white flex items-center justify-center text-[#5A5046] hover:bg-[#FAF7F2] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Room Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="bg-[#FAF8F5] rounded-3xl max-w-md w-full border border-[#EFE9DF] shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#EAE3D9] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#201A15]">
                Provision New Room
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F2EDE7] flex items-center justify-center text-[#7A6F63] hover:text-[#201A15]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRoom} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#201A15] uppercase tracking-wider text-[10px]">
                  Room / Suite Number
                </label>
                <input
                  type="text"
                  required
                  value={newRoomNumber}
                  onChange={(e) => setNewRoomNumber(e.target.value)}
                  placeholder="e.g. 405 or Cabana 05"
                  className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 text-xs text-[#201A15] focus:outline-none focus:border-[#705535]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#201A15] uppercase tracking-wider text-[10px]">
                    Floor
                  </label>
                  <select
                    value={newFloor}
                    onChange={(e) => setNewFloor(e.target.value)}
                    className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 text-xs text-[#201A15] focus:outline-none focus:border-[#705535]"
                  >
                    <option value="Floor 1">Floor 1</option>
                    <option value="Floor 2">Floor 2</option>
                    <option value="Floor 3">Floor 3</option>
                    <option value="Floor 4">Floor 4</option>
                    <option value="Floor 5">Floor 5</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#201A15] uppercase tracking-wider text-[10px]">
                  Room Status
                </label>
                <div className="flex items-center gap-3 pt-1">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={newStatus === 'ACTIVE'}
                      onChange={() => setNewStatus('ACTIVE')}
                      className="accent-[#705535]"
                    />
                    <span className="font-bold text-xs text-[#201A15]">Active (Online)</span>
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={newStatus === 'INACTIVE'}
                      onChange={() => setNewStatus('INACTIVE')}
                      className="accent-[#705535]"
                    />
                    <span className="font-bold text-xs text-[#7A6F63]">Inactive (Cleaning)</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E8E2D8] bg-white text-xs font-bold text-[#5A5046]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#705535] hover:bg-[#5C452A] text-white text-xs font-bold shadow-xs transition"
                >
                  Provision Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {editingRoom && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setEditingRoom(null)}
        >
          <div
            className="bg-[#FAF8F5] rounded-3xl max-w-md w-full border border-[#EFE9DF] shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#EAE3D9] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#201A15]">
                Edit: {editingRoom.roomLive}
              </h3>
              <button
                type="button"
                onClick={() => setEditingRoom(null)}
                className="w-8 h-8 rounded-full bg-[#F2EDE7] flex items-center justify-center text-[#7A6F63] hover:text-[#201A15]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#201A15] uppercase tracking-wider text-[10px]">
                  Room Label
                </label>
                <input
                  type="text"
                  required
                  value={editingRoom.roomLive}
                  onChange={(e) => setEditingRoom({
                    ...editingRoom,
                    roomLive: e.target.value,
                    roomNumber: e.target.value.replace(/^Room\s+/i, ''),
                  })}
                  className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 text-xs text-[#201A15] focus:outline-none focus:border-[#705535]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#201A15] uppercase tracking-wider text-[10px]">
                    Floor
                  </label>
                  <select
                    value={editingRoom.floorLive}
                    onChange={(e) => setEditingRoom({ ...editingRoom, floorLive: e.target.value })}
                    className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 text-xs text-[#201A15] focus:outline-none focus:border-[#705535]"
                  >
                    <option value="Floor 1">Floor 1</option>
                    <option value="Floor 2">Floor 2</option>
                    <option value="Floor 3">Floor 3</option>
                    <option value="Floor 4">Floor 4</option>
                    <option value="Floor 5">Floor 5</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="room-status"
                  checked={editingRoom.status === 'ACTIVE'}
                  onChange={(e) =>
                    setEditingRoom({
                      ...editingRoom,
                      status: e.target.checked ? 'ACTIVE' : 'INACTIVE',
                      qrActive: e.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-[#705535] rounded"
                />
                <label htmlFor="room-status" className="font-bold text-xs text-[#201A15] cursor-pointer">
                  Room Active &amp; Ready for Guests
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingRoom(null)}
                  className="px-4 py-2 rounded-xl border border-[#E8E2D8] bg-white text-xs font-bold text-[#5A5046]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#705535] hover:bg-[#5C452A] text-white text-xs font-bold shadow-xs transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code In-Room Tent Card Modal */}
      {selectedQrRoom && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedQrRoom(null)}
        >
          <div
            className="bg-[#FAF8F5] rounded-3xl max-w-sm w-full border border-[#EFE9DF] shadow-2xl p-6 space-y-5 text-center animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#EAE3D9] pb-3">
              <div className="text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">
                  IN-ROOM TENT CARD TOKEN
                </span>
                <h3 className="font-serif text-lg font-bold text-[#201A15]">
                  {selectedQrRoom.roomLive}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedQrRoom(null)}
                className="w-8 h-8 rounded-full bg-[#F2EDE7] flex items-center justify-center text-[#7A6F63] hover:text-[#201A15]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable QR Token Card */}
            <div className="bg-white p-5 rounded-2xl border border-[#EAE3D9] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#705535] text-white flex items-center justify-center font-serif text-lg font-bold mx-auto">
                N
              </div>

              <div>
                <h4 className="font-serif text-base font-bold text-[#201A15]">
                  Nivora Concierge
                </h4>
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#8A8074]">
                  {selectedQrRoom.floorLive}
                </p>
              </div>

              {/* QR image is generated by the backend from the guest-session token. */}
              <div className="w-44 h-44 mx-auto rounded-xl bg-[#FAF7F2] border-2 border-dashed border-[#DDD3C7] p-3 flex flex-col items-center justify-center space-y-2">
                {selectedQrRoom.qrImage ? (
                  <img src={selectedQrRoom.qrImage} alt={`Guest QR code for ${selectedQrRoom.roomLive}`} className="w-full h-full object-contain" />
                ) : (
                  <span className="font-mono text-[10px] font-bold text-[#705535]">No QR code generated</span>
                )}
              </div>

              <p className="text-xs text-[#554C42] leading-tight pt-1">
                Scan with any smartphone camera to launch your bespoke in-room dining and concierge services.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  showToast('Printing tent card to concierge desk printer...');
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#705535] hover:bg-[#5C452A] text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Card</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (selectedQrRoom.qrUrl) {
                    void navigator.clipboard.writeText(selectedQrRoom.qrUrl);
                    showToast('Guest QR link copied to clipboard');
                  } else {
                    showToast('Generate a QR code before copying a guest link');
                  }
                }}
                className="p-2.5 rounded-xl border border-[#E8E2D8] bg-white text-[#5A5046] hover:bg-[#FAF7F2] transition cursor-pointer"
                title="Copy URL"
              >
                <Copy className="w-4 h-4" />
              </button>
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

export default function AdminRoomsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6 text-center">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#705535] border-t-transparent animate-spin mx-auto" />
            <p className="font-serif text-[#201A15] font-bold">Loading Rooms Inventory...</p>
          </div>
        </div>
      }
    >
      <AdminRoomsContent />
    </Suspense>
  );
}
