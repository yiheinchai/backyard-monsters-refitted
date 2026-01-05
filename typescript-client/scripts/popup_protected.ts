import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { frame_CLIP } from './frame_CLIP';

export class popup_protected extends MovieClip {
    public tA!: TextField;
    public tB!: TextField;
    public mcImage!: MovieClip;
    public mcFrame!: frame_CLIP;

    constructor() {
        super();
    }
}
