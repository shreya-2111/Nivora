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
} from 'lucide-react';
import { useNivora } from '@/context/NivoraContext';
import { apiRequest } from '@/lib/api';

/* Custom SVG Icons matching the mockup */
function CroissantIcon({ className = 'w-6 h-6' }: { className?: string }) {
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
      <path d="m4.5 16.5 1-2.5a3 3 0 0 1 4-1.5l1.5.8a3 3 0 0 0 3 0l1.5-.8a3 3 0 0 1 4 1.5l1 2.5" />
      <path d="M12 4a8 8 0 0 0-8 8c0 2 1 3.5 2.5 4.5" />
      <path d="M12 4a8 8 0 0 1 8 8c0 2-1 3.5-2.5 4.5" />
      <path d="M8 8a5 5 0 0 1 8 0" />
    </svg>
  );
}

function GrillIcon({ className = 'w-6 h-6' }: { className?: string }) {
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
      <circle cx="12" cy="11" r="8" />
      <path d="M6 11h12" />
      <path d="M12 3v16" />
      <path d="m8 19-3 3" />
      <path d="m16 19 3 3" />
    </svg>
  );
}

function BurgerIcon({ className = 'w-6 h-6' }: { className?: string }) {
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
      <path d="M4 11a8 8 0 0 1 16 0H4z" />
      <path d="M5 14h14" />
      <path d="M4 17h16a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" />
    </svg>
  );
}

function SaladBowlIcon({ className = 'w-6 h-6' }: { className?: string }) {
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
      <path d="M12 3v4" />
      <path d="M9 5l3 2 3-2" />
      <path d="M4 11h16a8 8 0 0 1-16 0z" />
      <path d="M8 19h8" />
    </svg>
  );
}

function DessertCakeIcon({ className = 'w-6 h-6' }: { className?: string }) {
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
      <path d="M12 4v3" />
      <circle cx="12" cy="3" r="1" fill="currentColor" />
      <path d="M5 10h14a1 1 0 0 1 1 1v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a1 1 0 0 1 1-1z" />
      <path d="M4 15h16" />
    </svg>
  );
}

function CocktailGlassIcon({ className = 'w-6 h-6' }: { className?: string }) {
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
      <path d="m8 22 8 0" />
      <path d="M12 15v7" />
      <path d="M5 4h14l-7 11z" />
      <path d="m6.5 7h11" />
    </svg>
  );
}

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

export interface MenuCategoryItem {
  id: string;
  code: string;
  title: string;
  description: string;
  createdDate: string;
  updatedDate: string;
  isActive: boolean;
  itemCount: number;
  iconType: 'bakery' | 'grill' | 'burger' | 'salad' | 'dessert' | 'beverage';
}

function AdminMenuCategoriesContent() {
  const [isLoading, setIsLoading] = useState(true);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategoryItem | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // New Category Form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const showToast = React.useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const [categories, setCategories] = useState<MenuCategoryItem[]>([]);
  const loadCategories = React.useCallback(async () => {
    try {
      const { categories: apiCategories } = await apiRequest<{
        categories: Array<{
          id: string;
          name: string;
          description: string | null;
          sort_order: number;
          is_active: boolean;
          items: unknown[];
        }>;
      }>('/menu');
      setCategories(apiCategories.map((category) => {
        const name = category.name.toLowerCase();
        const iconType: MenuCategoryItem['iconType'] = name.includes('bakery') || name.includes('breakfast')
          ? 'bakery'
          : name.includes('grill') || name.includes('main')
          ? 'grill'
          : name.includes('sandwich') || name.includes('burger')
          ? 'burger'
          : name.includes('dessert')
          ? 'dessert'
          : name.includes('beverage') || name.includes('drink')
          ? 'beverage'
          : 'salad';
        return {
          id: category.id,
          code: `CAT-${String(category.sort_order).padStart(3, '0')}`,
          title: category.name,
          description: category.description || '',
          createdDate: '',
          updatedDate: '',
          isActive: category.is_active,
          itemCount: category.items.length,
          iconType,
        };
      }));
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to load menu categories.');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  // Total active & dish calculations
  const totalDishes = useMemo(() => categories.reduce((sum, c) => sum + c.itemCount, 0), [categories]);
  const activeCount = useMemo(() => categories.filter((c) => c.isActive).length, [categories]);

  // Reorder functions
  const saveCategoryOrder = async (reordered: MenuCategoryItem[]) => {
    try {
      await apiRequest('/menu/categories/reorder', {
        method: 'PATCH',
        body: JSON.stringify({ ids: reordered.map((category) => category.id) }),
      });
      await loadCategories();
      showToast('Category order saved.');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to save category order.');
    }
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const reordered = [...categories];
    [reordered[index - 1], reordered[index]] = [reordered[index], reordered[index - 1]];
    void saveCategoryOrder(reordered);
  };

  const moveDown = (index: number) => {
    if (index === categories.length - 1) return;
    const reordered = [...categories];
    [reordered[index + 1], reordered[index]] = [reordered[index], reordered[index + 1]];
    void saveCategoryOrder(reordered);
  };

  // Delete category
  const handleDelete = async (catId: string, title: string) => {
    if (confirm(`Delete "${title}" and all of its menu items? This cannot be undone.`)) {
      try {
        await apiRequest(`/menu/categories/${catId}`, { method: 'DELETE' });
        await loadCategories();
        showToast(`Category "${title}" removed.`);
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Unable to delete the category.');
      }
    }
  };

  // Add new category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await apiRequest('/menu/categories', {
        method: 'POST',
        body: JSON.stringify({
          name: newTitle.trim(),
          description: newDescription.trim(),
        }),
      });
      await loadCategories();
      setIsAddModalOpen(false);
      setNewTitle('');
      setNewDescription('');
      showToast(`Category "${newTitle.trim()}" created.`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to create the category.');
    }
  };

  // Save edited category
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    try {
      await apiRequest(`/menu/categories/${editingCategory.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: editingCategory.title,
          description: editingCategory.description,
          is_active: editingCategory.isActive,
        }),
      });
      await loadCategories();
      setEditingCategory(null);
      showToast(`Category "${editingCategory.title}" updated.`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to update the category.');
    }
  };

  const toggleCategoryVisibility = async (category: MenuCategoryItem) => {
    try {
      await apiRequest(`/menu/categories/${category.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ is_active: !category.isActive }),
      });
      await loadCategories();
      showToast(`"${category.title}" visibility updated.`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to update category visibility.');
    }
  };

  // Render appropriate icon
  const renderCategoryIcon = (type: MenuCategoryItem['iconType']) => {
    switch (type) {
      case 'bakery':
        return <CroissantIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#705535]" />;
      case 'grill':
        return <GrillIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#705535]" />;
      case 'burger':
        return <BurgerIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#705535]" />;
      case 'salad':
        return <SaladBowlIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#705535]" />;
      case 'dessert':
        return <DessertCakeIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#705535]" />;
      case 'beverage':
      default:
        return <CocktailGlassIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#705535]" />;
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
                href="/admin/menu"
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
        <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 w-full max-w-[1500px] mx-auto">
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
              <div className="flex items-center gap-2 border-b-2 border-[#705535] pb-1">
                <span className="w-2 h-2 rounded-full bg-[#705535]" />
                <span className="font-bold text-[#201A15]">Categories (7)</span>
              </div>

              <Link
                href="/admin/menu/items"
                className="font-semibold text-[#7A6F63] hover:text-[#201A15] transition pb-1"
              >
                Menu Items (42)
              </Link>
            </div>

            <p className="text-[11px] text-[#8A8074] font-medium">
              Screen 17 — Luxury Catalog Administration
            </p>
          </div>

          {/* Sub-Header & Main Action Buttons */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#8A8074]">
                OPERATIONS • MENU COMPENDIUM • CATEGORIES
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#201A15] tracking-tight">
                Menu Categories
              </h2>
              <p className="text-xs sm:text-sm text-[#665D52] max-w-2xl">
                Organize the hotel's food menu hierarchy, define live guest sequencing, and curate dining compendium sections.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto shrink-0">
              {/* Guest Menu Sequence Preview */}
              <Link
                href="/guest/menu"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E8E2D8] text-xs font-bold text-[#201A15] shadow-2xs hover:bg-[#FAF7F2] transition cursor-pointer active:scale-95"
              >
                <Eye className="w-4 h-4 text-[#705535]" />
                <span>Guest Menu Sequence Preview</span>
              </Link>

              {/* Add Category Button */}
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#705535] hover:bg-[#5C452A] text-white text-xs font-bold shadow-sm transition cursor-pointer active:scale-98"
              >
                <Plus className="w-4 h-4 text-white" />
                <span>+ Add Category</span>
              </button>
            </div>
          </div>

          {/* Summary Chips Row */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Chip 1 */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#EAE3D9] shadow-2xs text-[#554C42]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">CONFIGURED</span>
              <strong className="font-bold text-[#201A15]">{categories.length} Categories</strong>
            </div>

            {/* Chip 2 */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#EAE3D9] shadow-2xs text-[#554C42]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">LIVE IN APP</span>
              <strong className="font-bold text-[#201A15]">{activeCount} Active</strong>
            </div>

            {/* Chip 3 */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#EAE3D9] shadow-2xs text-[#554C42]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">ASSIGNED</span>
              <strong className="font-bold text-[#201A15]">{totalDishes} Dishes</strong>
            </div>

            {/* Chip 4: Sync status */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FDF0E2] text-[#8C5D29] border border-[#F6D7BC] text-[10px] font-bold uppercase tracking-wider">
              <RefreshCw className="w-3 h-3 text-[#8C5D29]" />
              <span>{isLoading ? 'LOADING' : 'LIVE DATA'}</span>
            </div>
          </div>

          {/* Main Categories Management Table */}
          <div className="bg-white rounded-2xl border border-[#EFE9DF] shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#F2ECE3] bg-[#FAF8F5]/60">
                    <th className="py-3.5 px-4 sm:px-6 text-[10px] font-bold uppercase tracking-wider text-[#8A8074] w-36">
                      <div className="flex items-center gap-1">
                        <span>DISPLAY SEQUENCE</span>
                        <HelpCircle className="w-3 h-3 text-[#A89F93]" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 sm:px-6 text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">
                      CATEGORY TITLE &amp; DETAILS
                    </th>
                    <th className="py-3.5 px-4 sm:px-6 text-[10px] font-bold uppercase tracking-wider text-[#8A8074] w-48">
                      GUEST VISIBILITY
                    </th>
                    <th className="py-3.5 px-4 sm:px-6 text-[10px] font-bold uppercase tracking-wider text-[#8A8074] w-28">
                      ITEMS
                    </th>
                    <th className="py-3.5 px-4 sm:px-6 text-[10px] font-bold uppercase tracking-wider text-[#8A8074] w-36 text-right">
                      MANAGEMENT
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F6F2EC] text-xs">
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-xs text-[#8A8074]">
                        {isLoading ? 'Loading categories…' : 'No menu categories have been created.'}
                      </td>
                    </tr>
                  ) : categories.map((cat, idx) => (
                    <tr
                      key={cat.id}
                      className="hover:bg-[#FAF7F2] transition group"
                    >
                      {/* 1. Display Sequence Column */}
                      <td className="py-4 px-4 sm:px-6 align-middle">
                        <div className="flex items-center gap-2">
                          {/* Drag handle dots */}
                          <GripVertical className="w-4 h-4 text-[#C2B7A8] cursor-grab active:cursor-grabbing hover:text-[#705535]" />

                          {/* Up & Down arrow buttons */}
                          <div className="flex flex-col gap-0.5">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => moveUp(idx)}
                              className="text-[#8A8074] hover:text-[#201A15] disabled:opacity-20 disabled:hover:text-[#8A8074] transition cursor-pointer"
                              title="Move up"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === categories.length - 1}
                              onClick={() => moveDown(idx)}
                              className="text-[#8A8074] hover:text-[#201A15] disabled:opacity-20 disabled:hover:text-[#8A8074] transition cursor-pointer"
                              title="Move down"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Sequence Number Badge */}
                          <span className="bg-[#FDF0E2] text-[#8C5D29] font-bold text-xs px-2.5 py-1 rounded-lg">
                            #{idx + 1}
                          </span>
                        </div>
                      </td>

                      {/* 2. Category Title & Details */}
                      <td className="py-4 px-4 sm:px-6 align-middle">
                        <div className="flex items-start gap-3.5">
                          {/* Category Square Icon Container */}
                          <div className="w-12 h-12 rounded-xl bg-[#F2EDE7] border border-[#E8E2D8] flex items-center justify-center shrink-0 text-[#705535]">
                            {renderCategoryIcon(cat.iconType)}
                          </div>

                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm sm:text-base text-[#201A15]">
                                {cat.title}
                              </h4>
                              <span className="bg-[#EAE4DC] text-[#695D50] text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider">
                                {cat.code}
                              </span>
                            </div>

                            <p className="text-xs text-[#554C42]">
                              {cat.description}
                            </p>

                            <p className="text-[11px] text-[#8A8074]">
                              Sort order: {cat.code}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* 3. Guest Visibility */}
                      <td className="py-4 px-4 sm:px-6 align-middle">
                        {cat.isActive ? (
                          <button
                            type="button"
                            onClick={() => void toggleCategoryVisibility(cat)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF5ED] text-[#2E6B44] border border-[#D0EADB] text-[10px] font-bold uppercase tracking-wider hover:opacity-80 transition cursor-pointer"
                            title="Click to toggle visibility"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2E6B44]" />
                            <span>ACTIVE IN COMPENDIUM</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => void toggleCategoryVisibility(cat)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] text-[#8A8074] border border-[#EAE3D9] text-[10px] font-bold uppercase tracking-wider hover:opacity-80 transition cursor-pointer"
                            title="Click to activate"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8A8074]" />
                            <span>HIDDEN / DRAFT</span>
                          </button>
                        )}
                      </td>

                      {/* 4. Item Count */}
                      <td className="py-4 px-4 sm:px-6 align-middle">
                        <span className="inline-block bg-[#FAF7F2] border border-[#EAE3D9] text-xs font-semibold px-3 py-1 rounded-full text-[#554C42]">
                          {cat.itemCount} items
                        </span>
                      </td>

                      {/* 5. Management Actions */}
                      <td className="py-4 px-4 sm:px-6 align-middle text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            type="button"
                            onClick={() => setEditingCategory(cat)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E8E2D8] bg-white hover:bg-[#FAF7F2] text-xs font-bold text-[#4E4438] shadow-2xs transition cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5 text-[#705535]" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(cat.id, cat.title)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E8E2D8] bg-white hover:bg-[#FAF7F2] hover:text-[#C2410C] text-xs font-bold text-[#4E4438] shadow-2xs transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom System Listener Status Strip */}
            <div className="py-3 px-4 sm:px-6 border-t border-[#F2ECE3] bg-[#FAF8F5]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7A6F63]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-[#201A15]">SYSTEM MENU VERSION V1.4</span>
                <span>•</span>
                <span>LAST CATALOG SYNC: TODAY, 12:51 PM IST</span>
                <span>•</span>
                <div className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>WEBSOCKET CATALOG LISTENER: ACTIVE</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#554C42] font-medium">
                <Monitor className="w-3.5 h-3.5 text-[#8A8074]" />
                <span>STAFF TERMINAL: #04 RESORT DESK</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="bg-[#FAF8F5] rounded-3xl max-w-lg w-full border border-[#EFE9DF] shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#EAE3D9] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#201A15]">
                Add Menu Category
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F2EDE7] flex items-center justify-center text-[#7A6F63] hover:text-[#201A15]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#201A15] uppercase tracking-wider text-[10px]">
                  Category Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Caviar &amp; Raw Bar"
                  className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 text-xs text-[#201A15] focus:outline-none focus:border-[#705535]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#201A15] uppercase tracking-wider text-[10px]">
                  Short Description for Compendium
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Summary displayed to guests on mobile menu cards..."
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
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setEditingCategory(null)}
        >
          <div
            className="bg-[#FAF8F5] rounded-3xl max-w-lg w-full border border-[#EFE9DF] shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#EAE3D9] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#201A15]">
                Edit Category: {editingCategory.code}
              </h3>
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="w-8 h-8 rounded-full bg-[#F2EDE7] flex items-center justify-center text-[#7A6F63] hover:text-[#201A15]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#201A15] uppercase tracking-wider text-[10px]">
                  Category Title
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.title}
                  onChange={(e) => setEditingCategory({ ...editingCategory, title: e.target.value })}
                  className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 text-xs text-[#201A15] focus:outline-none focus:border-[#705535]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#201A15] uppercase tracking-wider text-[10px]">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3.5 py-2 text-xs text-[#201A15] focus:outline-none focus:border-[#705535]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="cat-active"
                  checked={editingCategory.isActive}
                  onChange={(e) => setEditingCategory({ ...editingCategory, isActive: e.target.checked })}
                  className="w-4 h-4 accent-[#705535] rounded"
                />
                <label htmlFor="cat-active" className="font-bold text-xs text-[#201A15] cursor-pointer">
                  Active in Guest Compendium
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
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

export default function AdminMenuPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6 text-center">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#705535] border-t-transparent animate-spin mx-auto" />
            <p className="font-serif text-[#201A15] font-bold">Loading Menu Categories...</p>
          </div>
        </div>
      }
    >
      <AdminMenuCategoriesContent />
    </Suspense>
  );
}
