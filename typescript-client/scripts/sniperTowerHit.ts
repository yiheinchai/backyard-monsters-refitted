import { MovieClip } from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="sniperTowerHit")]
@Embed({ source: "/_assets/assets.swf", symbol: "sniperTowerHit" })
export class sniperTowerHit extends MovieClip {
    constructor() {
        super();
    }
}
