import MovieClip from 'openfl/display/MovieClip';
import SimpleButton from 'openfl/display/SimpleButton';
import TextField from 'openfl/text/TextField';

export class FriendPicker_CLIP extends MovieClip {
    public placeholder!: MovieClip;
    public name_txt!: TextField;
    public arrowLine!: MovieClip;
    public hitBtn!: SimpleButton;
    public mask_mc!: MovieClip;
    public arrowBtn!: MovieClip;
    public bg_mc!: MovieClip;
    public photoRing!: MovieClip;

    constructor() {
        super();
    }
}
