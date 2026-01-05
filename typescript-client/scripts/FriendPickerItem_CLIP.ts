import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';

export class FriendPickerItem_CLIP extends MovieClip {
    public background!: MovieClip;
    public name_txt!: TextField;
    public placeholder!: MovieClip;
    public userid_txt!: TextField;
    public photoRing!: MovieClip;

    constructor() {
        super();
    }
}
