import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';

// [Embed(source="/_assets/assets.swf", symbol="MonsterTransferBar")]
export class MonsterTransferBar extends MovieClip {
    public t1: TextField;
    public b1a: Button_CLIP;
    public r1: TextField;
    public b1b: Button_CLIP;

    constructor() {
        super();
    }
}
