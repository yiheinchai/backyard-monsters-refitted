import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="mc_buildingalerticon")]
@Embed({ source: "/_assets/assets.swf", symbol: "mc_buildingalerticon" })
export class mc_buildingalerticon extends MovieClip {
    constructor() {
        super();
    }
}
