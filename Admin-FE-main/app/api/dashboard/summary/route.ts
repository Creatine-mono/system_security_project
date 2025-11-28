import { NextResponse } from 'next/server';

const BASE_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET() {
  try {
    const res = await fetch(`${BASE_URL}/api/dashboard/summary`, { cache: 'no-store' });
    if (!res.ok) {
      return NextResponse.json({ error: `Summary fetch failed: ${res.status}` }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Dashboard summary fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch dashboard summary' },
      { status: 500 }
    );
  }
}
