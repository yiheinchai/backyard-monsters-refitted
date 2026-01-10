import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { frame_CLIP } from './frame_CLIP';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="popup_attackend_CLIP")]

/**
 * popup_attackend_CLIP - CLIP class for attack end popup
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "popup_attackend_CLIP" })
export class popup_attackend_CLIP extends MovieClip {
    public tTitle: TextField;
    public mcFrame: frame_CLIP;
    public tProcessing: TextField;
    public bAction: Button_CLIP;
    public tMessage: TextField;

    constructor() {
        super();
        this.tTitle = new TextField();
        this.mcFrame = new frame_CLIP();
        this.tProcessing = new TextField();
        this.bAction = new Button_CLIP();
        this.tMessage = new TextField();
    }
}
