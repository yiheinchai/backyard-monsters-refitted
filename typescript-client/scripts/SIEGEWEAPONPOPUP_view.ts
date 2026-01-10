import { MovieClip } from "openfl/display/MovieClip";
import { TextField } from "openfl/text/TextField";
import { Button_CLIP } from "./Button_CLIP";
import { changeCatapultBtn } from "./changeCatapultBtn";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="SIEGEWEAPONPOPUP_view")]
@Embed({ source: "/_assets/assets.swf", symbol: "SIEGEWEAPONPOPUP_view" })
export class SIEGEWEAPONPOPUP_view extends MovieClip {
    public _bFire: Button_CLIP;
    public timeLeftMC: MovieClip;
    public txtName: TextField;
    public _bOpen: changeCatapultBtn;
    public _image: MovieClip;
    public _iconbg: MovieClip;
    public _bar: MovieClip;

    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    frame1(): void {
        this.stop();
    }
}
