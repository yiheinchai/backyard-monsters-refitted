```
import MovieClip from 'openfl/display/MovieClip';
import DisplayObject from 'openfl/display/DisplayObject';
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
import { GLOBAL } from './GLOBAL';
import { POPUPS } from './POPUPS';

export class frame1 extends MovieClip {
    private _bottomLeft: DisplayObject | null = null;
    private _bottomRight: DisplayObject | null = null;
    private _topLeft: DisplayObject | null = null;
    private _topRight: DisplayObject | null = null;
    private _topMiddle: DisplayObject | null = null;
    private _bottomMiddle: DisplayObject | null = null;
    private _fillerLeft: DisplayObject | null = null;
    private _fillerRight: DisplayObject | null = null;
    private _fillerTop: DisplayObject | null = null;
    private _fillerBottom: DisplayObject | null = null;
    private _buttonClose: DisplayObject | null = null;
    private _buttonHelp: DisplayObject | null = null;
    private _buttonFullScreen: DisplayObject | null = null;
    private _background: DisplayObject | null = null;
    private _frameMC: MovieClip;
    private _frameDO: DisplayObject | null = null;
    private _backgroundMC: MovieClip;
    private _backgroundDO: DisplayObject | null = null;

    constructor() {
        super();
        this._frameMC = new MovieClip();
        this._backgroundMC = new MovieClip();
        this.Setup(true, false, false);
    }

    public Setup(param1: boolean = true, param2: boolean = false, param3: boolean = false, param4: number = 1, param5: number = 1, param6: number = 0): void {
        let _loc7_: MovieClip;
        this.Clear();

        this._bottomLeft = new frame1_bottom_left();
        this._bottomRight = new frame1_bottom_right();
        this._topLeft = new frame1_top_left();
        this._topRight = new frame1_top_right();

        if (param4 == 1) {
            this._topMiddle = new frame1_top_middle();
        }
        if (param4 == 2) {
            this._topMiddle = new frame1_top_middle_2();
        }
        this._bottomMiddle = new frame1_bottom_middle();
        this._fillerTop = new frame1_filler_top();
        this._fillerLeft = new frame1_filler_left();
        this._fillerRight = new frame1_filler_right();
        this._fillerBottom = new frame1_filler_bottom();

        if (param1) {
            this._buttonClose = new frame1_button_close();
        }
        if (param2) {
            this._buttonHelp = new frame1_button_help();
        }
        if (param3) {
            this._buttonFullScreen = new frame1_button_fullscreen();
        }

        // Positioning logic adapted from AS
        if (this._topRight) {
             this._topRight.x = this.x + this.width - 123 + 10;
             this._topRight.y = this.y - 8;
        }
        if(this._topLeft) {
            this._topLeft.x = this.x - 12;
            this._topLeft.y = this.y - 10;
        }
        if(this._bottomLeft) {
            this._bottomLeft.x = this.x - 8;
            this._bottomLeft.y = this.y + this.height - 64 + 15;
        }
        if (this._bottomRight) {
            this._bottomRight.x = this.x + this.width - 112 + 12;
            this._bottomRight.y = this.y + this.height - 158 + 12;
        }

        if (this._topMiddle) {
            this._topMiddle.x = this.x + Math.floor(this.width * 0.5) - 140;
            if (param4 == 1) {
                this._topMiddle.y = this.y - 11;
            }
            if (param4 == 2) {
                this._topMiddle.y = this.y - 15;
            }
        }

        if (this._bottomMiddle) {
             this._bottomMiddle.x = this.x + Math.floor(this.width * 0.5) - 195;
             this._bottomMiddle.y = this.y + this.height - 14;
        }
       
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

        if(this._fillerTop) {
            this._fillerTop.x = this.x + 42;
            this._fillerTop.y = this.y - 5;
            this._fillerTop.width = this.width - 153;
        }
        if(this._fillerLeft) {
            this._fillerLeft.x = this.x - 4;
            this._fillerLeft.y = this.y + 172;
            this._fillerLeft.height = this.height - 219;
        }
        if(this._fillerRight) {
            this._fillerRight.x = this.x + this.width - 14;
            this._fillerRight.y = this.y + 39;
            this._fillerRight.height = this.height - 158;
        }
        if(this._fillerBottom) {
            this._fillerBottom.x = this.x + 50;
            this._fillerBottom.y = this.y + this.height - 10;
            this._fillerBottom.width = this.width - 100;
        }

        this._frameMC = new MovieClip();
        this._frameMC.mouseEnabled = false;
        
        if (this._fillerTop) this._frameMC.addChild(this._fillerTop);
        if (this.height - 219 > 0 && this._fillerLeft) {
            this._frameMC.addChild(this._fillerLeft);
        }
        if (this.height - 216 > 0 && this._fillerRight) {
            this._frameMC.addChild(this._fillerRight);
        }
        if (this._fillerBottom) this._frameMC.addChild(this._fillerBottom);
        if (this._bottomLeft) this._frameMC.addChild(this._bottomLeft);
        if (this._bottomRight) this._frameMC.addChild(this._bottomRight);
        if (this._topLeft) this._frameMC.addChild(this._topLeft);
        if (this._topRight) this._frameMC.addChild(this._topRight);

        if (param4 > 0 && this._topMiddle) {
            this._frameMC.addChild(this._topMiddle);
        }
        if (param5 > 0 && this._bottomMiddle) {
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
            let _loc8_: number = this.parent.getChildIndex(this);
            this.parent.setChildIndex(this._frameDO, _loc8_);
            
            this._backgroundDO = this.parent.addChild(this._backgroundMC);
            this.parent.setChildIndex(this._backgroundDO, param6);
        }
        
        this.visible = false;
    }

    public Clear(): void {
        // Since we are using DisplayObjects (MovieClips) not Bitmaps, simply nulling them out or removing from display list is enough for garbage collection usually.
        // We do not have bitmapData.dispose() on MovieClips.
        
        this._bottomLeft = null;
        this._bottomRight = null;
        this._topLeft = null;
        this._topRight = null;
        this._topMiddle = null;
        this._bottomMiddle = null;
        this._fillerTop = null;
        this._fillerLeft = null;
        this._fillerRight = null;
        this._fillerBottom = null;
        this._background = null;
        this._buttonClose = null;
        this._buttonHelp = null;
        this._buttonFullScreen = null;

        try {
            if (this._frameDO && this._frameDO.parent) {
                this._frameDO.parent.removeChild(this._frameDO);
            }
            if (this._backgroundDO && this._backgroundDO.parent) {
                this._backgroundDO.parent.removeChild(this._backgroundDO);
            }
        } catch (e) {
        }
    }

    private BtnClose(param1: MouseEvent | null = null): void {
        if (this.parent && (this.parent as any)["Hide"]) {
            (this.parent as any).Hide();
        } else {
            POPUPS.Next();
        }
    }

    private BtnHelp(param1: MouseEvent | null = null): void {
        if (this.parent && (this.parent as any)["Help"]) {
            (this.parent as any).Help();
        }
    }

    private BtnFullScreen(param1: MouseEvent | null = null): void {
        GLOBAL.goFullScreen();
        if (this.parent && (this.parent as any)["FullScreen"]) {
            (this.parent as any).FullScreen();
        }
    }
}
