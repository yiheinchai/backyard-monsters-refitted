import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="siegeLabHit")]
@Embed({ source: "/_assets/assets.swf", symbol: "siegeLabHit" })
export class siegeLabHit extends MovieClip {
    constructor() {
        super();
    }
}
