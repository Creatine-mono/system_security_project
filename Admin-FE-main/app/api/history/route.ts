import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');
  const limit = searchParams.get('limit') || '50';

  const url = new URL(`${BASE_URL}/api/history`);
  if (action) url.searchParams.set('action', action);
  url.searchParams.set('limit', limit);

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`History fetch failed: ${response.status}`);
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('History fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch history' },
      { status: 500 }
    );
  }
}
