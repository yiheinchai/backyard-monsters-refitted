import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { frame_CLIP } from './frame_CLIP';

/**
 * PROTIP_CLIP - Pro tip display clip
 * Displays pro tips with title and description
 * Converted from ActionScript to TypeScript
 */
export class PROTIP_CLIP extends MovieClip {
    public tTitle!: TextField;
    public tDesc!: TextField;
    public mcFrame!: frame_CLIP;
    public mcIcon!: MovieClip;

    constructor() {
        super();
    }
}
