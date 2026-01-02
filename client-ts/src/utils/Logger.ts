/**
 * LOGGER - Logging system for the Backyard Monsters client
 * This is the TypeScript equivalent of LOGGER.as
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'err' | 'fatal';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: number;
}

/**
 * LOGGER class - manages application logging
 */
export class LOGGER {
  // Log history
  private static logs: LogEntry[] = [];
  
  // Max log entries
  private static maxLogs: number = 1000;
  
  // Console output enabled
  private static consoleEnabled: boolean = true;
  
  // Debug mode
  private static debugMode: boolean = import.meta.env.DEV;

  /**
   * Log a message
   */
  static Log(level: LogLevel, message: string, data?: unknown): void {
    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: Date.now()
    };

    LOGGER.logs.push(entry);
    
    // Trim old logs
    if (LOGGER.logs.length > LOGGER.maxLogs) {
      LOGGER.logs.shift();
    }

    // Console output
    if (LOGGER.consoleEnabled) {
      LOGGER.consoleOutput(entry);
    }
  }

  /**
   * Output to console
   */
  private static consoleOutput(entry: LogEntry): void {
    const timestamp = new Date(entry.timestamp).toISOString();
    const prefix = `[${timestamp}] [${entry.level.toUpperCase()}]`;

    switch (entry.level) {
      case 'debug':
        if (LOGGER.debugMode) {
          console.debug(prefix, entry.message, entry.data ?? '');
        }
        break;
      case 'info':
        console.info(prefix, entry.message, entry.data ?? '');
        break;
      case 'warn':
        console.warn(prefix, entry.message, entry.data ?? '');
        break;
      case 'err':
      case 'fatal':
        console.error(prefix, entry.message, entry.data ?? '');
        break;
    }
  }

  /**
   * Debug log
   */
  static Debug(message: string, data?: unknown): void {
    LOGGER.Log('debug', message, data);
  }

  /**
   * Info log
   */
  static Info(message: string, data?: unknown): void {
    LOGGER.Log('info', message, data);
  }

  /**
   * Warning log
   */
  static Warn(message: string, data?: unknown): void {
    LOGGER.Log('warn', message, data);
  }

  /**
   * Error log
   */
  static Error(message: string, data?: unknown): void {
    LOGGER.Log('err', message, data);
  }

  /**
   * Fatal error log
   */
  static Fatal(message: string, data?: unknown): void {
    LOGGER.Log('fatal', message, data);
  }

  /**
   * Get all logs
   */
  static GetLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return LOGGER.logs.filter(l => l.level === level);
    }
    return [...LOGGER.logs];
  }

  /**
   * Clear logs
   */
  static Clear(): void {
    LOGGER.logs = [];
  }

  /**
   * Enable/disable console output
   */
  static SetConsoleEnabled(enabled: boolean): void {
    LOGGER.consoleEnabled = enabled;
  }

  /**
   * Enable/disable debug mode
   */
  static SetDebugMode(enabled: boolean): void {
    LOGGER.debugMode = enabled;
  }

  /**
   * Export logs as JSON
   */
  static ExportLogs(): string {
    return JSON.stringify(LOGGER.logs, null, 2);
  }
}

export default LOGGER;
