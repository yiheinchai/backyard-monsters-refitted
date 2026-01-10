import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="buildingFootprint80x80")]
@Embed({ source: "/_assets/assets.swf", symbol: "buildingFootprint80x80" })
export class buildingFootprint80x80 extends MovieClip {
    constructor() {
        super();
    }
}
