import { DisplayObject } from "openfl/display/DisplayObject";
import { IEventDispatcher } from "openfl/events/IEventDispatcher";

import { ReplayableEvent } from "./ReplayableEvent";

/**
 * Interface for replayable event UI components.
 */
export interface IReplayableEventUI extends IEventDispatcher {
    readonly eventUI: DisplayObject;
    setup(event: ReplayableEvent): void;
    update(): void;
}
