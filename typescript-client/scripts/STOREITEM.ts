import MovieClip from "openfl/display/MovieClip";
import TextField from "openfl/text/TextField";
import { Button_CLIP } from "./Button_CLIP";
import { store_icon_CLIP } from "./store_icon_CLIP";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="STOREITEM")]
@Embed({ source: "/_assets/assets.swf", symbol: "STOREITEM" })
export class STOREITEM extends MovieClip {
    public tA: TextField;
    public tB: TextField;
    public tC: TextField;
    public bBuy: Button_CLIP;
    public mcIcon: store_icon_CLIP;
    public mcScreen: MovieClip;

    constructor() {
        super();
    }
}
