import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';

export class guardianselect_selectportrait_CLIP extends MovieClip {
    public bSelectBG!: MovieClip;
    public tGuard_label!: TextField;
    public mcImage!: MovieClip;
    public tGuard_desc!: TextField;
    public bAction!: Button_CLIP;

    constructor() {
        super();
    }
}
