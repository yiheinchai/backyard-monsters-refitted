/**
 * LogLevel - Logging level constants.
 */
export class LogLevel {
    public static readonly DEBUG: number = 100;
    public static readonly INFO: number = 200;
    public static readonly WARN: number = 300;
    public static readonly ERROR: number = 400;

    constructor() { }

    public static fromString(level: number): string {
        let result = "Unknown";
        if (level === LogLevel.DEBUG) {
            result = "DEBUG";
        } else if (level === LogLevel.INFO) {
            result = "INFO";
        } else if (level === LogLevel.WARN) {
            result = "WARN";
        } else if (level === LogLevel.ERROR) {
            result = "ERROR";
        }
        return result;
    }
}
