import Bitmap from 'openfl/display/Bitmap';
import DisplayObject from 'openfl/display/DisplayObject';
import MovieClip from 'openfl/display/MovieClip';
import MouseEvent from 'openfl/events/MouseEvent';
import { frame1_bottom_left } from './frame1_bottom_left';
import { frame1_bottom_right } from './frame1_bottom_right';
import { frame1_top_left } from './frame1_top_left';
import { frame1_top_right } from './frame1_top_right';
import { frame1_top_middle } from './frame1_top_middle';
import { frame1_top_middle_2 } from './frame1_top_middle_2';
import { frame1_bottom_middle } from './frame1_bottom_middle';
import { frame1_filler_top } from './frame1_filler_top';
import { frame1_filler_left } from './frame1_filler_left';
import { frame1_filler_right } from './frame1_filler_right';
import { frame1_filler_bottom } from './frame1_filler_bottom';
import { frame1_button_close } from './frame1_button_close';
import { frame1_button_help } from './frame1_button_help';
import { frame1_button_fullscreen } from './frame1_button_fullscreen';

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }


/**
 * frame1 - Frame type 1 component with decorations and buttons
 * Converted from ActionScript to TypeScript
 */
export class frame1 extends MovieClip {
    private _bottomLeft: Bitmap | null = null;
    private _bottomRight: Bitmap | null = null;
    private _topLeft: Bitmap | null = null;
    private _topRight: Bitmap | null = null;
    private _topMiddle: Bitmap | null = null;
    private _bottomMiddle: Bitmap | null = null;
    private _fillerLeft: Bitmap | null = null;
    private _fillerRight: Bitmap | null = null;
    private _fillerTop: Bitmap | null = null;
    private _fillerBottom: Bitmap | null = null;
    private _buttonClose: Bitmap | null = null;
    private _buttonHelp: Bitmap | null = null;
    private _buttonFullScreen: Bitmap | null = null;
    private _background: Bitmap | null = null;
    private _frameMC: MovieClip | null = null;
    private _frameDO: DisplayObject | null = null;
    private _backgroundMC: MovieClip | null = null;
    private _backgroundDO: DisplayObject | null = null;

    constructor() {
        super();
        this.Setup(true, false, false);
    }

    public Setup(
        param1: boolean = true,
        param2: boolean = false,
        param3: boolean = false,
        param4: number = 1,
        param5: number = 1,
        param6: number = 0
    ): void {
        let _loc7_: MovieClip;
        this.Clear();
        
        this._bottomLeft = new Bitmap(new frame1_bottom_left(0, 0));
        this._bottomRight = new Bitmap(new frame1_bottom_right(0, 0));
        this._topLeft = new Bitmap(new frame1_top_left(0, 0));
        this._topRight = new Bitmap(new frame1_top_right(0, 0));
        
        if (param4 == 1) {
            this._topMiddle = new Bitmap(new frame1_top_middle(0, 0));
        }
        if (param4 == 2) {
            this._topMiddle = new Bitmap(new frame1_top_middle_2(0, 0));
        }
        
        this._bottomMiddle = new Bitmap(new frame1_bottom_middle(0, 0));
        this._fillerTop = new Bitmap(new frame1_filler_top(0, 0));
        this._fillerLeft = new Bitmap(new frame1_filler_left(0, 0));
        this._fillerRight = new Bitmap(new frame1_filler_right(0, 0));
        this._fillerBottom = new Bitmap(new frame1_filler_bottom(0, 0));
        
        if (param1) {
            this._buttonClose = new Bitmap(new frame1_button_close(0, 0));
        }
        if (param2) {
            this._buttonHelp = new Bitmap(new frame1_button_help(0, 0));
        }
        if (param3) {
            this._buttonFullScreen = new Bitmap(new frame1_button_fullscreen(0, 0));
        }
        
        this._topRight.x = this.x + this.width - 123 + 10;
        this._topRight.y = this.y - 8;
        this._topLeft.x = this.x - 12;
        this._topLeft.y = this.y - 10;
        this._bottomLeft.x = this.x - 8;
        this._bottomLeft.y = this.y + this.height - 64 + 15;
        this._bottomRight.x = this.x + this.width - 112 + 12;
        this._bottomRight.y = this.y + this.height - 158 + 12;
        
        if (this._topMiddle) {
            this._topMiddle.x = this.x + Math.floor(this.width * 0.5) - 140;
            if (param4 == 1) {
                this._topMiddle.y = this.y - 11;
            }
            if (param4 == 2) {
                this._topMiddle.y = this.y - 15;
            }
        }
        
        this._bottomMiddle.x = this.x + Math.floor(this.width * 0.5) - 195;
        this._bottomMiddle.y = this.y + this.height - 14;
        
        if (param1 && this._buttonClose) {
            this._buttonClose.x = this.x + this.width - 20;
            this._buttonClose.y = this.y - 7;
        }
        if (param2 && this._buttonHelp) {
            this._buttonHelp.x = this.x + this.width - 50;
            this._buttonHelp.y = this.y - 7;
        }
        if (param3 && this._buttonFullScreen) {
            if (param2) {
                this._buttonFullScreen.x = this.x + this.width - 80;
            } else {
                this._buttonFullScreen.x = this.x + this.width - 50;
            }
            this._buttonFullScreen.y = this.y - 7;
        }
        
        this._fillerTop.x = this.x + 42;
        this._fillerTop.y = this.y - 5;
        this._fillerTop.width = this.width - 153;
        this._fillerLeft.x = this.x - 4;
        this._fillerLeft.y = this.y + 172;
        this._fillerLeft.height = this.height - 219;
        this._fillerRight.x = this.x + this.width - 14;
        this._fillerRight.y = this.y + 39;
        this._fillerRight.height = this.height - 158;
        this._fillerBottom.x = this.x + 50;
        this._fillerBottom.y = this.y + this.height - 10;
        this._fillerBottom.width = this.width - 100;
        
        this._frameMC = new MovieClip();
        this._frameMC.mouseEnabled = false;
        this._frameMC.addChild(this._fillerTop);
        
        if (this.height - 219 > 0) {
            this._frameMC.addChild(this._fillerLeft);
        }
        if (this.height - 216 > 0) {
            this._frameMC.addChild(this._fillerRight);
        }
        
        this._frameMC.addChild(this._fillerBottom);
        this._frameMC.addChild(this._bottomLeft);
        this._frameMC.addChild(this._bottomRight);
        this._frameMC.addChild(this._topLeft);
        this._frameMC.addChild(this._topRight);
        
        if (param4 > 0 && this._topMiddle) {
            this._frameMC.addChild(this._topMiddle);
        }
        if (param5 > 0) {
            this._frameMC.addChild(this._bottomMiddle);
        }
        
        this._backgroundMC = new MovieClip();
        
        if (param1 && this._buttonClose) {
            _loc7_ = new MovieClip();
            _loc7_.addChild(this._buttonClose);
            _loc7_.addEventListener(MouseEvent.CLICK, this.BtnClose.bind(this));
            _loc7_.buttonMode = true;
            this._frameMC.addChild(_loc7_);
        }
        if (param2 && this._buttonHelp) {
            _loc7_ = new MovieClip();
            _loc7_.addChild(this._buttonHelp);
            _loc7_.addEventListener(MouseEvent.CLICK, this.BtnHelp.bind(this));
            _loc7_.buttonMode = true;
            this._frameMC.addChild(_loc7_);
        }
        if (param3 && this._buttonFullScreen) {
            _loc7_ = new MovieClip();
            _loc7_.addChild(this._buttonFullScreen);
            _loc7_.addEventListener(MouseEvent.CLICK, this.BtnFullScreen.bind(this));
            _loc7_.buttonMode = true;
            this._frameMC.addChild(_loc7_);
        }
        
        if (this.parent) {
            this._frameDO = this.parent.addChild(this._frameMC);
            const _loc8_: number = this.parent.getChildIndex(this);
            this.parent.setChildIndex(this._frameDO, _loc8_);
            this._backgroundDO = this.parent.addChild(this._backgroundMC);
            this.parent.setChildIndex(this._backgroundDO, param6);
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
        if (this._topMiddle && this._topMiddle.bitmapData) {
            this._topMiddle.bitmapData.dispose();
            this._topMiddle.bitmapData = null as any;
        }
        if (this._bottomMiddle && this._bottomMiddle.bitmapData) {
            this._bottomMiddle.bitmapData.dispose();
            this._bottomMiddle.bitmapData = null as any;
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
        if (this._buttonFullScreen && this._buttonFullScreen.bitmapData) {
            this._buttonFullScreen.bitmapData.dispose();
            this._buttonFullScreen.bitmapData = null as any;
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
        } else {
            getPOPUPS().Next();
        }
    }

    private BtnHelp(param1: MouseEvent | null = null): void {
        if (this.parent && 'Help' in this.parent) {
            (this.parent as any).Help();
        }
    }

    private BtnFullScreen(param1: MouseEvent | null = null): void {
        getGLOBAL().goFullScreen();
        if (this.parent && 'FullScreen' in this.parent) {
            (this.parent as any).FullScreen();
        }
    }
}
