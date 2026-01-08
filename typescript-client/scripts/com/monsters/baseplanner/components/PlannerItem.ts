import { MovieClip } from "openfl/display/MovieClip";
import { Sprite } from "openfl/display/Sprite";
import { MouseEvent } from "openfl/events/MouseEvent";
import { Rectangle } from "openfl/geom/Rectangle";

/**
 * Planner item - base class for items in the yard planner.
 */
export class PlannerItem extends Sprite {
    public mc: MovieClip | null = null;
    public size: Rectangle | null = null;

    constructor() {
        super();
        this.addEventListener(MouseEvent.CLICK, this.onClick.bind(this));
        this.addEventListener(MouseEvent.ROLL_OVER, this.onRollOver.bind(this));
        this.addEventListener(MouseEvent.ROLL_OUT, this.onRollOut.bind(this));
        this.addEventListener(MouseEvent.MOUSE_DOWN, this.onMouseDown.bind(this));
        this.addEventListener(MouseEvent.MOUSE_UP, this.onMouseUp.bind(this));
    }

    public remove(): void {
        this.removeEventListener(MouseEvent.CLICK, this.onClick.bind(this));
        this.removeEventListener(MouseEvent.CLICK, this.onRollOver.bind(this));
        this.removeEventListener(MouseEvent.CLICK, this.onRollOut.bind(this));
        this.removeEventListener(MouseEvent.CLICK, this.onMouseDown.bind(this));
        this.removeEventListener(MouseEvent.CLICK, this.onMouseUp.bind(this));
    }

    public update(): void {
        // Empty implementation
    }

    public onClick(event: MouseEvent | null = null): void {
        // Empty implementation
    }

    public onRollOver(event: MouseEvent | null = null): void {
        // Empty implementation
    }

    public onRollOut(event: MouseEvent | null = null): void {
        // Empty implementation
    }

    public onMouseDown(event: MouseEvent | null = null): void {
        // Empty implementation
    }

    public onMouseUp(event: MouseEvent | null = null): void {
        // Empty implementation
    }
}
