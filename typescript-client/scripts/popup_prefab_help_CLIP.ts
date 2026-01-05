import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { frame_CLIP } from './frame_CLIP';

/**
 * popup_prefab_help_CLIP - Base CLIP class for popup prefab help
 * Converted from ActionScript to TypeScript
 * 
 * Original: [Embed(source="/_assets/assets.swf", symbol="popup_prefab_help_CLIP")]
 */
export class popup_prefab_help_CLIP extends MovieClip {
    public b1: Button_CLIP;
    public tTitle: TextField;
    public mcFrame: frame_CLIP;
    public tMessage: TextField;

    constructor() {
        super();
        this.b1 = new Button_CLIP();
        this.tTitle = new TextField();
        this.mcFrame = new frame_CLIP();
        this.tMessage = new TextField();
    }
}
