import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="buildinggnomehit")]
@Embed({ source: "/_assets/assets.swf", symbol: "buildinggnomehit" })
export class buildinggnomehit extends MovieClip {
    constructor() {
        super();
    }
}
