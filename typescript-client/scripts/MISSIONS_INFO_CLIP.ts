import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { frame_CLIP } from './frame_CLIP';
import { icon_costs_short } from './icon_costs_short';

// [Embed(source="/_assets/assets.swf", symbol="MISSIONS_INFO_CLIP")]
export class MISSIONS_INFO_CLIP extends MovieClip {
    public mcArrow: MovieClip;
    public R1: icon_costs_short;
    public R2: icon_costs_short;
    public tHint: TextField;
    public R3: icon_costs_short;
    public R4: icon_costs_short;
    public bCollect: Button_CLIP;
    public R5: icon_costs_short;
    public mcImage: MovieClip;
    public mcFrame: frame_CLIP;
    public tReward: TextField;
    public tDescription: TextField;

    constructor() {
        super();
    }
}
