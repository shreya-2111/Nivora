import crypto from 'crypto';
import QRCode from 'qrcode';

// random, unguessable token (no room number inside it)
export const makeToken = () => crypto.randomBytes(24).toString('base64url');

// the link that the QR code opens
export const guestLink = (token: string) => `${(process.env.GUEST_BASE_URL || '').replace(/\/$/, '')}/g/${token}`;

export const SELECT_QR = 'SELECT q.*, r.room_number FROM qr_codes q JOIN rooms r ON r.id = q.room_id';

// QR row + room info + link (+ QR picture if withImage is true)
export async function formatQr(row: any, withImage: boolean) {
  const qr: any = {
    id: row.id,
    room_id: row.room_id,
    room_number: row.room_number,
    token: row.token,
    url: guestLink(row.token),
    is_active: row.is_active,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
  if (withImage) qr.qr_image = await QRCode.toDataURL(qr.url, { width: 600, margin: 2 }); // base64 PNG
  return qr;
}
