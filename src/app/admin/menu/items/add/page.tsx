'use client';

import React, { Suspense } from 'react';
import AdminEditFoodItemPage from '@/app/admin/menu/items/edit/page';

export default function AdminAddFoodItemPage() {
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
      <AdminEditFoodItemPage />
    </Suspense>
  );
}
