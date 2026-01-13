import Event from "openfl/events/Event";

/**
 * Base planner event - events for base template operations.
 */
export class BasePlannerEvent extends Event {
    public static readonly LOAD: string = "loadTemplate";
    public static readonly SAVE: string = "saveTemplate";
    public static readonly APPLY: string = "applyTemplate";
    public static readonly CLEARALL: string = "emptyTemplate";

    constructor(type: string, bubbles: boolean = false, cancelable: boolean = false) {
        super(type, bubbles, cancelable);
    }
}
