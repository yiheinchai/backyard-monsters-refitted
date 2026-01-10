import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="quakeTowerHit")]
@Embed({ source: "/_assets/assets.swf", symbol: "quakeTowerHit" })
export class quakeTowerHit extends MovieClip {
    constructor() {
        super();
    }
}
