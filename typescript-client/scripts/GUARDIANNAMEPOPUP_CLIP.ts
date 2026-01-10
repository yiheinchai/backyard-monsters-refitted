import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { frame_CLIP } from './frame_CLIP';
import { Button_CLIP } from './Button_CLIP';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="GUARDIANNAMEPOPUP_CLIP")]
@Embed({ source: "/_assets/assets.swf", symbol: "GUARDIANNAMEPOPUP_CLIP" })
export class GUARDIANNAMEPOPUP_CLIP extends MovieClip {
    public mcGuard: MovieClip;
    public mcBG: frame_CLIP;
    public tInput: TextField;
    public tTitle: TextField;
    public tDescription: TextField;
    public bAction: Button_CLIP;

    constructor() {
        super();
    }
}
