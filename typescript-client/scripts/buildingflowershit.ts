import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="buildingflowershit")]
@Embed({ source: "/_assets/assets.swf", symbol: "buildingflowershit" })
export class buildingflowershit extends MovieClip {
    constructor() {
        super();
    }
}
