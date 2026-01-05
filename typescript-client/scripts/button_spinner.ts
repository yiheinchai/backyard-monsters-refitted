import MovieClip from 'openfl/display/MovieClip';
import Event from 'openfl/events/Event';

/**
 * button_spinner - Spinning animation for buttons
 * Rotates continuously when visible
 * Converted from ActionScript to TypeScript
 */
export class button_spinner extends MovieClip {
    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    public Tick(param1: Event): void {
        this.rotation += 4;
    }

    protected frame1(): void {
        this.addEventListener(Event.ENTER_FRAME, this.Tick.bind(this));
    }
}
