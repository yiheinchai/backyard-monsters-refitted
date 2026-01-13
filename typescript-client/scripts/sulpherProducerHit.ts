import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="sulpherProducerHit")]
@Embed({ source: "/_assets/assets.swf", symbol: "sulpherProducerHit" })
export class sulpherProducerHit extends MovieClip {
    constructor() {
        super();
    }
}
