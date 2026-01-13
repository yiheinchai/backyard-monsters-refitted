import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="infernoPortalHit")]
@Embed({ source: "/_assets/assets.swf", symbol: "infernoPortalHit" })
export class infernoPortalHit extends MovieClip {
    constructor() {
        super();
    }
}
