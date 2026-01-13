import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="building120hit")]
@Embed({ source: "/_assets/assets.swf", symbol: "building120hit" })
export class building120hit extends MovieClip {
    constructor() {
        super();
    }
}
