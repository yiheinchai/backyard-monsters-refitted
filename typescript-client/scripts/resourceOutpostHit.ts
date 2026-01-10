import { MovieClip } from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="resourceOutpostHit")]
@Embed({ source: "/_assets/assets.swf", symbol: "resourceOutpostHit" })
export class resourceOutpostHit extends MovieClip {
    constructor() {
        super();
    }
}
