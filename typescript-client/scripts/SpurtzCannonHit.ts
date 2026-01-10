import { MovieClip } from 'openfl/display/MovieClip';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="SpurtzCannonHit")]
@Embed({ source: "/_assets/assets.swf", symbol: "SpurtzCannonHit" })
export class SpurtzCannonHit extends MovieClip {
    constructor() {
        super();
    }
}
