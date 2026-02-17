import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { hasGeminiAPI } from '@/lib/env';
import dbConnect from '@/lib/dbConnect';

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
    await dbConnect();
    health.services.database = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  } catch (e) {
    health.services.database = 'error';
  }

  health.services.ai = hasGeminiAPI ? 'configured' : 'mock_mode';

  const status = health.services.database === 'connected' ? 200 : 503;

  return NextResponse.json(health, { status });
}
