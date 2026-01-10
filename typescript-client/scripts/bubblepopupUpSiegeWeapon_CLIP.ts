import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="bubblepopupUpSiegeWeapon_CLIP")]
@Embed({ source: "/_assets/assets.swf", symbol: "bubblepopupUpSiegeWeapon_CLIP" })
export class bubblepopupUpSiegeWeapon_CLIP extends MovieClip {
    public mcArrow: MovieClip;
    public mcBG: MovieClip;
    public tBody: TextField;
    public tTitle: TextField;

    constructor() {
        super();
    }
}
