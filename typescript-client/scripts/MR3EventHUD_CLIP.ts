import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';

// [Embed(source="/_assets/assets.swf", symbol="MR3EventHUD_CLIP")]
export class MR3EventHUD_CLIP extends MovieClip {
    public mcTitle: MovieClip;
    public bInfo: Button_CLIP;
    public tExperience: TextField;
    public mcInfo: MovieClip;
    public tCountdown: TextField;
    public mcReward: MovieClip;

    constructor() {
        super();
    }
}
