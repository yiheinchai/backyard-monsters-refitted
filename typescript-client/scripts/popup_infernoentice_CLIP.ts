import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { frame3_CLIP } from './frame3_CLIP';

/**
 * popup_infernoentice_CLIP - CLIP class for inferno entice popup
 * Converted from ActionScript to TypeScript
 */
export class popup_infernoentice_CLIP extends MovieClip {
    public tDesc: TextField;
    public tButton: TextField;
    public bEnter: Button_CLIP;
    public mcFrame: frame3_CLIP;

    constructor() {
        super();
        this.tDesc = new TextField();
        this.tButton = new TextField();
        this.bEnter = new Button_CLIP();
        this.mcFrame = new frame3_CLIP();
    }
}
