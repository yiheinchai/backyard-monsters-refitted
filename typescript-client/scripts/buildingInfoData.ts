import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="buildingInfoData")]
@Embed({ source: "/_assets/assets.swf", symbol: "buildingInfoData" })
export class buildingInfoData extends MovieClip {
    constructor() {
        super();
    }
}
