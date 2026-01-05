import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { frame_CLIP } from './frame_CLIP';
import { Button_CLIP } from './Button_CLIP';

export class popup_loot extends MovieClip {
    public tA!: TextField;
    public tB!: TextField;
    public mcImage!: MovieClip;
    public mcFrame!: frame_CLIP;
    public bAction!: Button_CLIP;

    constructor() {
        super();
    }
}
