import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="building20hit")]
@Embed({ source: "/_assets/assets.swf", symbol: "building20hit" })
export class building20hit extends MovieClip {
    constructor() {
        super();
    }
}
