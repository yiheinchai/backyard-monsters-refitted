import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="cannonTowerHit")]
@Embed({ source: "/_assets/assets.swf", symbol: "cannonTowerHit" })
export class cannonTowerHit extends MovieClip {
    constructor() {
        super();
    }
}
