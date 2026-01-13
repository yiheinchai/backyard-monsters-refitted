import MovieClip from 'openfl/display/MovieClip';
import MouseEvent from 'openfl/events/MouseEvent';

/**
 * buttonClose - Close button base class
 * Converted from ActionScript to TypeScript
 */
export class buttonClose extends MovieClip {
    constructor() {
        super();
        this.buttonMode = true;
        this.addEventListener(MouseEvent.MOUSE_OVER, this.Over.bind(this));
        this.addEventListener(MouseEvent.MOUSE_OUT, this.Out.bind(this));
        this.gotoAndStop(1);
    }

    private Over(param1: MouseEvent): void {
        this.gotoAndStop(2);
    }

    private Out(param1: MouseEvent): void {
        this.gotoAndStop(1);
    }
}
