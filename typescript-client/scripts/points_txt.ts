import MovieClip from "openfl/display/MovieClip";
import TextField from "openfl/text/TextField";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="points_txt")]
@Embed({ source: "/_assets/assets.swf", symbol: "points_txt" })
export class points_txt extends MovieClip {
    public txt: TextField;

    constructor() {
        super();
    }
}
