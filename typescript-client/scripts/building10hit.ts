import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="building10hit")]
@Embed({ source: "/_assets/assets.swf", symbol: "building10hit" })
export class building10hit extends MovieClip {
    constructor() {
        super();
    }
}
