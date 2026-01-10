import { MovieClip } from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="coalProducerHit")]
@Embed({ source: "/_assets/assets.swf", symbol: "coalProducerHit" })
export class coalProducerHit extends MovieClip {
    constructor() {
        super();
    }
}
