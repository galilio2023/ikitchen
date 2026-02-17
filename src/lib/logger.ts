/**
 * Structured logging utility
 * Provides consistent logging format across the application
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment: boolean;
  private minLevel: LogLevel;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.minLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.minLevel);
    const requestedLevelIndex = levels.indexOf(level);
    return requestedLevelIndex >= currentLevelIndex;
  }

  private log(level: LogLevel, message: string, context?: any): void {
    if (!this.shouldLog(level)) return;

    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      message,
      ...context,
    };

    if (this.isDevelopment) {
      // Human-readable format for development
      const color = {
        debug: '\x1b[34m', // Blue
        info: '\x1b[32m',  // Green
        warn: '\x1b[33m',  // Yellow
        error: '\x1b[31m', // Red
      }[level];
      const reset = '\x1b[0m';
      
      console.log(`${color}[${level.toUpperCase()}]${reset} ${message}`);
      if (context && Object.keys(context).length > 0) {
        console.log(JSON.stringify(context, null, 2));
      }
    } else {
      // JSON format for production (natively parsed by Datadog/CloudWatch/Vercel)
      console.log(JSON.stringify(logData));
    }
  }

  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    let errorContext = {};
    if (error instanceof Error) {
      errorContext = {
        errorName: error.name,
        errorMessage: error.message,
        stack: error.stack,
      };
    } else if (typeof error === 'object') {
      errorContext = error as object;
    }

    this.log('error', message, { ...errorContext, ...context });
  }

  /**
   * Log AI Generation events
   */
  ai(event: 'generation_start' | 'generation_success' | 'generation_failed', details: {
    model: string;
    durationMs?: number;
    tokenCount?: number;
    kitchenId?: string;
    error?: string;
  }): void {
    this.info(`AI Event: ${event}`, details);
  }

  /**
   * Log database query
   */
  db(operation: string, collection: string, durationMs?: number): void {
    this.debug('DB Operation', {
      operation,
      collection,
      durationMs,
    });
  }
}

export const logger = new Logger();
export type { LogLevel, LogContext };
