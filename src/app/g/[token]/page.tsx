'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useNivora } from '@/context/NivoraContext';

export default function GuestQrEntryPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { initializeGuest } = useNivora();
  const startedToken = useRef<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || startedToken.current === token) return;
    startedToken.current = token;

    void initializeGuest(token)
      .then(() => {
        const roomNumber = window.sessionStorage.getItem('nivora.guest-room') || '';
        router.replace(`/guest?room=${encodeURIComponent(roomNumber)}`);
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : 'Unable to open this room QR code.');
      });
  }, [initializeGuest, router, token]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FAF8F5] px-6 text-center">
      <div className="max-w-md space-y-3">
        <h1 className="font-serif text-2xl font-bold text-[#201A15]">Nivora Guest Services</h1>
        {error ? (
          <p role="alert" className="text-sm text-rose-700">{error}</p>
        ) : (
          <>
            <div className="mx-auto h-7 w-7 rounded-full border-2 border-[#705535] border-t-transparent animate-spin" />
            <p className="text-sm text-[#665D52]">Connecting to your room...</p>
          </>
        )}
      </div>
    </main>
  );
}
