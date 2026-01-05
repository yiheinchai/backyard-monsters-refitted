import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { popup_bg } from './popup_bg';
import { frame_CLIP } from './frame_CLIP';
import { Button_CLIP } from './Button_CLIP';

/**
 * popup_error - Error popup display class
 * Converted from ActionScript to TypeScript
 * 
 * Original: [Embed(source="/_assets/assets.swf", symbol="popup_error")]
 */
export class popup_error extends MovieClip {
    public blocker: popup_bg;
    public tA: TextField;
    public tB: TextField;
    public mcFrame: frame_CLIP;
    public bAction: Button_CLIP;

    constructor() {
        super();
        this.blocker = new popup_bg();
        this.tA = new TextField();
        this.tB = new TextField();
        this.mcFrame = new frame_CLIP();
        this.bAction = new Button_CLIP();
    }
}
