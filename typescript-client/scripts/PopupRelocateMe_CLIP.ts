import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { frame_CLIP } from './frame_CLIP';
//    [Embed(source="/_assets/assets.swf", symbol="PopupRelocateMe_CLIP")]

/**
 * PopupRelocateMe_CLIP - CLIP class for base relocation popup
 * Converted from ActionScript to TypeScript
 */
export class PopupRelocateMe_CLIP extends MovieClip {
    public mcBG: frame_CLIP;
    public mcInstant: MovieClip;
    public tTitle: TextField;
    public mcResources: MovieClip;
    public tDescription: TextField;

    constructor() {
        super();
        this.mcBG = new frame_CLIP();
        this.mcInstant = new MovieClip();
        this.tTitle = new TextField();
        this.mcResources = new MovieClip();
        this.tDescription = new TextField();
    }
}
