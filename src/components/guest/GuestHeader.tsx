'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Bell, ShieldCheck, DoorClosed } from 'lucide-react';
import { GuestProfile } from '@/types';

interface GuestHeaderProps {
  guest: GuestProfile;
}

export function GuestHeader({ guest }: GuestHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Monogram & Name */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 shadow-md shadow-amber-500/20">
            <Sparkles className="h-5 w-5 text-slate-950 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-lg font-bold tracking-wider text-amber-100">
                NIVORA
              </span>
              <span className="rounded-sm bg-amber-500/20 px-1 py-0.2 text-[10px] font-semibold tracking-widest text-amber-300">
                GRAND
              </span>
            </div>
            <p className="text-[11px] font-medium tracking-wide text-slate-400">
              Concierge & Room Service
            </p>
          </div>
        </div>

        {/* Room & Quick Actions */}
        <div className="flex items-center gap-2.5">
          {/* Room Pill */}
          <div className="flex items-center gap-2 rounded-full border border-amber-500/30 bg-slate-900/90 px-3.5 py-1.5 text-xs shadow-inner">
            <DoorClosed className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-semibold text-amber-200">Room {guest.roomNumber}</span>
            <span className="hidden text-slate-500 sm:inline">•</span>
            <span className="hidden text-slate-400 sm:inline text-[11px]">{guest.name}</span>
          </div>

          {/* Quick Notification or Help */}
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-300 transition-colors hover:border-slate-700 hover:text-white"
            aria-label="Concierge Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          </button>

          {/* Admin Switcher Shortcut */}
          <Link
            href="/admin"
            className="hidden items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:border-slate-700 hover:text-slate-200 md:flex"
            title="Switch to Admin Dashboard"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
