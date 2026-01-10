import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="building99hit")]
@Embed({ source: "/_assets/assets.swf", symbol: "building99hit" })
export class building99hit extends MovieClip {
    constructor() {
        super();
    }
}
