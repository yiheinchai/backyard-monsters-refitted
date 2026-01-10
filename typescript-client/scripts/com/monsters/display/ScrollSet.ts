import MovieClip from "openfl/display/MovieClip";
import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";
import Rectangle from "openfl/geom/Rectangle";

import { TweenLite } from "gsap/TweenLite";
import { GLOBAL } from "../../../GLOBAL";
import { Embed } from "../../../core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="ScrollSet_CLIP")]
declare class ScrollSet_CLIP extends MovieClip {
    mcScroller: MovieClip;
    mcBG: MovieClip;
}

/**
 * Scrollable container with scroll bar UI.
 */
@Embed({ source: "/_assets/assets.swf", symbol: "ScrollSet_CLIP" })
export class ScrollSet extends ScrollSet_CLIP {
    public static readonly BROWN: number = 0;
    public static readonly GREY: number = 1;
    private static readonly NUM_COLORS: number = 2;

    private _IsInitialized: boolean = false;
    private _Container!: Sprite;
    private _ContainerHeight: number = 0;
    private _Mask!: MovieClip;
    private _ScrollBarHeight: number = 0;
    private _OffsetY: number = 0;
    private _Easing: number = 1;
    private _Margin: number = 1;
    private _Thresh: number = 0.03;
    private _BottomPadding: number = 0;
    private _AutoHideEnabled: boolean = true;
    public isHiddenWhileUnnecessary: boolean = false;
    private _MinScrollerHeight: number = 0;
    private _IsDragging: boolean = false;

    constructor() {
        super();
    }

    public Init(container: Sprite, mask: MovieClip, colorType: number = 0, offsetY: number = 0, scrollBarHeight: number = 128, minScrollerHeight: number = 30, bottomPadding: number = 0): void {
        this._Container = container;
        this._ContainerHeight = container.height;
        this._Mask = mask;
        this._ScrollBarHeight = scrollBarHeight;
        this._MinScrollerHeight = minScrollerHeight;
        this._OffsetY = offsetY;
        this._BottomPadding = bottomPadding;
        
        colorType = GLOBAL.InfernoMode() ? 1 : 0;
        if (colorType < 0 || colorType >= ScrollSet.NUM_COLORS) {
            return;
        }
        
        switch (colorType) {
            case ScrollSet.BROWN:
                this.mcScroller.gotoAndStop(1);
                break;
            case ScrollSet.GREY:
                this.mcScroller.gotoAndStop(2);
                break;
        }
        
        this.mcScroller.y = this._Margin;
        this.mcBG.height = scrollBarHeight;
        this.mcScroller.useHandCursor = true;
        
        this.addEventListener(MouseEvent.MOUSE_OVER, this.Show);
        this.addEventListener(MouseEvent.MOUSE_OUT, this.Hide);
        this._Container.addEventListener(Event.RESIZE, this.onResize);
        this.mcScroller.addEventListener(MouseEvent.MOUSE_DOWN, this.ScrollerDown);
        
        if (this.parent && container.height < this._Mask.height) {
            this.parent.removeChild(this);
        } else {
            if (container.height === 0) {
                container.height = 1;
            }
            let scrollerHeight = scrollBarHeight * (mask.height / container.height);
            this.mcScroller.height = scrollerHeight < minScrollerHeight ? minScrollerHeight : scrollerHeight;
            this.Show();
        }
        
        this._IsInitialized = true;
    }

    protected onResize = (event: MouseEvent): void => {
        this.Update();
    };

    public Update(): void {
        this.ResizeScroller();
        if (this._Mask.height !== this._ScrollBarHeight) {
            this.ResizeScrollBar();
        }
        this._ContainerHeight = this._Container.height;
        
        if (this.mcScroller.height + this.mcScroller.y > this._Mask.height) {
            this.mcScroller.y = this._Mask.height - this.mcScroller.height;
        }
        
        if (this.isHiddenWhileUnnecessary) {
            this.visible = this._ContainerHeight > this._Mask.height;
        }
        
        const colorType = GLOBAL.InfernoMode() ? 1 : 0;
        if (colorType < 0 || colorType >= ScrollSet.NUM_COLORS) {
            return;
        }
        
        switch (colorType) {
            case ScrollSet.BROWN:
                this.mcScroller.gotoAndStop(1);
                break;
            case ScrollSet.GREY:
                this.mcScroller.gotoAndStop(2);
                break;
        }
    }

    private ResizeScroller(): void {
        let ratio = this._Mask.height / this._Container.height;
        ratio = Math.min(ratio, 1);
        let scrollerHeight = this.mcBG.height * ratio;
        scrollerHeight = scrollerHeight < this._MinScrollerHeight ? this._MinScrollerHeight : scrollerHeight;
        scrollerHeight = Math.min(scrollerHeight, this._ScrollBarHeight);
        this.mcScroller.height = scrollerHeight;
    }

    private ResizeScrollBar(): void {
        this._ScrollBarHeight = this._Mask.height;
        this.mcBG.height = this._Mask.height;
    }

    private ScrollerDown = (event: MouseEvent): void => {
        this.stage.addEventListener(MouseEvent.MOUSE_UP, this.OnStageUp);
        this.addEventListener(Event.ENTER_FRAME, this.OnDrag);
        const bounds = new Rectangle(this.mcScroller.x, this.mcBG.y + this._Margin, 0, this.mcBG.height - this.mcScroller.height - 2 * this._Margin);
        this.mcScroller.startDrag(false, bounds);
        this._IsDragging = true;
    };

    private OnDrag = (event: Event | null = null): void => {
        let percent = (this._Margin + this.mcScroller.y) / (this.mcBG.height - this.mcScroller.height - this._Margin);
        if (percent < this._Thresh) percent = 0;
        if (percent > 1 - this._Thresh) percent = 1;
        
        const targetY = this._OffsetY - percent * (this._ContainerHeight - this._Mask.height + this._BottomPadding);
        
        if (this._Easing !== 0) {
            const newY = this._Container.y - (this._Container.y - targetY) / this._Easing;
            this._Container.y = Math.floor(newY);
        } else {
            this._Container.y = Math.floor(targetY);
        }
    };

    private OnStageUp = (event: MouseEvent): void => {
        this.removeEventListener(Event.ENTER_FRAME, this.OnDrag);
        this.mcScroller.stopDrag();
        this._IsDragging = false;
    };

    public Show = (event: MouseEvent | null = null): void => {
        TweenLite.to(this, 0.3, { alpha: 1 });
    };

    public Hide = (event: MouseEvent | null = null): void => {
        if (!this._IsDragging && this._AutoHideEnabled) {
            TweenLite.to(this, 0.3, { alpha: 0.2 });
        }
    };

    public ScrollTo(pctY: number, instant: boolean = false): void {
        if (!this._IsInitialized) return;
        
        TweenLite.killTweensOf(this.mcScroller);
        const oldEase = this._Easing;
        this._Easing = 1;
        
        const tgtY = pctY * (this.mcBG.height - this.mcScroller.height - this._Margin) + this._Margin;
        
        if (instant) {
            this.mcScroller.y = tgtY;
            this.OnDrag();
        } else {
            TweenLite.to(this.mcScroller, 0.6, {
                y: tgtY,
                onUpdate: this.OnDrag,
                onComplete: () => {
                    this._Easing = oldEase;
                }
            });
        }
    }

    public get AutoHideEnabled(): boolean {
        return this._AutoHideEnabled;
    }

    public set AutoHideEnabled(value: boolean) {
        this._AutoHideEnabled = value;
    }

    public get BottomPadding(): number {
        return this._BottomPadding;
    }

    public set BottomPadding(value: number) {
        this._BottomPadding = value;
    }

    public get ContainerHeight(): number {
        return this._ContainerHeight;
    }

    public set ContainerHeight(value: number) {
        this._ContainerHeight = value;
    }

    public get ScrollerBarHeight(): number {
        return this._ScrollBarHeight;
    }

    public set ScrollerBarHeight(value: number) {
        this._ScrollBarHeight = value;
    }

    public get Easing(): number {
        return this._Easing;
    }

    public set Easing(value: number) {
        this._Easing = value;
    }

    public get IsDragging(): boolean {
        return this._IsDragging;
    }
}
