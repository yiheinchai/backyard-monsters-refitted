import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="building110hit")]
@Embed({ source: "/_assets/assets.swf", symbol: "building110hit" })
export class building110hit extends MovieClip {
    constructor() {
        super();
    }
}
