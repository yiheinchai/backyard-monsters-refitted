import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="buildingheadhit")]
@Embed({ source: "/_assets/assets.swf", symbol: "buildingheadhit" })
export class buildingheadhit extends MovieClip {
    constructor() {
        super();
    }
}
