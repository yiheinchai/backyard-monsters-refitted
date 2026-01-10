import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="siloHit")]
@Embed({ source: "/_assets/assets.swf", symbol: "siloHit" })
export class siloHit extends MovieClip {
    constructor() {
        super();
    }
}
