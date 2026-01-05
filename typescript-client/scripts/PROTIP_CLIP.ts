import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { frame_CLIP } from './frame_CLIP';

/**
 * PROTIP_CLIP - Pro tip display CLIP
 * Converted from ActionScript to TypeScript
 * 
 * Original: [Embed(source="/_assets/assets.swf", symbol="PROTIP_CLIP")]
 */
export class PROTIP_CLIP extends MovieClip {
    public tTitle: TextField;
    public tDesc: TextField;
    public mcFrame: frame_CLIP;
    public mcIcon: MovieClip;

    constructor() {
        super();
        this.tTitle = new TextField();
        this.tDesc = new TextField();
        this.mcFrame = new frame_CLIP();
        this.mcIcon = new MovieClip();
    }
}
