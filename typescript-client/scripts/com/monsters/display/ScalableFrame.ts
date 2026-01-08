import { Event } from "openfl/events/Event";

import { frame } from "../../../frame";

/**
 * Scalable frame that auto-resizes on resize events.
 */
export class ScalableFrame extends frame {
    constructor() {
        super(false);
        this.addEventListener(Event.RESIZE, this.onResize);
    }

    protected onResize = (event: Event): void => {
        this.resize();
    };
}
