import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="magmaProducerHit")]
@Embed({ source: "/_assets/assets.swf", symbol: "magmaProducerHit" })
export class magmaProducerHit extends MovieClip {
    constructor() {
        super();
    }
}
