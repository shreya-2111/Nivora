'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home } from 'lucide-react';

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

interface BottomNavProps {
  activeOrderCount?: number;
}

export function BottomNav({ activeOrderCount = 0 }: BottomNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Home',
      href: '/guest',
      icon: Home,
      isActive: pathname === '/' || pathname === '/guest',
    },
    {
      label: 'Orders',
      href: '/guest/orders',
      icon: ClocheIcon,
      isActive: pathname.startsWith('/guest/orders'),
      badge: activeOrderCount > 0 ? activeOrderCount : undefined,
    },
    {
      label: 'Room Service',
      href: '/guest/services',
      icon: ConciergeHandBellIcon,
      isActive: pathname.startsWith('/guest/services'),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAE3D8] shadow-lg">
      <div className="w-full max-w-5xl mx-auto flex h-16 items-center justify-around px-4 sm:px-8">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative flex flex-col items-center justify-center gap-1 text-xs transition-colors ${
                item.isActive
                  ? 'font-bold text-[#705535]'
                  : 'font-medium text-[#7C7164] hover:text-[#231E18]'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`h-5 w-5 ${
                    item.isActive ? 'text-[#705535] stroke-[2.2]' : 'text-[#7C7164]'
                  }`}
                />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#705535] text-[9px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
