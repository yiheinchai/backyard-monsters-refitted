import { Event } from "openfl/events/Event";
import { BaseEvent } from "../core/BaseEvent";

/**
 * LoggerEvent - Logger event class for debug/info/warning/error messages.
 */
export class LoggerEvent extends BaseEvent {
    public static readonly DEBUG: string = "debug";
    public static readonly INFO: string = "info";
    public static readonly WARNING: string = "warn";
    public static readonly ERROR: string = "error";

    constructor(type: string, params: any = null) {
        super(type, params);
    }

    public override clone(): Event {
        return new LoggerEvent(this.type, this.params);
    }

    public override toString(): string {
        return `[LoggerEvent type="${this.type}" bubbles=${this.bubbles} cancelable=${this.cancelable} params=${JSON.stringify(this.params)}]`;
    }
}
