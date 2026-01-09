import { Event } from "openfl/events/Event";
import { BaseEvent } from "./BaseEvent";
import { SFSEvent } from "./SFSEvent";

/**
 * SFSBuddyEvent - Event class for buddy-related events.
 */
export class SFSBuddyEvent extends BaseEvent {
    public static readonly BUDDY_LIST_INIT: string = "buddyListInit";
    public static readonly BUDDY_ADD: string = "buddyAdd";
    public static readonly BUDDY_REMOVE: string = "buddyRemove";
    public static readonly BUDDY_BLOCK: string = "buddyBlock";
    public static readonly BUDDY_ERROR: string = "buddyError";
    public static readonly BUDDY_ONLINE_STATE_UPDATE: string = "buddyOnlineStateChange";
    public static readonly BUDDY_VARIABLES_UPDATE: string = "buddyVariablesUpdate";
    public static readonly BUDDY_MESSAGE: string = "buddyMessage";

    constructor(type: string, params: any) {
        super(type);
        this.params = params;
    }

    public override clone(): Event {
        return new SFSEvent(this.type, this.params);
    }

    public override toString(): string {
        return `[SFSBuddyEvent type="${this.type}" bubbles=${this.bubbles} cancelable=${this.cancelable} params=${JSON.stringify(this.params)}]`;
    }
}
