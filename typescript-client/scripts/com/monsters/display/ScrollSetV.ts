import { DisplayObject } from "openfl/display/DisplayObject";
import { MovieClip } from "openfl/display/MovieClip";
import { Event } from "openfl/events/Event";
import { MouseEvent } from "openfl/events/MouseEvent";
import { Rectangle } from "openfl/geom/Rectangle";

// [Embed(source="/_assets/assets.swf", symbol="ScrollSet_CLIP")]
declare class ScrollSet_CLIP extends MovieClip {
    mcScroller: MovieClip;
    mcBG: DisplayObject;
}

/**
 * Vertical scroll bar control.
 */
export class ScrollSetV extends ScrollSet_CLIP {
    private _defaultScrollHeight: number;
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
        this._defaultScrollHeight = this._scroller.height;
        this._scroller.y = 0;
        this._track = this.mcBG;
        this._track.height = mask.height;
        
        this.addEventListener(MouseEvent.MOUSE_DOWN, this.onMouseDown);
        this._content.addEventListener(Event.RESIZE, this.onContentResize);
        this._content.addEventListener(MouseEvent.CLICK, this.onContentResize);
        this.onContentResize();
        this.mcScroller.gotoAndStop(1);
    }

    public checkResize(): void {
        this.onContentResize();
    }

    protected onContentResize = (event: Event | null = null): void => {
        this.visible = this._content.height > this._mask.height;
        this.updateScrollerSize();
    };

    protected onMouseDown = (event: MouseEvent): void => {
        this.addEventListener(Event.ENTER_FRAME, this.onEnterFrame);
        this.stage.addEventListener(MouseEvent.MOUSE_UP, this.onMouseUp);
        this._scroller.startDrag(false, new Rectangle(this._scroller.x, 0, 0, this.height - this._scroller.height));
    };

    protected onMouseUp = (event: MouseEvent): void => {
        this.removeEventListener(Event.ENTER_FRAME, this.onEnterFrame);
        this.stage.removeEventListener(MouseEvent.MOUSE_UP, this.onMouseUp);
        this._scroller.stopDrag();
    };

    protected onEnterFrame = (event: Event): void => {
        const ratio = this._scroller.y / (this.height - this._scroller.height);
        this._content.y = this._mask.y + ratio * -(this._content.height - this._mask.height);
    };

    private updateScrollerSize(): void {
        this._scroller.height = this._defaultScrollHeight * (this._mask.height / this._content.height);
        this._track.height = this._mask.height;
        if (this._content.y < -this._content.height || this._content.height <= this._mask.height) {
            this._content.y = 0;
            this._scroller.y = 0;
        }
    }
}
