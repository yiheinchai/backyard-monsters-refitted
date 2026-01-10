import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="building90hit")]
@Embed({ source: "/_assets/assets.swf", symbol: "building90hit" })
export class building90hit extends MovieClip {
    constructor() {
        super();
    }
}
