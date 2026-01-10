import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
//    [Embed(source="/_assets/assets.swf", symbol="bubble_selecttarget")]

export class bubble_selecttarget extends MovieClip {
    public bCancel: Button_CLIP;
    public tDesc: TextField;

    constructor() {
        super();
    }
}
