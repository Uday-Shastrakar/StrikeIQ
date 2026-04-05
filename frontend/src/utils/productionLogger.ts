/**
 * Production-safe logging utility
 * Provides different log levels based on environment
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class ProductionLogger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.isDevelopment) return true;
    
    // In production, only log errors and warnings
    return level === 'error' || level === 'warn';
  }

  private formatMessage(level: LogLevel, service: string, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] [${service}] ${message}${contextStr}`;
  }

  debug(service: string, message: string, context?: LogContext): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', service, message, context));
    }
  }

  info(service: string, message: string, context?: LogContext): void {
    if (this.shouldLog('info')) {
      console.log(this.formatMessage('info', service, message, context));
    }
  }

  warn(service: string, message: string, context?: LogContext): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', service, message, context));
    }
  }

  error(service: string, message: string, context?: LogContext): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', service, message, context));
    }
  }

  // Specialized methods for different services
  ws(message: string, context?: LogContext): void {
    this.info('WS', message, context);
  }

  wsError(message: string, context?: LogContext): void {
    this.error('WS', message, context);
  }

  wsCritical(message: string, context?: LogContext): void {
    this.error('WS', message, context);
  }

  api(message: string, context?: LogContext): void {
    this.info('API', message, context);
  }

  apiError(message: string, context?: LogContext): void {
    this.error('API', message, context);
  }

  auth(message: string, context?: LogContext): void {
    this.info('AUTH', message, context);
  }

  authError(message: string, context?: LogContext): void {
    this.error('AUTH', message, context);
  }

  ui(message: string, context?: LogContext): void {
    this.debug('UI', message, context);
  }

  uiError(message: string, context?: LogContext): void {
    this.error('UI', message, context);
  }
}

export const logger = new ProductionLogger();

// Export individual functions for backward compatibility
export const wsLog = (message: string, data?: any) => logger.ws(message, data);
export const wsError = (message: string, data?: any) => logger.wsError(message, data);
export const wsCritical = (message: string, data?: any) => logger.wsCritical(message, data);
export const apiLog = (message: string, data?: any) => logger.api(message, data);
export const apiError = (message: string, data?: any) => logger.apiError(message, data);
export const authLog = (message: string, data?: any) => logger.auth(message, data);
export const authError = (message: string, data?: any) => logger.authError(message, data);
export const uiLog = (message: string, data?: any) => logger.ui(message, data);
export const uiError = (message: string, data?: any) => logger.uiError(message, data);
