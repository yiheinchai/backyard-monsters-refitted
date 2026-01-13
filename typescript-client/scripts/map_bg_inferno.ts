import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="map_bg_inferno")]
@Embed({ source: "/_assets/assets.swf", symbol: "map_bg_inferno" })
export class map_bg_inferno extends MovieClip {
    constructor() {
        super();
    }
}
