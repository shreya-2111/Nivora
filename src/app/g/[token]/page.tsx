'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { guestService } from '@/services/guestService';
import { ApiError } from '@/lib/apiClient';
import { AlertCircle, CheckCircle2, Loader2, QrCode } from 'lucide-react';
import Link from 'next/link';

export default function GuestQrResolvePage() {
  const params = useParams();
  const router = useRouter();
  const token = typeof params?.token === 'string' ? params.token : '';

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roomInfo, setRoomInfo] = useState<{ room_number: string; floor: number | null } | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Invalid QR token. Please scan the QR code on your room plaque.');
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function resolveToken() {
      try {
        const data = await guestService.resolveGuestToken(token);
        if (!isMounted) return;

        setRoomInfo(data.room);
        setIsLoading(false);

        // Seamless transition into the guest compendium after resolving
        setTimeout(() => {
          router.push(`/guest?room=${encodeURIComponent(data.room.room_number)}`);
        }, 1200);
      } catch (err: any) {
        if (!isMounted) return;
        setIsLoading(false);
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Unable to authenticate room session. Please contact the front desk concierge.');
        }
      }
    }

    resolveToken();

    return () => {
      isMounted = false;
    };
  }, [token, router]);

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] text-[#221B14] flex flex-col items-center justify-center p-6 selection:bg-[#705535]/20 selection:text-[#221B14]">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#EFE9DF] shadow-[0_16px_50px_rgba(0,0,0,0.06)] text-center space-y-6">
        {/* Brand Monogram */}
        <div className="w-12 h-12 rounded-full bg-[#705535] text-white flex items-center justify-center font-serif text-xl font-bold mx-auto shadow-xs">
          N
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#85653C]">
            NIVORA LUXURY RESORTS
          </p>
          <h1 className="font-serif text-2xl font-bold text-[#201A15]">
            Guest Room Authentication
          </h1>
        </div>

        {isLoading && (
          <div className="py-8 space-y-4">
            <Loader2 className="w-8 h-8 text-[#705535] animate-spin mx-auto" />
            <p className="text-xs text-[#7A6F63]">
              Verifying encrypted room plaque credentials...
            </p>
          </div>
        )}

        {!isLoading && roomInfo && (
          <div className="py-6 space-y-3 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="font-serif text-xl font-bold text-[#201A15]">
              Welcome to Room {roomInfo.room_number}
            </p>
            <p className="text-xs text-[#7A6F63]">
              Session authenticated. Redirecting to your personal compendium...
            </p>
          </div>
        )}

        {!isLoading && error && (
          <div className="py-6 space-y-4 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="font-serif text-lg font-bold text-[#201A15]">
                Authentication Notice
              </p>
              <p className="text-xs text-rose-600 font-medium">
                {error}
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/guest"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#705535] text-white text-xs font-bold shadow-xs hover:bg-[#5C452A] transition"
              >
                Continue to Guest Portal
              </Link>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-[#EFE9DF] text-[10px] text-[#A89F93] uppercase tracking-wider">
          AES-256 Room Cryptographic Verification
        </div>
      </div>
    </div>
  );
}
