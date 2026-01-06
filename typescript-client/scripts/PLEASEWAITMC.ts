import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { frame2_CLIP } from './frame2_CLIP';

// [Embed(source="/_assets/assets.swf", symbol="PLEASEWAITMC")]
export class PLEASEWAITMC extends MovieClip {
    public mcFrame: frame2_CLIP;
    public tMessage: TextField;

    constructor() {
        super();
    }
}
