import { MovieClip } from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="map_descent_bg")]
@Embed({ source: "/_assets/assets.swf", symbol: "map_descent_bg" })
export class map_descent_bg extends MovieClip {
    constructor() {
        super();
    }
}
