import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';

/**
 * Health check endpoint
 * Used by load balancers, monitoring tools, and uptime services
 */
export async function GET() {
  const startTime = Date.now();
  
  try {
    // Check database connectivity
    await dbConnect();
    
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        responseTime: `${responseTime}ms`,
        environment: process.env.NODE_ENV,
        services: {
          database: 'connected',
          api: 'operational',
        },
      },
      { status: 200 }
    );
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        responseTime: `${responseTime}ms`,
        environment: process.env.NODE_ENV,
        services: {
          database: 'disconnected',
          api: 'degraded',
        },
        error: errorMessage,
      },
      { status: 503 }
    );
  }
}

/**
 * Readiness check - more strict than health check
 * Returns 200 only when the service is ready to accept traffic
 */
export async function HEAD() {
  try {
    await dbConnect();
    return new NextResponse(null, { status: 200 });
  } catch {
    return new NextResponse(null, { status: 503 });
  }
}
