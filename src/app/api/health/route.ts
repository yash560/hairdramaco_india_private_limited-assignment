import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'Hairdrama FlowOS Edge Gateway',
    timestamp: new Date().toISOString(),
    stack: {
      frontend: 'Next.js 15 App Router & React 19',
      backend: 'Flask (Python 3) & Next.js Serverless Microservices',
      database: 'Supabase (PostgreSQL)',
      email: 'Gmail SMTP Integration',
      auth: 'Google OAuth 2.0'
    }
  });
}
