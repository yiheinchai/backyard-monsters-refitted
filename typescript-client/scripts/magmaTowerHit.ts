import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="magmaTowerHit")]
@Embed({ source: "/_assets/assets.swf", symbol: "magmaTowerHit" })
export class magmaTowerHit extends MovieClip {
    constructor() {
        super();
    }
}
