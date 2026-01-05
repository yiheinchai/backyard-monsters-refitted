import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';

export class PlayerBaseInferno_CLIP extends MovieClip {
    public photoFrame_mc!: MovieClip;
    public nail!: MovieClip;
    public name_txt!: TextField;
    public placeholder!: MovieClip;
    public frame_mc!: MovieClip;
    public box_mc!: MovieClip;

    constructor() {
        super();
    }
}
