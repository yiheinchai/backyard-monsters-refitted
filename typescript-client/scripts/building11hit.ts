import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="building11hit")]
@Embed({ source: "/_assets/assets.swf", symbol: "building11hit" })
export class building11hit extends MovieClip {
    constructor() {
        super();
    }
}
