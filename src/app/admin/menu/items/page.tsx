'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Plus,
  Eye,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Pencil,
  Trash2,
  HelpCircle,
  Monitor,
  Check,
  AlertCircle,
  Layers,
  Sparkles,
  RefreshCw,
  Ban,
  Filter,
  DollarSign,
  Tag,
  ArrowUpDown,
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

export interface MenuItemData {
  id: string;
  rank: number;
  title: string;
  description: string;
  sku: string;
  tag: string;
  category: string;
  isVeg: boolean;
  price: number;
  isAvailable: boolean;
  unavailableNotice?: string;
  image: string;
}

function AdminMenuItemsContent() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode');
  const [isLiteralMockup, setIsLiteralMockup] = useState(initialMode !== 'live');

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiet, setSelectedDiet] = useState<'All' | 'Veg' | 'Non-Veg'>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Available' | '86d'>('All');
  const [selectedCategory, setSelectedCategory] = useState('All Categories (42)');
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemData | null>(null);

  // Add Item form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Handcrafted Sandwiches & Burgers');
  const [newPrice, setNewPrice] = useState(850);
  const [newSku, setNewSku] = useState('NV-NEW-01');
  const [newTag, setNewTag] = useState('Chef Recommendation');
  const [newDesc, setNewDesc] = useState('');
  const [newIsVeg, setNewIsVeg] = useState(false);
  const [newImage, setNewImage] = useState(
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=300&q=80'
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Initial 7 Mockup items matching Screen 18
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([
    {
      id: 'item_1',
      rank: 1,
      title: 'Artisanal Wagyu Burger',
      description: 'Prime wagyu patty, brioche bun, aged truffle aioli, aged...',
      sku: 'SKU: NV-BUR-01',
      tag: '5-Star Rated',
      category: 'Handcrafted Sandwiches & Burgers',
      isVeg: false,
      price: 925,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'item_2',
      rank: 2,
      title: 'Maine Lobster Tail Roll',
      description: 'Poached Maine lobster, toasted milk bread, clarified...',
      sku: 'SKU: NV-SEA-02',
      tag: 'Chef Signature',
      category: 'Handcrafted Sandwiches & Burgers',
      isVeg: false,
      price: 1150,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'item_3',
      rank: 1,
      title: 'San Pellegrino Sparkling (750ml)',
      description: 'Chilled mineral sparkling water served with fresh organic',
      sku: 'SKU: NV-BEV-04',
      tag: 'Cellar Reserved',
      category: 'Signature Beverages & Refreshments',
      isVeg: true,
      price: 350,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'item_4',
      rank: 1,
      title: 'Valrhona Dark Chocolate Tart',
      description: '70% single-origin dark chocolate ganache, candied...',
      sku: 'SKU: NV-DES-08',
      tag: 'Pastry Atelier',
      category: 'Desserts & Sweet Delicacies',
      isVeg: true,
      price: 450,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'item_5',
      rank: 1,
      title: 'Wild Forest Mushroom & Truffle Risotto',
      description: 'Acquerello carnaroli rice, foraged chanterelles, 24-month',
      sku: 'SKU: NV-RIS-03',
      tag: 'Organic Italian',
      category: 'Gourmet Mains & Grills',
      isVeg: true,
      price: 850,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'item_6',
      rank: 2,
      title: 'Grilled Chilean Sea Bass',
      description: 'Pan-seared sea bass, saffron emulsion, braised fennel,...',
      sku: 'SKU: NV-SEA-05',
      tag: 'Fresh Catch',
      category: 'Gourmet Mains & Grills',
      isVeg: false,
      price: 1400,
      isAvailable: false,
      unavailableNotice: 'Out of stock • Next delivery tomorrow 07:00 AM',
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'item_7',
      rank: 1,
      title: 'Avocado & Burrata Tartine',
      description: 'Crushed Hass avocado, pugliese sourdough, heirloom...',
      sku: 'SKU: NV-BRK-09',
      tag: 'Morning Special',
      category: 'Artisanal Breakfast & Bakery',
      isVeg: true,
      price: 550,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=300&q=80',
    },
  ]);

  // Categories list for filtering
  const categoryFilters = [
    'All Categories (42)',
    'Artisanal Breakfast & Bakery',
    'Gourmet Mains & Grills',
    'Handcrafted Sandwiches & Burgers',
    'Fresh Salads & Starters',
    'Desserts & Sweet Delicacies',
    'Signature Beverages & Refreshments',
  ];

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All Categories (42)' && item.category !== selectedCategory) {
        return false;
      }

      // Diet filter
      if (selectedDiet === 'Veg' && !item.isVeg) return false;
      if (selectedDiet === 'Non-Veg' && item.isVeg) return false;

      // Status filter
      if (selectedStatus === 'Available' && !item.isAvailable) return false;
      if (selectedStatus === '86d' && item.isAvailable) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesSku = item.sku.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesSku && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [menuItems, selectedCategory, selectedDiet, selectedStatus, searchQuery]);

  // Stats
  const totalDishesCount = 42;
  const availableCount = menuItems.filter((i) => i.isAvailable).length;
  const unavailableCount = menuItems.filter((i) => !i.isAvailable).length;

  // Toggle item availability (86'd)
  const toggleAvailability = (itemId: string, title: string) => {
    setMenuItems((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? {
              ...i,
              isAvailable: !i.isAvailable,
              unavailableNotice: !i.isAvailable
                ? undefined
                : 'Out of stock • Next delivery tomorrow 07:00 AM',
            }
          : i
      )
    );
    showToast(`Updated status for "${title}"`);
  };

  // Add Item
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: MenuItemData = {
      id: `item_${Date.now()}`,
      rank: 1,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Prepared fresh by the culinary atelier.',
      sku: `SKU: ${newSku.trim().toUpperCase()}`,
      tag: newTag.trim() || 'New Item',
      category: newCategory,
      isVeg: newIsVeg,
      price: Number(newPrice) || 500,
      isAvailable: true,
      image: newImage,
    };

    setMenuItems((prev) => [newItem, ...prev]);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    showToast(`Added "${newItem.title}" to catalog`);
  };

  // Save Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setMenuItems((prev) =>
      prev.map((i) => (i.id === editingItem.id ? editingItem : i))
    );
    setEditingItem(null);
    showToast(`Updated "${editingItem.title}"`);
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
        <aside className="w-full lg:w-60 xl:w-64 bg-[#FAF8F5] border-b lg:border-b-0 lg:border-r border-[#EAE3D9] p-5 sm:p-6 flex flex-col justify-between shrink-0">
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

              {/* 4. Menu (ACTIVE) */}
              <Link
                href="/admin/menu/items"
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition bg-[#85653C] text-white shadow-xs"
              >
                <UtensilsCrossed className="w-4 h-4 text-white" />
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
        <div className="flex-1 min-w-0 p-5 sm:p-8 lg:p-10 space-y-6">
          {/* Breadcrumb & Top Bar */}
          <div className="flex items-center justify-between">
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-[#7A6F63]">
              <span className="uppercase tracking-wider text-[11px] font-semibold">OPERATIONS</span>
              <span className="text-[#C2B7A8]">/</span>
              <Link href="/admin/menu" className="hover:text-[#201A15] transition">
                MENU
              </Link>
              <span className="text-[#C2B7A8]">/</span>
              <span className="font-serif font-bold text-[#201A15] text-sm sm:text-base">
                Categories Management
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

              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5A5046] hover:text-[#201A15] transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </Link>
            </div>
          </div>

          {/* Tab Navigation: Categories (7) vs Menu Items (42) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE3D9] pb-3">
            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/admin/menu"
                className="font-semibold text-[#7A6F63] hover:text-[#201A15] transition pb-1"
              >
                Categories (7)
              </Link>

              <div className="flex items-center gap-2 border-b-2 border-[#705535] pb-1">
                <span className="w-2 h-2 rounded-full bg-[#705535]" />
                <span className="font-bold text-[#201A15]">Menu Items (42)</span>
              </div>
            </div>

            <p className="text-[11px] text-[#8A8074] font-medium">
              Screen 18 — Luxury Catalog Administration
            </p>
          </div>

          {/* Subheader & Top Action Buttons */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#201A15] tracking-tight">
                  Menu Items
                </h2>

                <span className="bg-[#FDF0E2] text-[#8C5D29] text-xs font-bold px-2.5 py-1 rounded-md">
                  Resort Kitchen Active
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#665D52] max-w-2xl">
                Manage food items available to hotel guests across in-room dining, private cabanas, and ROOMs.
              </p>

              {/* Stat Chips Row */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#EAE3D9] text-xs font-semibold text-[#554C42] shadow-2xs">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-[#705535]" />
                  <span>42 Total Dishes</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#EAE3D9] text-xs font-semibold text-[#554C42] shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>39 Available</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FDF0EE] text-[#C2410C] border border-[#F5D5CE] text-xs font-bold shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C]" />
                  <span>3 86'd / Unavailable</span>
                </div>

                <div className="flex items-center gap-1 text-xs text-[#8A8074] pl-2">
                  <Clock className="w-3 h-3 text-[#8A8074]" />
                  <span>Last Synced: 2m ago</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto shrink-0">
              {/* Reorder Mode Button */}
              <button
                type="button"
                onClick={() => {
                  setIsReorderMode(!isReorderMode);
                  showToast(isReorderMode ? 'Reorder mode disabled' : 'Reorder mode enabled: drag handle unlocked');
                }}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer active:scale-95 shadow-2xs ${
                  isReorderMode
                    ? 'bg-[#705535] text-white border-[#705535]'
                    : 'bg-white border-[#E8E2D8] text-[#201A15] hover:bg-[#FAF7F2]'
                }`}
              >
                <GripVertical className="w-4 h-4" />
                <span>Reorder Mode</span>
              </button>

              {/* Add Food Item Button */}
              <Link
                href="/admin/menu/items/add"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#705535] hover:bg-[#5C452A] text-white text-xs font-bold shadow-sm transition cursor-pointer active:scale-98"
              >
                <Plus className="w-4 h-4 text-white" />
                <span>+ Add Food Item</span>
              </Link>
            </div>
          </div>

          {/* Search, Diet, Status Filter Toolbar */}
          <div className="space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#8A8074] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search food items by title, ingredients, or SKU..."
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

              {/* Diet & Status Filters */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Diet Filter Segment */}
                <div className="inline-flex items-center bg-white border border-[#E8E2D8] rounded-xl p-1 text-xs shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setSelectedDiet('All')}
                    className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                      selectedDiet === 'All' ? 'bg-[#F2EDE7] text-[#201A15]' : 'text-[#7A6F63] hover:text-[#201A15]'
                    }`}
                  >
                    All Diet
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDiet('Veg')}
                    className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      selectedDiet === 'Veg' ? 'bg-[#F2EDE7] text-[#201A15]' : 'text-[#7A6F63] hover:text-[#201A15]'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#705535]" />
                    <span>Veg</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDiet('Non-Veg')}
                    className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      selectedDiet === 'Non-Veg' ? 'bg-[#F2EDE7] text-[#201A15]' : 'text-[#7A6F63] hover:text-[#201A15]'
                    }`}
                  >
                    <span className="text-[10px] text-[#8C5D29]">▲</span>
                    <span>Non-Veg</span>
                  </button>
                </div>

                {/* Status Filter Segment */}
                <div className="inline-flex items-center bg-white border border-[#E8E2D8] rounded-xl p-1 text-xs shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setSelectedStatus('All')}
                    className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                      selectedStatus === 'All' ? 'bg-[#F2EDE7] text-[#201A15]' : 'text-[#7A6F63] hover:text-[#201A15]'
                    }`}
                  >
                    All Status
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedStatus('Available')}
                    className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                      selectedStatus === 'Available' ? 'bg-[#F2EDE7] text-[#201A15]' : 'text-[#7A6F63] hover:text-[#201A15]'
                    }`}
                  >
                    Available (39)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedStatus('86d')}
                    className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                      selectedStatus === '86d' ? 'bg-[#F2EDE7] text-[#C2410C]' : 'text-[#7A6F63] hover:text-[#C2410C]'
                    }`}
                  >
                    86'd (3)
                  </button>
                </div>
              </div>
            </div>

            {/* Category Filter Horizontal Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
              {categoryFilters.map((catName) => {
                const isActive = selectedCategory === catName;
                return (
                  <button
                    key={catName}
                    type="button"
                    onClick={() => setSelectedCategory(catName)}
                    className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition cursor-pointer ${
                      isActive
                        ? 'bg-[#705535] text-white shadow-xs'
                        : 'bg-white border border-[#E8E2D8] text-[#5A5046] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    {catName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Menu Items Table */}
          <div className="bg-white rounded-2xl border border-[#EFE9DF] shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#F2ECE3] bg-[#FAF8F5]/60">
                    <th className="py-3.5 px-4 sm:px-6 text-[10px] font-bold uppercase tracking-wider text-[#8A8074] w-20">
                      RANK
                    </th>
                    <th className="py-3.5 px-4 sm:px-6 text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">
                      ITEM &amp; DESCRIPTION
                    </th>
                    <th className="py-3.5 px-4 sm:px-6 text-[10px] font-bold uppercase tracking-wider text-[#8A8074] w-64">
                      CATEGORY
                    </th>
                    <th className="py-3.5 px-4 sm:px-6 text-[10px] font-bold uppercase tracking-wider text-[#8A8074] w-20 text-center">
                      DIET
                    </th>
                    <th className="py-3.5 px-4 sm:px-6 text-[10px] font-bold uppercase tracking-wider text-[#8A8074] w-28 text-right">
                      PRICE
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F6F2EC] text-xs">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-[#8A8074]">
                        <UtensilsCrossed className="w-8 h-8 mx-auto text-[#C2B7A8] mb-2" />
                        <p className="font-bold text-sm text-[#201A15]">No items match your filter criteria</p>
                        <p className="text-xs text-[#8A8074] mt-0.5">Try resetting search, category, or diet filters.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr
                        key={item.id}
                        className={`hover:bg-[#FAF7F2] transition group ${!item.isAvailable ? 'bg-[#FCF9F7]' : ''}`}
                      >
                        {/* 1. Rank */}
                        <td className="py-4 px-4 sm:px-6 align-middle font-mono font-bold text-[#201A15]">
                          <div className="flex items-center gap-1.5 text-xs text-[#8A8074]">
                            <GripVertical className="w-3.5 h-3.5 text-[#C2B7A8] group-hover:text-[#705535] cursor-grab" />
                            <span>#{item.rank}</span>
                          </div>
                        </td>

                        {/* 2. Item & Description */}
                        <td className="py-4 px-4 sm:px-6 align-middle">
                          <div className="flex items-start gap-3.5">
                            {/* Dish Photo */}
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#F2EDE7] shrink-0 relative border border-[#E8E2D8]">
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                unoptimized
                                className={`object-cover ${!item.isAvailable ? 'grayscale opacity-70' : ''}`}
                              />
                              {!item.isAvailable && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                                  <Ban className="w-5 h-5 text-red-300 stroke-[2.5]" />
                                </div>
                              )}
                            </div>

                            <div className="space-y-0.5 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4
                                  className={`font-bold text-sm sm:text-base ${
                                    item.isAvailable ? 'text-[#201A15]' : 'text-[#7A6F63] line-through'
                                  }`}
                                >
                                  {item.title}
                                </h4>

                                {!item.isAvailable && (
                                  <span className="bg-[#FDF0EE] text-[#C2410C] text-[9px] font-bold px-1.5 py-0.5 rounded">
                                    86'd
                                  </span>
                                )}
                              </div>

                              <p className="text-xs text-[#554C42] line-clamp-1">
                                {item.description}
                              </p>

                              {item.unavailableNotice ? (
                                <p className="text-[11px] font-bold text-[#C2410C]">
                                  {item.unavailableNotice}
                                </p>
                              ) : (
                                <p className="text-[11px] text-[#8A8074]">
                                  <span>{item.sku}</span>
                                  <span> • </span>
                                  <span>{item.tag}</span>
                                </p>
                              )}

                              {/* Action row on hover */}
                              <div className="pt-1 flex items-center gap-3 opacity-90 sm:opacity-0 group-hover:opacity-100 transition text-[11px]">
                                <Link
                                  href={`/admin/menu/items/edit?id=${item.id}`}
                                  className="text-[#705535] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <Pencil className="w-3 h-3" />
                                  <span>Edit Dish</span>
                                </Link>
                                <span>•</span>
                                <button
                                  type="button"
                                  onClick={() => toggleAvailability(item.id, item.title)}
                                  className={`font-bold hover:underline cursor-pointer ${
                                    item.isAvailable ? 'text-[#C2410C]' : 'text-emerald-700'
                                  }`}
                                >
                                  {item.isAvailable ? "Mark 86'd (Unavailable)" : 'Restore to Available'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 3. Category */}
                        <td className="py-4 px-4 sm:px-6 align-middle">
                          <span className="inline-block bg-[#FAF7F2] border border-[#EAE3D9] text-xs font-semibold px-2.5 py-1 rounded-md text-[#554C42]">
                            {item.category}
                          </span>
                        </td>

                        {/* 4. Diet */}
                        <td className="py-4 px-4 sm:px-6 align-middle text-center">
                          <div className="inline-flex items-center justify-center w-6 h-6 rounded border border-[#E5DFD5] bg-white">
                            {item.isVeg ? (
                              <span className="w-2.5 h-2.5 rounded-full bg-[#705535]" title="Vegetarian" />
                            ) : (
                              <span className="text-[10px] text-[#8C5D29]" title="Non-Vegetarian">
                                ▲
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 5. Price */}
                        <td className="py-4 px-4 sm:px-6 align-middle text-right font-serif text-sm sm:text-base font-bold text-[#201A15]">
                          ₹{item.price.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination & Snapshot Bar */}
            <div className="py-3 px-4 sm:px-6 border-t border-[#F2ECE3] bg-[#FAF8F5]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7A6F63]">
              <div className="flex items-center gap-2">
                <span>Showing <strong className="font-bold text-[#201A15]">{filteredItems.length}</strong> of <strong className="font-bold text-[#201A15]">{totalDishesCount}</strong> catalog items</span>
                <span>•</span>
                <span className="text-[10px] font-bold text-[#8A8074] uppercase tracking-wider">
                  SNAPSHOT PROTECTION ENABLED
                </span>
              </div>

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
                  Page {currentPage} of 6
                </span>

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(6, p + 1))}
                  className="px-3 py-1.5 rounded-lg border border-[#E8E2D8] bg-white text-xs font-bold text-[#5A5046] hover:bg-[#FAF7F2] transition cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Food Item Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="bg-[#FAF8F5] rounded-3xl max-w-lg w-full border border-[#EFE9DF] shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#EAE3D9] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#201A15]">
                Add Culinary Dish
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F2EDE7] flex items-center justify-center text-[#7A6F63] hover:text-[#201A15]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#201A15] uppercase tracking-wider text-[10px]">
                  Dish Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Royal Beluga Caviar Tartlet"
                  className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 text-xs text-[#201A15] focus:outline-none focus:border-[#705535]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#201A15] uppercase tracking-wider text-[10px]">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 text-xs text-[#201A15] focus:outline-none focus:border-[#705535]"
                  >
                    <option value="Handcrafted Sandwiches & Burgers">Handcrafted Sandwiches &amp; Burgers</option>
                    <option value="Gourmet Mains & Grills">Gourmet Mains &amp; Grills</option>
                    <option value="Fresh Salads & Starters">Fresh Salads &amp; Starters</option>
                    <option value="Desserts & Sweet Delicacies">Desserts &amp; Sweet Delicacies</option>
                    <option value="Signature Beverages & Refreshments">Signature Beverages &amp; Refreshments</option>
                    <option value="Artisanal Breakfast & Bakery">Artisanal Breakfast &amp; Bakery</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#201A15] uppercase tracking-wider text-[10px]">
                    Price (₹ INR)
                  </label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 text-xs text-[#201A15] focus:outline-none focus:border-[#705535]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#201A15] uppercase tracking-wider text-[10px]">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 text-xs text-[#201A15] focus:outline-none focus:border-[#705535]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#201A15] uppercase tracking-wider text-[10px]">
                    Diet Type
                  </label>
                  <select
                    value={newIsVeg ? 'veg' : 'non-veg'}
                    onChange={(e) => setNewIsVeg(e.target.value === 'veg')}
                    className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 text-xs text-[#201A15] focus:outline-none focus:border-[#705535]"
                  >
                    <option value="non-veg">Non-Vegetarian (▲)</option>
                    <option value="veg">Vegetarian (●)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#201A15] uppercase tracking-wider text-[10px]">
                  Description &amp; Ingredients
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Fresh ingredients, garnishes, culinary preparation details..."
                  className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3.5 py-2 text-xs text-[#201A15] focus:outline-none focus:border-[#705535]"
                />
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
                  Add Dish to Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Food Item Modal */}
      {editingItem && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setEditingItem(null)}
        >
          <div
            className="bg-[#FAF8F5] rounded-3xl max-w-lg w-full border border-[#EFE9DF] shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#EAE3D9] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#201A15]">
                Edit: {editingItem.title}
              </h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="w-8 h-8 rounded-full bg-[#F2EDE7] flex items-center justify-center text-[#7A6F63] hover:text-[#201A15]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#201A15] uppercase tracking-wider text-[10px]">
                  Dish Title
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 text-xs text-[#201A15] focus:outline-none focus:border-[#705535]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#201A15] uppercase tracking-wider text-[10px]">
                    Price (₹ INR)
                  </label>
                  <input
                    type="number"
                    required
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                    className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 text-xs text-[#201A15] focus:outline-none focus:border-[#705535]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#201A15] uppercase tracking-wider text-[10px]">
                    Diet Type
                  </label>
                  <select
                    value={editingItem.isVeg ? 'veg' : 'non-veg'}
                    onChange={(e) => setEditingItem({ ...editingItem, isVeg: e.target.value === 'veg' })}
                    className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 text-xs text-[#201A15] focus:outline-none focus:border-[#705535]"
                  >
                    <option value="non-veg">Non-Vegetarian (▲)</option>
                    <option value="veg">Vegetarian (●)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#201A15] uppercase tracking-wider text-[10px]">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3.5 py-2 text-xs text-[#201A15] focus:outline-none focus:border-[#705535]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="item-available"
                  checked={editingItem.isAvailable}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      isAvailable: e.target.checked,
                      unavailableNotice: e.target.checked
                        ? undefined
                        : 'Out of stock • Next delivery tomorrow 07:00 AM',
                    })
                  }
                  className="w-4 h-4 accent-[#705535] rounded"
                />
                <label htmlFor="item-available" className="font-bold text-xs text-[#201A15] cursor-pointer">
                  Available for In-Room Ordering
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
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

export default function AdminMenuItemsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6 text-center">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#705535] border-t-transparent animate-spin mx-auto" />
            <p className="font-serif text-[#201A15] font-bold">Loading Menu Items...</p>
          </div>
        </div>
      }
    >
      <AdminMenuItemsContent />
    </Suspense>
  );
}
