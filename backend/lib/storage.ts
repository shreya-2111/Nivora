// Image upload to Supabase Storage.
import { supabaseAdmin, BUCKET } from './supabase';
import { HttpError } from './api';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

// Upload one file and return its public URL (saved in the DB). Returns undefined if no file.
export async function saveImage(file?: File): Promise<string | undefined> {
  if (!file) return undefined;
  if (!ALLOWED.includes(file.type)) throw new HttpError(400, 'Only JPG, PNG or WEBP images are allowed');
  if (file.size > 5 * 1024 * 1024) throw new HttpError(400, 'Image must be 5 MB or smaller');

  const extension = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const fileName = Date.now() + '-' + Math.round(Math.random() * 1e9) + '.' + extension;

  const { error } = await supabaseAdmin().storage.from(BUCKET).upload(fileName, file, { contentType: file.type });
  if (error) throw new Error('Image upload failed: ' + error.message);

  return supabaseAdmin().storage.from(BUCKET).getPublicUrl(fileName).data.publicUrl;
}

// Delete an old image from Supabase Storage (ignore errors).
export async function deleteImage(url?: string | null) {
  const marker = `/${BUCKET}/`;
  if (!url || !url.includes(marker)) return;
  const fileName = url.split(marker).pop()!;
  await supabaseAdmin().storage.from(BUCKET).remove([fileName]).catch(() => {});
}
