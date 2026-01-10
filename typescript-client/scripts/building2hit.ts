import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="building2hit")]
@Embed({ source: "/_assets/assets.swf", symbol: "building2hit" })
export class building2hit extends MovieClip {
    constructor() {
        super();
    }
}
