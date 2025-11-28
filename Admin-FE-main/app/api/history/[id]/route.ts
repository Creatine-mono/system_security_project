import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const response = await fetch(`${BASE_URL}/api/history/${id}`);
    if (!response.ok) {
      return NextResponse.json(
        { error: `History ${id} not found` },
        { status: response.status }
      );
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('History detail error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch history detail' },
      { status: 500 }
    );
  }
}
