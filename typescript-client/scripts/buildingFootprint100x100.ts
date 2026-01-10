import { MovieClip } from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="buildingFootprint100x100")]
@Embed({ source: "/_assets/assets.swf", symbol: "buildingFootprint100x100" })
export class buildingFootprint100x100 extends MovieClip {
    constructor() {
        super();
    }
}
