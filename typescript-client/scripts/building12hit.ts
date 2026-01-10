import { MovieClip } from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="building12hit")]
@Embed({ source: "/_assets/assets.swf", symbol: "building12hit" })
export class building12hit extends MovieClip {
    constructor() {
        super();
    }
}
