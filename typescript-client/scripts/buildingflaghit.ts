import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="buildingflaghit")]
@Embed({ source: "/_assets/assets.swf", symbol: "buildingflaghit" })
export class buildingflaghit extends MovieClip {
    constructor() {
        super();
    }
}
