import MovieClip from 'openfl/display/MovieClip';
import MouseEvent from 'openfl/events/MouseEvent';
import TextFieldAutoSize from 'openfl/text/TextFieldAutoSize';
import { bubblepopup5 } from './bubblepopup5';
import { KEYS } from './KEYS';
import { SOUNDS } from './SOUNDS';

/**
 * buttonSound - Sound toggle button
 * Handles sound muting and unmuting
 * Converted from ActionScript to TypeScript
 */
export class buttonSound extends MovieClip {
    private _bubble!: bubblepopup5;

    constructor() {
        super();
        this.gotoAndStop(1);
        this.addEventListener(MouseEvent.CLICK, this.Click.bind(this));
        this.addEventListener(MouseEvent.MOUSE_OVER, this.Over.bind(this));
        this.addEventListener(MouseEvent.MOUSE_OUT, this.Out.bind(this));
        this.buttonMode = true;
    }

    private Click(param1: MouseEvent): void {
        SOUNDS.Toggle();
        this.Over();
    }

    private Over(param1: MouseEvent | null = null): void {
        this.Out();
        this._bubble = new bubblepopup5();
        this._bubble.x = 12;
        this._bubble.y = 20;
        this._bubble.mcText.autoSize = TextFieldAutoSize.LEFT;
        this._bubble.mouseChildren = false;
        this._bubble.mouseEnabled = false;
        if (SOUNDS._muted) {
            this._bubble.mcText.htmlText = "<b>" + KEYS.Get("settings_soundoff") + "</b>";
        } else {
            this._bubble.mcText.htmlText = "<b>" + KEYS.Get("settings_soundon") + "</b>";
        }
        this._bubble.mcText.x = 10 - this._bubble.mcText.width;
        this._bubble.mcBG.x = this._bubble.mcText.x - 5;
        this._bubble.mcBG.width = this._bubble.mcText.width + 10;
        this.addChild(this._bubble);
    }

    private Out(param1: MouseEvent | null = null): void {
        if (this._bubble && this._bubble.parent) {
            this._bubble.parent.removeChild(this._bubble);
        }
    }
}
