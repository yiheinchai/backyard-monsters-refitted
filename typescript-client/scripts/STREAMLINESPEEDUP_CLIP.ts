import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { frame_CLIP } from './frame_CLIP';

/**
 * STREAMLINESPEEDUP_CLIP - Streamline speedup clip
 * Contains UI elements for streamline speedup display
 * Converted from ActionScript to TypeScript
 */
export class STREAMLINESPEEDUP_CLIP extends MovieClip {
    public mcBG!: frame_CLIP;
    public mcStoreIcon!: MovieClip;
    public mcInstant!: MovieClip;
    public tTitle!: TextField;
    public tDescription!: TextField;

    constructor() {
        super();
    }
}
