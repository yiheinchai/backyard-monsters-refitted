import { Event } from "openfl/events/Event";

/**
 * BaseEvent - Base event class for SmartFoxServer events.
 */
export class BaseEvent extends Event {
    public params: any;

    constructor(type: string, params: any = null) {
        super(type);
        this.params = params;
    }

    public override clone(): Event {
        return new BaseEvent(this.type, this.params);
    }

    public override toString(): string {
        return `[BaseEvent type="${this.type}" bubbles=${this.bubbles} cancelable=${this.cancelable} params=${JSON.stringify(this.params)}]`;
    }
}
