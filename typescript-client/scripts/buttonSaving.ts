import MovieClip from 'openfl/display/MovieClip';
import MouseEvent from 'openfl/events/MouseEvent';
import Event from 'openfl/events/Event';
import TextFieldAutoSize from 'openfl/text/TextFieldAutoSize';
import { bubblepopup5 } from './bubblepopup5';
import { KEYS } from './KEYS';

/**
 * buttonSaving - Saving indicator button
 * Shows saving status tooltip
 * Converted from ActionScript to TypeScript
 */
export class buttonSaving extends MovieClip {
    private _bubble!: bubblepopup5;

    constructor() {
        super();
        this.addEventListener(MouseEvent.MOUSE_OVER, this.Over.bind(this));
        this.addEventListener(MouseEvent.MOUSE_OUT, this.Out.bind(this));
        this.addEventListener(Event.ENTER_FRAME, this.Tick.bind(this));
        this.buttonMode = true;
    }

    private Over(param1: MouseEvent | null = null): void {
        this.Out();
        this._bubble = new bubblepopup5();
        this._bubble.x = 12;
        this._bubble.y = 20;
        this._bubble.mcText.autoSize = TextFieldAutoSize.LEFT;
        this._bubble.mouseChildren = false;
        this._bubble.mouseEnabled = false;
        if (this.currentFrame == 2) {
            this._bubble.mcText.htmlText = "<b>" + KEYS.Get("settings_saving") + "</b>";
        } else {
            this._bubble.mcText.htmlText = "<b>" + KEYS.Get("settings_saved") + "</b>";
        }
        this._bubble.mcText.x = 10 - this._bubble.mcText.width;
        this._bubble.mcBG.x = this._bubble.mcText.x - 5;
        this._bubble.mcBG.width = this._bubble.mcText.width + 10;
        this.addChild(this._bubble);
    }

    private Tick(param1: Event): void {
        if (this._bubble && this._bubble.parent) {
            if (this.currentFrame == 2) {
                this._bubble.mcText.htmlText = "<b>" + KEYS.Get("settings_saving") + "</b>";
            } else {
                this._bubble.mcText.htmlText = "<b>" + KEYS.Get("settings_saved") + "</b>";
            }
        }
    }

    private Out(param1: MouseEvent | null = null): void {
        if (this._bubble && this._bubble.parent) {
            this._bubble.parent.removeChild(this._bubble);
        }
    }
}
