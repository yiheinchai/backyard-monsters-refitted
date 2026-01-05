import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';

/**
 * MONSTERLABITEM_CLIP - Monster lab item clip
 * Displays monster items in the lab UI
 * Converted from ActionScript to TypeScript
 */
export class MONSTERLABITEM_CLIP extends MovieClip {
    public mcBG!: MovieClip;
    public tLabel!: TextField;
    public mcIcon!: MovieClip;
    public mcLevel!: MovieClip;

    constructor() {
        super();
    }
}
