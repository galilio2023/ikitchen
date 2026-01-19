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

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: LogContext
  ): string {
    const timestamp = new Date().toISOString();
    
    if (this.isDevelopment) {
      // Human-readable format for development
      const contextStr = context ? `\n${JSON.stringify(context, null, 2)}` : '';
      return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`;
    }
    
    // JSON format for production (easier to parse by log aggregators)
    const logObject = {
      timestamp,
      level,
      message,
      ...context,
    };
    
    return JSON.stringify(logObject);
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, message, context);

    switch (level) {
      case 'debug':
      case 'info':
        console.log(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'error':
        console.error(formattedMessage);
        break;
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

  error(message: string, context?: LogContext | Error): void {
    if (context instanceof Error) {
      this.log('error', message, {
        error: context.message,
        stack: context.stack,
        name: context.name,
      });
    } else {
      this.log('error', message, context);
    }
  }

  /**
   * Log HTTP request
   */
  request(method: string, url: string, context?: LogContext): void {
    this.info('HTTP Request', { method, url, ...context });
  }

  /**
   * Log HTTP response
   */
  response(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
    context?: LogContext
  ): void {
    const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
    this.log(level, 'HTTP Response', {
      method,
      url,
      statusCode,
      duration: `${duration}ms`,
      ...context,
    });
  }

  /**
   * Log database query
   */
  query(operation: string, collection: string, duration?: number): void {
    this.debug('Database Query', {
      operation,
      collection,
      duration: duration ? `${duration}ms` : undefined,
    });
  }

  /**
   * Log authentication events
   */
  auth(event: string, userId?: string, context?: LogContext): void {
    this.info('Authentication Event', {
      event,
      userId,
      ...context,
    });
  }

  /**
   * Log business events
   */
  business(event: string, context?: LogContext): void {
    this.info('Business Event', {
      event,
      ...context,
    });
  }
}

// Export singleton instance
export const logger = new Logger();

// Export type for use in other files
export type { LogLevel, LogContext };
