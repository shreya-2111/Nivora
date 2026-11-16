import { NextRequest } from 'next/server';
import { pool } from '@/lib/db';
import { safe, ok, fail, readBody, toBool } from '@/lib/api';
import { getStaff } from '@/lib/auth';
import { getHotel, formatHotel } from '@/lib/hotel';
import { saveImage, deleteImage } from '@/lib/storage';

export const dynamic = 'force-dynamic';

// GET /api/hotel   (public)
export const GET = safe(async () => {
  return ok({ hotel: formatHotel(await getHotel()) });
});

// PATCH /api/hotel   (staff) - JSON, or form-data with files "logo" and "cover_image"
// Only the fields you send are changed (COALESCE keeps the old value when we pass null).
export const PATCH = safe(async (req: NextRequest) => {
  if (!(await getStaff(req))) return fail(401, 'Please login first');

  const { body, files } = await readBody(req);
  const modules = typeof body.modules === 'object' && body.modules ? body.modules : {};
  const old = await getHotel();

  const color = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
  if (body.primary_color && !color.test(body.primary_color)) return fail(400, 'primary_color must be like #1F2937');
  if (body.secondary_color && !color.test(body.secondary_color)) return fail(400, 'secondary_color must be like #C9A24D');
  if (body.hotel_name !== undefined && !String(body.hotel_name).trim()) return fail(400, 'hotel_name cannot be empty');

  // new files go to Supabase Storage; we get back their public URLs
  const logo = files.logo ? await saveImage(files.logo) : body.logo_url;
  const cover = files.cover_image ? await saveImage(files.cover_image) : body.cover_image_url;

  const result = await pool.query(
    `UPDATE hotel_settings SET
       hotel_name = COALESCE($1, hotel_name),
       logo_url = COALESCE($2, logo_url),
       cover_image_url = COALESCE($3, cover_image_url),
       welcome_message = COALESCE($4, welcome_message),
       primary_color = COALESCE($5, primary_color),
       secondary_color = COALESCE($6, secondary_color),
       phone = COALESCE($7, phone),
       whatsapp = COALESCE($8, whatsapp),
       address = COALESCE($9, address),
       module_food_ordering = COALESCE($10, module_food_ordering),
       module_room_service = COALESCE($11, module_room_service),
       module_contact_reception = COALESCE($12, module_contact_reception),
       module_hotel_information = COALESCE($13, module_hotel_information),
       updated_at = NOW()
     WHERE id = $14 RETURNING *`,
    [
      body.hotel_name ?? null, logo ?? null, cover ?? null, body.welcome_message ?? null,
      body.primary_color ?? null, body.secondary_color ?? null,
      body.phone ?? null, body.whatsapp ?? null, body.address ?? null,
      toBool(body.module_food_ordering ?? modules.food_ordering) ?? null,
      toBool(body.module_room_service ?? modules.room_service) ?? null,
      toBool(body.module_contact_reception ?? modules.contact_reception) ?? null,
      toBool(body.module_hotel_information ?? modules.hotel_information) ?? null,
      old.id,
    ]
  );

  // remove replaced images from Storage
  if (logo && old.logo_url !== logo) await deleteImage(old.logo_url);
  if (cover && old.cover_image_url !== cover) await deleteImage(old.cover_image_url);

  return ok({ hotel: formatHotel(result.rows[0]) });
});
