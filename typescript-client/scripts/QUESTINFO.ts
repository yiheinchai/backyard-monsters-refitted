import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { icon_costs_short } from './icon_costs_short';
import { Button_CLIP } from './Button_CLIP';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="QUESTINFO")]
@Embed({ source: "/_assets/assets.swf", symbol: "QUESTINFO" })
export class QUESTINFO extends MovieClip {
    public mcArrow: MovieClip;
    public R1: icon_costs_short;
    public R2: icon_costs_short;
    public tHint: TextField;
    public R3: icon_costs_short;
    public R4: icon_costs_short;
    public bCollect: Button_CLIP;
    public R5: icon_costs_short;
    public mcImage: MovieClip;
    public tReward: TextField;
    public tDescription: TextField;

    constructor() {
        super();
    }
}
