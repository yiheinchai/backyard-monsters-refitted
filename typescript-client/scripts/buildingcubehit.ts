import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="buildingcubehit")]
@Embed({ source: "/_assets/assets.swf", symbol: "buildingcubehit" })
export class buildingcubehit extends MovieClip {
    constructor() {
        super();
    }
}
