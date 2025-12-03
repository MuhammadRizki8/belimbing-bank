import { NextResponse } from 'next/server';

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return { name: error.name, message: error.message };
  }

  // If it's a plain object or primitive, return as-is (JSON-serializable)
  return error;
}

export function successResponse<T = unknown>(data: T, message: string = 'Success', status: number = 200) {
  return NextResponse.json({ success: true, message, data }, { status });
}

export function errorResponse(message: string, status: number = 500, error?: unknown) {
  const payload: { success: false; message: string; error?: unknown } = { success: false, message };
  if (typeof error !== 'undefined') payload.error = serializeError(error);
  return NextResponse.json(payload, { status });
}

export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  try {
    return String(err ?? 'Unknown error');
  } catch {
    return 'Unknown error';
  }
}
