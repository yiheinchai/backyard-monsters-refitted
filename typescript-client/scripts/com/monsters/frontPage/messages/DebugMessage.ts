import { Message } from "./Message";

/**
 * Debug message - only shown in debug mode.
 */
export class DebugMessage extends Message {
    constructor() {
        super("debug", "debug");
    }

    public override get areRequirementsMet(): boolean {
        return false;
    }
}
