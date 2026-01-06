import Bitmap from 'openfl/display/Bitmap';
import DisplayObject from 'openfl/display/DisplayObject';
import MovieClip from 'openfl/display/MovieClip';
import MouseEvent from 'openfl/events/MouseEvent';
import { GLOBAL } from './GLOBAL';
import { POPUPS } from './POPUPS';
import { frame2_bottom_left } from './frame2_bottom_left';
import { frame2_bottom_right } from './frame2_bottom_right';
import { frame2_top_left } from './frame2_top_left';
import { frame2_top_right } from './frame2_top_right';
import { frame2_filler_top } from './frame2_filler_top';
import { frame2_filler_left } from './frame2_filler_left';
import { frame2_filler_right } from './frame2_filler_right';
import { frame2_filler_bottom } from './frame2_filler_bottom';
import { frame2_background } from './frame2_background';
import { frame_button_close } from './frame_button_close';
import { frame_button_help } from './frame_button_help';

/**
 * frame2 - Frame type 2 component with decorations and buttons
 * Converted from ActionScript to TypeScript
 */
export class frame2 extends MovieClip {
    private _bottomLeft: Bitmap | null = null;
    private _bottomRight: Bitmap | null = null;
    private _topLeft: Bitmap | null = null;
    private _topRight: Bitmap | null = null;
    private _fillerLeft: Bitmap | null = null;
    private _fillerRight: Bitmap | null = null;
    private _fillerTop: Bitmap | null = null;
    private _fillerBottom: Bitmap | null = null;
    private _buttonClose: Bitmap | null = null;
    private _buttonHelp: Bitmap | null = null;
    private _background: Bitmap | null = null;
    private _frameMC: MovieClip | null = null;
    private _frameDO: DisplayObject | null = null;
    private _backgroundMC: MovieClip | null = null;
    private _backgroundDO: DisplayObject | null = null;
    private _customCloseFunction: Function | null = null;

    constructor() {
        super();
        this.Setup();
    }

    public Setup(param1: boolean = true, param2: Function | null = null): void {
        let _loc3_: boolean = false;
        let _loc4_: MovieClip;
        this.Clear();
        this._customCloseFunction = param2;
        _loc3_ = this.parent && 'Help' in this.parent;
        
        this._bottomLeft = new Bitmap(new frame2_bottom_left(0, 0));
        this._bottomRight = new Bitmap(new frame2_bottom_right(0, 0));
        this._topLeft = new Bitmap(new frame2_top_left(0, 0));
        this._topRight = new Bitmap(new frame2_top_right(0, 0));
        this._fillerTop = new Bitmap(new frame2_filler_top(0, 0));
        this._fillerLeft = new Bitmap(new frame2_filler_left(0, 0));
        this._fillerRight = new Bitmap(new frame2_filler_right(0, 0));
        this._fillerBottom = new Bitmap(new frame2_filler_bottom(0, 0));
        this._background = new Bitmap(new frame2_background(0, 0));
        this._buttonClose = new Bitmap(new frame_button_close(0, 0));
        
        if (_loc3_) {
            this._buttonHelp = new Bitmap(new frame_button_help(0, 0));
        }
        
        this._topLeft.x = this.x - 11;
        this._topLeft.y = this.y - 10;
        this._topRight.x = this.x + this.width - 66 + 11;
        this._topRight.y = this.y - 9;
        this._bottomLeft.x = this.x - 12;
        this._bottomLeft.y = this.y + this.height - 69 + 15;
        this._bottomRight.x = this.x + this.width - 68 + 11;
        this._bottomRight.y = this.y + this.height - 66 + 16;
        this._background.x = this.x + 10;
        this._background.y = this.y + 10;
        this._background.width = this.width - 20;
        this._background.height = this.height - 20;
        this._buttonClose.x = this.x + this.width - 20;
        this._buttonClose.y = this.y - 10;
        
        if (_loc3_ && this._buttonHelp) {
            this._buttonHelp.x = this.x + this.width - 48;
            this._buttonHelp.y = this.y - 11;
        }
        
        this._fillerTop.x = this.x + 56;
        this._fillerTop.y = this.y - 7;
        this._fillerTop.width = this.width - 105;
        this._fillerLeft.x = this.x - 8;
        this._fillerLeft.y = this.y + 50;
        this._fillerLeft.height = this.height - 100;
        this._fillerRight.x = this.x + this.width - 16;
        this._fillerRight.y = this.y + 50;
        this._fillerRight.height = this.height - 95;
        this._fillerBottom.x = this.x + 40;
        this._fillerBottom.y = this.y + this.height - 11;
        this._fillerBottom.width = this.width - 90;
        
        this._frameMC = new MovieClip();
        this._frameMC.mouseEnabled = false;
        this._frameMC.addChild(this._background);
        this._frameMC.addChild(this._fillerTop);
        
        if (this.height > 100) {
            this._frameMC.addChild(this._fillerLeft);
        }
        if (this.height > 95) {
            this._frameMC.addChild(this._fillerRight);
        }
        
        this._frameMC.addChild(this._fillerBottom);
        this._frameMC.addChild(this._bottomLeft);
        this._frameMC.addChild(this._bottomRight);
        this._frameMC.addChild(this._topLeft);
        this._frameMC.addChild(this._topRight);
        
        if (param1) {
            _loc4_ = new MovieClip();
            _loc4_.addChild(this._buttonClose);
            _loc4_.addEventListener(MouseEvent.CLICK, this.BtnClose.bind(this));
            _loc4_.buttonMode = true;
            this._frameMC.addChild(_loc4_);
        }
        if (param1 && _loc3_ && this._buttonHelp) {
            _loc4_ = new MovieClip();
            _loc4_.addChild(this._buttonHelp);
            _loc4_.addEventListener(MouseEvent.CLICK, this.BtnHelp.bind(this));
            _loc4_.buttonMode = true;
            this._frameMC.addChild(_loc4_);
        }
        
        if (this.parent) {
            this._frameDO = this.parent.addChild(this._frameMC);
            const _loc5_: number = this.parent.getChildIndex(this);
            this.parent.setChildIndex(this._frameDO, _loc5_);
        }
        this.visible = false;
    }

    public Clear(): void {
        if (this._bottomLeft && this._bottomLeft.bitmapData) {
            this._bottomLeft.bitmapData.dispose();
            this._bottomLeft.bitmapData = null as any;
        }
        if (this._bottomRight && this._bottomRight.bitmapData) {
            this._bottomRight.bitmapData.dispose();
            this._bottomRight.bitmapData = null as any;
        }
        if (this._topLeft && this._topLeft.bitmapData) {
            this._topLeft.bitmapData.dispose();
            this._topLeft.bitmapData = null as any;
        }
        if (this._topRight && this._topRight.bitmapData) {
            this._topRight.bitmapData.dispose();
            this._topRight.bitmapData = null as any;
        }
        if (this._fillerTop && this._fillerTop.bitmapData) {
            this._fillerTop.bitmapData.dispose();
            this._fillerTop.bitmapData = null as any;
        }
        if (this._fillerLeft && this._fillerLeft.bitmapData) {
            this._fillerLeft.bitmapData.dispose();
            this._fillerLeft.bitmapData = null as any;
        }
        if (this._fillerRight && this._fillerRight.bitmapData) {
            this._fillerRight.bitmapData.dispose();
            this._fillerRight.bitmapData = null as any;
        }
        if (this._fillerBottom && this._fillerBottom.bitmapData) {
            this._fillerBottom.bitmapData.dispose();
            this._fillerBottom.bitmapData = null as any;
        }
        if (this._background && this._background.bitmapData) {
            this._background.bitmapData.dispose();
            this._background.bitmapData = null as any;
        }
        if (this._buttonClose && this._buttonClose.bitmapData) {
            this._buttonClose.bitmapData.dispose();
            this._buttonClose.bitmapData = null as any;
        }
        if (this._buttonHelp && this._buttonHelp.bitmapData) {
            this._buttonHelp.bitmapData.dispose();
            this._buttonHelp.bitmapData = null as any;
        }
        
        try {
            if (this._frameDO && this._frameDO.parent) {
                this._frameDO.parent.removeChild(this._frameDO);
            }
            if (this._backgroundDO && this._backgroundDO.parent) {
                this._backgroundDO.parent.removeChild(this._backgroundDO);
            }
        } catch (e: any) {
            // Ignore errors during cleanup
        }
    }

    private BtnClose(param1: MouseEvent | null = null): void {
        if (this.parent && 'Hide' in this.parent) {
            (this.parent as any).Hide();
        } else if (this._customCloseFunction) {
            this._customCloseFunction();
        } else {
            POPUPS.Next();
        }
    }

    private BtnHelp(param1: MouseEvent | null = null): void {
        if (this.parent && 'Help' in this.parent) {
            (this.parent as any).Help();
        }
    }

    private BtnFullScreen(param1: MouseEvent | null = null): void {
        GLOBAL.goFullScreen();
        if (this.parent && 'FullScreen' in this.parent) {
            (this.parent as any).FullScreen();
        }
    }
}
