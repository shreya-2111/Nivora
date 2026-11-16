// Small helpers used by every API route.
import { NextRequest, NextResponse } from 'next/server';

// an error that becomes a normal JSON response, e.g. throw new HttpError(400, 'Invalid JSON')
export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// success response
export const ok = (data: object, status = 200) => NextResponse.json(data, { status });

// error response: fail(404, 'Room not found')   (extra = more fields like { code: 'INVALID_QR' })
export const fail = (status: number, message: string, extra: object = {}) =>
  NextResponse.json({ message, ...extra }, { status });

// "true" / true -> true, "false" / false -> false, nothing -> undefined (means: don't change)
export const toBool = (v: any) => (v === undefined || v === null ? undefined : v === true || v === 'true');

// real IP of the user (used for rate limits)
export const getIp = (req: NextRequest) => (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();

// Wrap every route with safe(): if something crashes, the user gets a clean JSON error instead of a broken page.
export function safe(handler: (req: NextRequest, ctx: any) => Promise<Response>) {
  return async (req: NextRequest, ctx: any) => {
    try {
      return await handler(req, ctx);
    } catch (err: any) {
      if (err instanceof HttpError) return fail(err.status, err.message);
      if (err.code === '22P02') return fail(400, 'Invalid id or value'); // bad uuid / number
      if (err.code === '23505') return fail(409, 'Already exists');       // duplicate value
      if (err.code === '23503') return fail(409, 'This record is used by other data');
      console.error(err);
      return fail(500, 'Something went wrong');
    }
  };
}

// Read the request body. Works for JSON and for form-data (form-data is used when uploading images).
// returns { body: normal fields, files: uploaded files }
export async function readBody(req: NextRequest): Promise<{ body: Record<string, any>; files: Record<string, File> }> {
  const type = req.headers.get('content-type') || '';
  const body: Record<string, any> = {};
  const files: Record<string, File> = {};

  if (type.includes('multipart/form-data')) {
    const form = await req.formData();
    for (const [key, value] of form.entries()) {
      if (typeof value === 'string') body[key] = value;
      else if (value.size > 0) files[key] = value;
    }
  } else if (type.includes('application/json')) {
    try {
      Object.assign(body, await req.json());
    } catch (err) {
      throw new HttpError(400, 'Invalid JSON');
    }
  }
  return { body, files };
}
