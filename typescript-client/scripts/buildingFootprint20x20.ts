import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="buildingFootprint20x20")]
@Embed({ source: "/_assets/assets.swf", symbol: "buildingFootprint20x20" })
export class buildingFootprint20x20 extends MovieClip {
    constructor() {
        super();
    }
}
