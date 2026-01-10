import Event from "openfl/events/Event";

/**
 * TweenEvent - Event class for GreenSock tweening events.
 */
export class TweenEvent extends Event {
    public static readonly version: number = 0.9;
    public static readonly START: string = "start";
    public static readonly UPDATE: string = "update";
    public static readonly COMPLETE: string = "complete";

    public info: any;

    constructor(type: string, info: any = null, bubbles: boolean = false, cancelable: boolean = false) {
        super(type, bubbles, cancelable);
        this.info = info;
    }

    public override clone(): Event {
        return new TweenEvent(this.type, this.info, this.bubbles, this.cancelable);
    }
}
