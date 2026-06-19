import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hasGeminiAPI } from '@/lib/env';

export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: 'unknown',
      ai: 'unknown',
    },
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    health.services.database = 'connected';
  } catch (e) {
    health.services.database = 'error';
  }

  health.services.ai = hasGeminiAPI ? 'configured' : 'mock_mode';

  const status = health.services.database === 'connected' ? 200 : 503;

  return NextResponse.json(health, { status });
}
