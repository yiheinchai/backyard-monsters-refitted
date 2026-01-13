import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="building7hit")]
@Embed({ source: "/_assets/assets.swf", symbol: "building7hit" })
export class building7hit extends MovieClip {
    constructor() {
        super();
    }
}
