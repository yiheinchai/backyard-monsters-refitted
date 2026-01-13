import Event from "openfl/events/Event";

/**
 * Base planner transfer event - event for template transfer operations.
 */
export class BasePlannerTransferEvent extends Event {
    private _templateName: string;
    private _slot: number;

    constructor(type: string, slot: number, templateName: string = "") {
        super(type);
        this._templateName = templateName;
        this._slot = slot;
    }

    public get templateName(): string {
        return this._templateName;
    }

    public get name(): string {
        return this._templateName;
    }

    public get slot(): number {
        return this._slot;
    }
}
