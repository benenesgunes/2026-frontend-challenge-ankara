import { NextResponse } from 'next/server';
import { FORM_IDS } from '@/lib/api';

const API_KEY = process.env.API_KEY;
const JOTFORM_BASE = 'https://api.jotform.com';

// Whitelist of allowed form IDs
const ALLOWED_FORM_IDS: Set<string> = new Set(Object.values(FORM_IDS));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const formId = searchParams.get('formId');

  // Validate
  if (!formId) {
    return NextResponse.json(
      { error: 'Missing formId parameter' },
      { status: 400 }
    );
  }

  if (!ALLOWED_FORM_IDS.has(formId)) {
    return NextResponse.json(
      { error: 'Invalid formId' },
      { status: 403 }
    );
  }

  if (!API_KEY) {
    return NextResponse.json(
      { error: 'API_KEY not configured' },
      { status: 500 }
    );
  }

  try {
    const url = `${JOTFORM_BASE}/form/${formId}/submissions?apiKey=${API_KEY}&limit=100`;

    const res = await fetch(url, {
      next: { revalidate: 30 }, // cache for 30 seconds
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error(`[Jotform] ${res.status} for form ${formId}: ${text}`);
      return NextResponse.json(
        { error: `Jotform API returned ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[Jotform] Fetch error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch from Jotform API' },
      { status: 502 }
    );
  }
}
