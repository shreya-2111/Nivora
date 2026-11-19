'use client';

import React, { useEffect, useRef, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
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
  ShieldCheck,
  Lock,
  Camera,
  Trash2,
  Plus,
  GripVertical,
  Pencil,
  Smartphone,
  Eye,
  Check,
  Info,
  Save,
  RotateCcw,
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

interface DishOption {
  id: string;
  title: string;
  priceDelta: number; // 0 for included
  isActive: boolean;
}

function AdminEditFoodItemContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemId = searchParams.get('id');
  const isNew = !itemId;
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isVeg, setIsVeg] = useState(true);
  const [photoUrl, setPhotoUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [options, setOptions] = useState<DishOption[]>([]);

  // Inline option creator state
  const [newOptionTitle, setNewOptionTitle] = useState('');
  const [newOptionPrice, setNewOptionPrice] = useState<number>(0);

  // Feedback toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    let active = true;
    const loadItem = async () => {
      try {
        const { categories: menuCategories } = await apiRequest<{
          categories: Array<{
            id: string;
            name: string;
            items: Array<{
              id: string;
              name: string;
              description: string | null;
              price: number;
              image_url: string | null;
              is_vegetarian: boolean;
              is_available: boolean;
              options: Array<{ id: string; name: string; price: number; is_active: boolean }>;
            }>;
          }>;
        }>('/menu');
        if (!active) return;

        setCategories(menuCategories.map(({ id, name }) => ({ id, name })));
        if (isNew) {
          setCategory(menuCategories[0]?.id || '');
          return;
        }

        const menuItem = menuCategories
          .flatMap((menuCategory) => menuCategory.items.map((item) => ({
            ...item,
            categoryId: menuCategory.id,
          })))
          .find((item) => item.id === itemId);
        if (!menuItem) {
          setLoadError('Menu item not found.');
          return;
        }

        setFoodName(menuItem.name);
        setCategory(menuItem.categoryId);
        setDescription(menuItem.description || '');
        setPrice(Number(menuItem.price));
        setPhotoUrl(menuItem.image_url || '');
        setIsVeg(menuItem.is_vegetarian);
        setIsAvailable(menuItem.is_available);
        setOptions(menuItem.options.map((option) => ({
          id: option.id,
          title: option.name,
          priceDelta: Number(option.price),
          isActive: option.is_active,
        })));
      } catch (error) {
        if (active) {
          setLoadError(error instanceof Error ? error.message : 'Unable to load menu item.');
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void loadItem();
    return () => {
      active = false;
    };
  }, [isNew, itemId]);

  useEffect(() => {
    if (!imageFile || !photoUrl.startsWith('blob:')) return;
    return () => URL.revokeObjectURL(photoUrl);
  }, [imageFile, photoUrl]);

  // Add Option handler
  const handleAppendOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOptionTitle.trim()) return;

    const opt: DishOption = {
      id: `opt_${Date.now()}`,
      title: newOptionTitle.trim(),
      priceDelta: Number(newOptionPrice) || 0,
      isActive: true,
    };

    setOptions((prev) => [...prev, opt]);
    setNewOptionTitle('');
    setNewOptionPrice(0);
    showToast(`Added option "${opt.title}"`);
  };

  // Remove option
  const handleRemoveOption = (id: string, title: string) => {
    setOptions((prev) => prev.filter((o) => o.id !== id));
    showToast(`Removed option "${title}"`);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) {
      showToast('Create a menu category before saving an item.');
      return;
    }

    const fields = {
      category_id: category,
      name: foodName.trim(),
      description: description.trim(),
      price,
      is_vegetarian: isVeg,
      is_available: isAvailable,
      options: options.map((option) => ({
        name: option.title,
        price: option.priceDelta,
        is_active: option.isActive,
      })),
    };
    const body = imageFile ? new FormData() : null;
    if (body) {
      Object.entries(fields).forEach(([key, value]) => {
        body.append(key, key === 'options' ? JSON.stringify(value) : String(value));
      });
      if (imageFile) body.append('image', imageFile);
    }

    try {
      await apiRequest(isNew ? '/menu/items' : `/menu/items/${itemId}`, {
        method: isNew ? 'POST' : 'PATCH',
        body: body || JSON.stringify({
          ...fields,
          image_url: photoUrl || undefined,
        }),
      });
      showToast(`${isNew ? 'Added' : 'Saved'} "${foodName.trim()}" to the menu.`);
      router.push('/admin/menu/items');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to save the menu item.');
    }
  };

  const handleDelete = async () => {
    if (!itemId || !confirm(`Permanently delete "${foodName}" from the menu?`)) return;
    try {
      await apiRequest(`/menu/items/${itemId}`, { method: 'DELETE' });
      showToast(`Deleted "${foodName}" from the menu.`);
      router.push('/admin/menu/items');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to delete the menu item.');
    }
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Choose an image file.');
      event.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be 5 MB or smaller.');
      event.target.value = '';
      return;
    }
    setImageFile(file);
    setPhotoUrl(URL.createObjectURL(file));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-xs text-[#7A6F63]">
        Loading menu item…
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center gap-4 text-sm text-[#7A6F63]">
        <p>{loadError}</p>
        <Link href="/admin/menu/items" className="text-[#705535] font-bold hover:underline">
          Back to menu items
        </Link>
      </div>
    );
  }

  const previewImage = photoUrl || '/overwater-dish.jpg';
  const categoryName = categories.find((menuCategory) => menuCategory.id === category)?.name || '';

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
        <div className="flex-1 min-w-0 p-5 sm:p-8 lg:p-10 space-y-6 max-w-[1500px] mx-auto w-full">
          {/* Top Breadcrumb & Actions Bar */}
          <div className="flex items-center justify-between">
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-[#7A6F63]">
              <span className="uppercase tracking-wider text-[11px] font-semibold">OPERATIONS</span>
              <span className="text-[#C2B7A8]">/</span>
              <Link href="/admin/menu" className="hover:text-[#201A15] transition">
                MENU
              </Link>
              <span className="text-[#C2B7A8]">/</span>
              <Link href="/admin/menu/items" className="hover:text-[#201A15] transition">
                Categories Management
              </Link>
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

          {/* Action Row Under Breadcrumbs */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/menu/items"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F2EDE7] border border-[#E8E2D8] text-xs font-bold text-[#443D35] hover:bg-[#EAE4DC] transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Menu Items</span>
            </Link>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#EAE3D9] text-xs font-mono font-bold text-[#4E4438] shadow-2xs">
              <span>ITEM ID: {itemId || 'NEW'}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FDF0E2] border border-[#F6D7BC] text-xs font-bold text-[#8C5D29] shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C27E43]" />
              <span>{isNew ? 'New Item' : 'Live in Compendium'}</span>
            </div>
          </div>

          {/* Snapshot Protection Protocol Active Alert Banner */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EFE9DF] shadow-2xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-[#705535] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#705535]" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-bold text-sm text-[#201A15]">
                  Snapshot Protection Protocol Active
                </h4>
                <span className="bg-[#EAE4DC] text-[#695D50] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  IMMUTABLE ORDER HISTORY
                </span>
              </div>

              <p className="text-xs text-[#554C42] leading-relaxed">
                Editing food name, culinary description, or price updates guest-facing compendium instantly. Historical or in-preparation orders (e.g., ROOM • Ticket #NV-4) preserve their locked timestamp snapshots and remain unaffected.
              </p>
            </div>
          </div>

          {/* Form Header & Record Mode */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A8074]">
                CATERING &amp; IN-ROOM DINING • COMPENDIUM CONFIGURATION
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#201A15] tracking-tight">
                {isNew ? 'Add Food Item' : 'Edit Food Item'}
              </h2>
              <p className="text-xs sm:text-sm text-[#665D52]">
                Configure operational details, pricing, culinary descriptors, and add-on selections visible to resort guests.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#F2EDE7] border border-[#E5DFD5] text-xs font-bold text-[#554C42] shadow-2xs self-start sm:self-auto">
              <span>Record Mode:</span>
              <span className="bg-[#85653C] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                {isNew ? 'CREATE NEW' : 'EDIT EXISTING'}
              </span>
            </div>
          </div>

          {/* Two-Column Main Content Form */}
          <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (Span 7): Specifications, Pricing, Options */}
            <div className="lg:col-span-7 space-y-6">
              {/* Card 1: Primary Culinary Specifications */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EFE9DF] shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#F2ECE3] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#EAE3D9] flex items-center justify-center text-[#705535]">
                      <UtensilsCrossed className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#201A15]">
                        Primary Culinary Specifications
                      </h3>
                      <p className="text-[11px] text-[#8A8074]">
                        Core item taxonomy and guest billing parameters.
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8074]">
                    STEP 1 OF 2
                  </span>
                </div>

                {/* Food Name Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-[10px] uppercase tracking-wider text-[#201A15]">
                      FOOD NAME <span className="text-red-600">*</span>
                    </label>
                    <span className="text-[10px] text-[#8A8074]">{foodName.length} / 60 Chars</span>
                  </div>

                  <input
                    type="text"
                    required
                    maxLength={60}
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    placeholder="e.g. Artisanal Wagyu Burger"
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-4 py-3 text-sm font-semibold text-[#201A15] focus:outline-none focus:border-[#705535] transition"
                  />
                </div>

                {/* Compendium Category Dropdown */}
                <div className="space-y-1.5">
                  <label className="font-bold text-[10px] uppercase tracking-wider text-[#201A15]">
                    COMPENDIUM CATEGORY <span className="text-red-600">*</span>
                  </label>

                  <select
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-4 py-3 text-xs font-bold text-[#201A15] focus:outline-none focus:border-[#705535] transition cursor-pointer"
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map((menuCategory) => (
                      <option key={menuCategory.id} value={menuCategory.id}>
                        {menuCategory.name}
                      </option>
                    ))}
                  </select>

                  <p className="text-[11px] text-[#8A8074]">
                    Belongs to Screen 17 menu structure. Determines tablet section placement.
                  </p>
                </div>

                {/* Culinary Description */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-[10px] uppercase tracking-wider text-[#201A15]">
                      CULINARY DESCRIPTION <span className="text-red-600">*</span>
                    </label>
                    <span className="text-[10px] text-[#8A8074]">{description.length} / 240 Chars</span>
                  </div>

                  <textarea
                    rows={3}
                    required
                    maxLength={240}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Sensory description for guest compendium..."
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-4 py-3 text-xs text-[#201A15] leading-relaxed focus:outline-none focus:border-[#705535] transition"
                  />

                  <p className="text-[11px] text-[#8A8074]">
                    Detailed sensory description curated for discerning in-room guests.
                  </p>
                </div>

                {/* Price and Kitchen Availability Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* Price */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-[10px] uppercase tracking-wider text-[#201A15]">
                        PRICE (INR) <span className="text-red-600">*</span>
                      </label>
                      <span className="bg-[#FDF0E2] text-[#8C5D29] text-[9px] font-bold px-2 py-0.5 rounded">
                        Valid INR Format
                      </span>
                    </div>

                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-serif text-sm font-bold text-[#705535]">
                        ₹
                      </span>
                      <input
                        type="number"
                        required
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl pl-8 pr-4 py-2.5 text-sm font-bold text-[#201A15] focus:outline-none focus:border-[#705535]"
                      />
                    </div>

                    <p className="text-[10px] text-[#8A8074]">
                      Price in INR, inclusive of luxury in-room staging.
                    </p>
                  </div>

                  {/* Kitchen Availability Toggle */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-[10px] uppercase tracking-wider text-[#201A15]">
                      KITCHEN AVAILABILITY <span className="text-red-600">*</span>
                    </label>

                    <div className="bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl p-1 flex items-center gap-1 text-xs">
                      <button
                        type="button"
                        onClick={() => setIsAvailable(true)}
                        className={`flex-1 py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          isAvailable
                            ? 'bg-white text-[#201A15] shadow-xs'
                            : 'text-[#8A8074] hover:text-[#201A15]'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        <span>Available</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsAvailable(false)}
                        className={`flex-1 py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          !isAvailable
                            ? 'bg-white text-[#C2410C] shadow-xs'
                            : 'text-[#8A8074] hover:text-[#C2410C]'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C]" />
                        <span>86'd / Hidden</span>
                      </button>
                    </div>

                    <p className="text-[10px] text-[#8A8074]">
                      Guests can place instant compendium orders.
                    </p>
                  </div>
                </div>

                {/* Dietary Designation */}
                <div className="space-y-2 pt-1">
                  <label className="font-bold text-[10px] uppercase tracking-wider text-[#201A15]">
                    DIETARY DESIGNATION
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Vegetarian Card */}
                    <button
                      type="button"
                      onClick={() => setIsVeg(true)}
                      className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
                        isVeg
                          ? 'bg-[#EAE4DC] border-[#705535] shadow-xs'
                          : 'bg-[#FAF7F2] border-[#EAE3D9] hover:bg-[#F4EFEB]'
                      }`}
                    >
                      <div className="w-6 h-6 rounded bg-white border border-[#E5DFD5] flex items-center justify-center shrink-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-[#201A15]">Vegetarian</p>
                        <p className="text-[10px] text-[#7A6F63]">Pure green hallmark</p>
                      </div>
                    </button>

                    {/* Non-Vegetarian Card */}
                    <button
                      type="button"
                      onClick={() => setIsVeg(false)}
                      className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
                        !isVeg
                          ? 'bg-[#EAE4DC] border-[#705535] shadow-xs'
                          : 'bg-[#FAF7F2] border-[#EAE3D9] hover:bg-[#F4EFEB]'
                      }`}
                    >
                      <div className="w-6 h-6 rounded bg-white border border-[#E5DFD5] flex items-center justify-center shrink-0">
                        <span className="text-[10px] text-[#8C5D29]">▲</span>
                      </div>
                      <div>
                        <p className="font-bold text-xs text-[#201A15]">Non-Vegetarian</p>
                        <p className="text-[10px] text-[#7A6F63]">Contains prime cuts</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 2: Options & Add-ons */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EFE9DF] shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#F2ECE3] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#EAE3D9] flex items-center justify-center text-[#705535]">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#201A15]">
                        Options &amp; Add-ons
                      </h3>
                      <p className="text-[11px] text-[#8A8074]">
                        Configure guest choices (temperatures, bun selections, artisanal sides).
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const optName = prompt('Enter option title:');
                      if (optName) {
                        setOptions((prev) => [
                          ...prev,
                          {
                            id: `opt_${Date.now()}`,
                            title: optName,
                            priceDelta: 0,
                            isActive: true,
                          },
                        ]);
                        showToast(`Added option "${optName}"`);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E8E2D8] text-xs font-bold text-[#201A15] hover:bg-[#FAF7F2] transition cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#705535]" />
                    <span>Add Option</span>
                  </button>
                </div>

                {/* Option List */}
                <div className="space-y-2.5">
                  {options.map((opt) => (
                    <div
                      key={opt.id}
                      className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#ECE5DB] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-4 h-4 text-[#C2B7A8] cursor-grab hover:text-[#705535]" />
                        <div>
                          <p className="font-bold text-[#201A15]">{opt.title}</p>
                          {!opt.isActive && <p className="text-[11px] text-[#7A6F63]">Unavailable to guests</p>}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {opt.priceDelta === 0 ? (
                          <span className="text-xs font-bold text-[#8A8074]">Included / ₹0</span>
                        ) : (
                          <span className="bg-[#FDF0E2] text-[#8C5D29] text-xs font-bold px-2.5 py-0.5 rounded-md">
                            + ₹{opt.priceDelta}
                          </span>
                        )}

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              const newT = prompt('Edit option title:', opt.title);
                              if (newT) {
                                setOptions((prev) =>
                                  prev.map((o) => (o.id === opt.id ? { ...o, title: newT } : o))
                                );
                              }
                            }}
                            className="p-1 text-[#8A8074] hover:text-[#201A15] transition cursor-pointer"
                            title="Edit option"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveOption(opt.id, opt.title)}
                            className="p-1 text-[#8A8074] hover:text-[#C2410C] transition cursor-pointer"
                            title="Delete option"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Inline Option Creator */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#8A8074] pb-1.5">
                    <span>INLINE OPTION CREATOR</span>
                    <span className="font-mono text-[#8C5D29]">Quick Add to menu_item_options</span>
                  </div>

                  <div className="bg-[#FAF7F2] border border-[#ECE5DB] rounded-xl p-2.5 flex flex-col sm:flex-row items-center gap-2">
                    <input
                      type="text"
                      value={newOptionTitle}
                      onChange={(e) => setNewOptionTitle(e.target.value)}
                      placeholder="Option title (e.g., Rosemary Fries Upgrade)"
                      className="flex-1 w-full bg-white border border-[#EAE3D9] rounded-lg px-3 py-1.5 text-xs text-[#201A15] focus:outline-none focus:border-[#705535]"
                    />

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="relative w-24">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#705535]">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={newOptionPrice}
                          onChange={(e) => setNewOptionPrice(Number(e.target.value))}
                          placeholder="0"
                          className="w-full bg-white border border-[#EAE3D9] rounded-lg pl-6 pr-2 py-1.5 text-xs font-bold text-[#201A15] focus:outline-none focus:border-[#705535]"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleAppendOption}
                        className="px-4 py-1.5 rounded-lg bg-[#705535] hover:bg-[#5C452A] text-white text-xs font-bold shadow-xs transition cursor-pointer shrink-0"
                      >
                        Append
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (Span 5): Photography, Live Mirror Preview, Actions */}
            <div className="lg:col-span-5 space-y-6">
              {/* Card 3: Food Photography */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EFE9DF] shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#F2ECE3] pb-3">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#705535]" />
                    <div>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#201A15]">
                        Food Photography
                      </h3>
                      <p className="text-[11px] text-[#8A8074]">
                        Editorial imagery for guest tablet display.
                      </p>
                    </div>
                  </div>

                  <span className="bg-[#EAE4DC] text-[#695D50] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    16:9 RATIO
                  </span>
                </div>

                {/* Big Photo Preview */}
                <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-[#F2EDE7] border border-[#E8E2D8] group">
                  <Image
                    src={previewImage}
                    alt={foodName || 'Dish preview'}
                    fill
                    unoptimized
                    className="object-cover"
                  />

                  {/* Overlays */}
                  <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono font-medium px-2.5 py-1 rounded-md">
                    📷 1200 × 750px • JPG
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 bg-[#85653C] text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-wider uppercase shadow-xs">
                    ACTIVE ASSET
                  </div>
                </div>

                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#E8E2D8] bg-white text-xs font-bold text-[#201A15] hover:bg-[#FAF7F2] transition cursor-pointer shadow-2xs active:scale-98"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#705535]" />
                    <span>Replace Photo</span>
                  </button>

                </div>

                <p className="text-[10px] text-[#7A6F63] leading-relaxed">
                  Recommended: 1200×800px JPG/PNG, max 5MB. Clean editorial culinary photography adhering to Nivora aesthetic standard.
                </p>
              </div>

              {/* Card 4: Guest Compendium Preview (Real-time Mirror) */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EFE9DF] shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#F2ECE3] pb-3">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#705535]" />
                    <div>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#201A15]">
                        Guest Compendium Preview
                      </h3>
                      <p className="text-[11px] text-[#8A8074]">
                        Real-time rendering in ROOM Tablet UI.
                      </p>
                    </div>
                  </div>

                  <span className="bg-[#FDF0E2] text-[#8C5D29] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    1:1 MIRROR
                  </span>
                </div>

                {/* Simulated In-Room Tablet Card */}
                <div className="bg-[#FAF8F5] border border-[#EAE3D9] rounded-2xl p-4 shadow-xs space-y-3">
                  <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-[#8A8074]">
                    <span>{categoryName.toUpperCase()}</span>
                    <span>GUEST VIEW</span>
                  </div>

                  {/* Image with badges */}
                  <div className="relative w-full h-40 rounded-xl overflow-hidden bg-[#F2EDE7] border border-[#E5DFD5]">
                    <Image
                      src={previewImage}
                      alt="Guest view"
                      fill
                      unoptimized
                      className="object-cover"
                    />

                    {/* Non-veg icon badge */}
                    <div className="absolute top-2.5 left-2.5 w-6 h-6 rounded bg-white/90 backdrop-blur-xs flex items-center justify-center border border-[#E5DFD5]">
                      {isVeg ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
                      ) : (
                        <span className="text-[9px] text-[#8C5D29]">▲</span>
                      )}
                    </div>

                    {/* Chef Special Badge */}
                    <div className="absolute top-2.5 left-10 bg-black/75 backdrop-blur-xs text-[#EAE2D8] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      CHEF SPECIAL
                    </div>
                  </div>

                  {/* Title & Price */}
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="font-serif text-base font-bold text-[#201A15] leading-tight">
                      {foodName || 'Dish Title'}
                    </h4>
                    <span className="font-serif text-base font-bold text-[#705535] shrink-0">
                      ₹{price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <p className="text-xs text-[#665D52] line-clamp-2 leading-relaxed">
                    {description || 'Culinary preparation details...'}
                  </p>

                  <div className="pt-1 flex items-center justify-between border-t border-[#EAE3D9]/60">
                    <span className="text-[11px] text-[#7A6F63]">Customizable Sides Available</span>
                    <button
                      type="button"
                      className="px-3 py-1 rounded-lg bg-[#705535] text-white text-xs font-bold shadow-2xs"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-[#8A8074]">
                  <Info className="w-3.5 h-3.5 text-[#8A8074] shrink-0" />
                  <span>Preview reflects layout on iOS and Android guest tablets instantly upon keystroke.</span>
                </div>
              </div>

              {/* Card 5: Operational Actions & Save Controls */}
              <div className="bg-white rounded-2xl p-5 border border-[#EFE9DF] shadow-2xs space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-[#8A8074]">
                    OPERATIONAL ACTIONS
                  </span>
                  <span className="text-[11px] text-[#7A6F63]">Draft changes unsaved</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-5 rounded-xl bg-[#705535] hover:bg-[#5C452A] text-white text-xs font-bold shadow-md transition cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Food Item</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push('/admin/menu/items')}
                    className="py-3 px-6 rounded-xl border border-[#E8E2D8] bg-white text-xs font-bold text-[#5A5046] hover:bg-[#FAF7F2] transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                {/* Archive link & timestamp */}
                <div className="pt-2 border-t border-[#F2ECE3] flex items-center justify-between text-xs">
                  {!isNew && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="text-[#C2410C] font-bold hover:underline inline-flex items-center gap-1.5 cursor-pointer text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete from Menu Database</span>
                    </button>
                  )}

                  <span className="text-[11px] text-[#8A8074]">
                    Last edited: Today, 14:28
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

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

export default function AdminEditFoodItemPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6 text-center">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#705535] border-t-transparent animate-spin mx-auto" />
            <p className="font-serif text-[#201A15] font-bold">Loading Food Item Configuration...</p>
          </div>
        </div>
      }
    >
      <AdminEditFoodItemContent />
    </Suspense>
  );
}
