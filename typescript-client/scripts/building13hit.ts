import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="building13hit")]
@Embed({ source: "/_assets/assets.swf", symbol: "building13hit" })
export class building13hit extends MovieClip {
    constructor() {
        super();
    }
}
