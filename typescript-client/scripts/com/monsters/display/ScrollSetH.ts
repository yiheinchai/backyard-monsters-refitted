import { DisplayObject } from "openfl/display/DisplayObject";
import { MovieClip } from "openfl/display/MovieClip";
import { Event } from "openfl/events/Event";
import { MouseEvent } from "openfl/events/MouseEvent";
import { Rectangle } from "openfl/geom/Rectangle";
import { Embed } from "../../../core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="ScrollSetH_CLIP")]
declare class ScrollSetH_CLIP extends MovieClip {
    mcScroller: MovieClip;
    mcBG: DisplayObject;
}

/**
 * Horizontal scroll bar control.
 */
@Embed({ source: "/_assets/assets.swf", symbol: "ScrollSetH_CLIP" })
export class ScrollSetH extends ScrollSetH_CLIP {
    private _defaultScrollWidth: number;
    private _content: DisplayObject;
    private _mask: DisplayObject;
    private _scroller: MovieClip;
    private _track: DisplayObject;

    constructor(content: DisplayObject, mask: DisplayObject, buttonMode: boolean = false) {
        super();
        this._content = content;
        this._mask = mask;
        this._scroller = this.mcScroller;
        this._scroller.buttonMode = buttonMode;
        this._defaultScrollWidth = this._scroller.width;
        this._track = this.mcBG;
        this._track.width = mask.width;
        
        this.addEventListener(MouseEvent.MOUSE_DOWN, this.onMouseDown);
        this._content.addEventListener(Event.RESIZE, this.onContentResize);
        this.onContentResize();
    }

    protected onContentResize = (event: Event | null = null): void => {
        this.visible = this._content.width > this._mask.width;
        this.updateScrollerSize();
    };

    protected onMouseDown = (event: MouseEvent): void => {
        this.addEventListener(Event.ENTER_FRAME, this.onEnterFrame);
        this.stage.addEventListener(MouseEvent.MOUSE_UP, this.onMouseUp);
        this._scroller.startDrag(false, new Rectangle(0, this._scroller.y, this.width - this._scroller.width, 0));
    };

    protected onMouseUp = (event: MouseEvent): void => {
        this.removeEventListener(Event.ENTER_FRAME, this.onEnterFrame);
        this.stage.removeEventListener(MouseEvent.MOUSE_UP, this.onMouseUp);
        this._scroller.stopDrag();
    };

    protected onEnterFrame = (event: Event): void => {
        const ratio = this._scroller.x / (this.width - this._scroller.width);
        this._content.x = this._mask.x + ratio * -(this._content.width - this._mask.width);
    };

    private updateScrollerSize(): void {
        this._scroller.width = this._defaultScrollWidth * (this._mask.width / this._content.width);
    }
}
