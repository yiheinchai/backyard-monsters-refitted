import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { frame_CLIP } from './frame_CLIP';

/**
 * MESSAGE_CLIP - Message popup CLIP
 * Converted from ActionScript to TypeScript
 * 
 * Original: [Embed(source="/_assets/assets.swf", symbol="MESSAGE_CLIP")]
 */
export class MESSAGE_CLIP extends MovieClip {
    public bAction2: Button_CLIP;
    public mcBG: frame_CLIP;
    public bAction: Button_CLIP;
    public tMessage: TextField;

    constructor() {
        super();
        this.bAction2 = new Button_CLIP();
        this.mcBG = new frame_CLIP();
        this.bAction = new Button_CLIP();
        this.tMessage = new TextField();
    }
}
