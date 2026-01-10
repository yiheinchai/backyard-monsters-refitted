import { MovieClip } from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="outpostDefenderHit")]
@Embed({ source: "/_assets/assets.swf", symbol: "outpostDefenderHit" })
export class outpostDefenderHit extends MovieClip {
    constructor() {
        super();
    }
}
