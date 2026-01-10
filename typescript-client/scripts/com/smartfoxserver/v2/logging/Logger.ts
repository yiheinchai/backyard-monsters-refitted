import EventDispatcher from "openfl/events/EventDispatcher";
import { LoggerEvent } from "./LoggerEvent";
import { LogLevel } from "./LogLevel";

/**
 * Logger - Singleton logging class for SmartFoxServer.
 */
export class Logger extends EventDispatcher {
    private static _instance: Logger | null = null;
    private static _locked: boolean = true;

    private _enableConsoleTrace: boolean = true;
    private _enableEventDispatching: boolean = false;
    private _loggingLevel: number;

    constructor() {
        super();
        if (Logger._locked) {
            throw new Error("Cannot instantiate the Logger using the constructor. Please use the getInstance() method");
        }
        this._loggingLevel = LogLevel.INFO;
    }

    public static getInstance(): Logger {
        if (Logger._instance === null) {
            Logger._locked = false;
            Logger._instance = new Logger();
            Logger._locked = true;
        }
        return Logger._instance;
    }

    public get enableConsoleTrace(): boolean {
        return this._enableConsoleTrace;
    }

    public set enableConsoleTrace(value: boolean) {
        this._enableConsoleTrace = value;
    }

    public get enableEventDispatching(): boolean {
        return this._enableEventDispatching;
    }

    public set enableEventDispatching(value: boolean) {
        this._enableEventDispatching = value;
    }

    public get loggingLevel(): number {
        return this._loggingLevel;
    }

    public set loggingLevel(value: number) {
        this._loggingLevel = value;
    }

    public debug(...args: any[]): void {
        this.log(LogLevel.DEBUG, args.join(" "));
    }

    public info(...args: any[]): void {
        this.log(LogLevel.INFO, args.join(" "));
    }

    public warn(...args: any[]): void {
        this.log(LogLevel.WARN, args.join(" "));
    }

    public error(...args: any[]): void {
        this.log(LogLevel.ERROR, args.join(" "));
    }

    private log(level: number, message: string): void {
        if (level < this._loggingLevel) {
            return;
        }
        const levelName = LogLevel.fromString(level);
        if (this._enableConsoleTrace) {
            console.log("[SFS - " + levelName + "]", message);
        }
        if (this._enableEventDispatching) {
            const params = { message: message };
            const evt = new LoggerEvent(levelName, params);
            this.dispatchEvent(evt);
        }
    }
}
