import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="buildingFootprint30x30")]
@Embed({ source: "/_assets/assets.swf", symbol: "buildingFootprint30x30" })
export class buildingFootprint30x30 extends MovieClip {
    constructor() {
        super();
    }
}
