import MovieClip from 'openfl/display/MovieClip';
import MouseEvent from 'openfl/events/MouseEvent';
import TextField from 'openfl/text/TextField';

/**
 * SmallButton - Small button class with hover states
 * Handles button hover and highlight states
 * Converted from ActionScript to TypeScript
 */
export class SmallButton extends MovieClip {
    public label_txt!: TextField;
    private _highlight: boolean = false;

    constructor() {
        super();
        this.stop();
        this.mouseChildren = false;
        this.buttonMode = true;
        this.addEventListener(MouseEvent.MOUSE_OVER, this.Over.bind(this));
        this.addEventListener(MouseEvent.MOUSE_OUT, this.Out.bind(this));
    }

    public set Highlight(param1: boolean) {
        this._highlight = param1;
        if (this._highlight) {
            this.gotoAndStop(3);
        } else {
            this.gotoAndStop(1);
        }
    }

    public get Highlight(): boolean {
        return this._highlight;
    }

    public Over(param1: MouseEvent): void {
        if (this._highlight) {
            this.gotoAndStop(4);
        } else {
            this.gotoAndStop(2);
        }
    }

    public Out(param1: MouseEvent): void {
        if (this._highlight) {
            this.gotoAndStop(3);
        } else {
            this.gotoAndStop(1);
        }
    }
}
