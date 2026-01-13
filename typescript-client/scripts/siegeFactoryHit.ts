import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="siegeFactoryHit")]
@Embed({ source: "/_assets/assets.swf", symbol: "siegeFactoryHit" })
export class siegeFactoryHit extends MovieClip {
    constructor() {
        super();
    }
}
