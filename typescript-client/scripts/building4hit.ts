import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="building4hit")]
@Embed({ source: "/_assets/assets.swf", symbol: "building4hit" })
export class building4hit extends MovieClip {
    constructor() {
        super();
    }
}
