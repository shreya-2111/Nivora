// Shared types (kept small on purpose)

// logged-in hotel staff (row of admin_users)
export interface Staff {
  id: string;
  email: string;
  name: string;
  role: string;
}

// guest session (created from a QR scan)
export interface Guest {
  roomId: string;
  issuedAt: number; // when the guest session started (ms)
}

export type OrderStatus = 'NEW' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'REJECTED' | 'CANCELLED';
export type RequestStatus = 'NEW' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
