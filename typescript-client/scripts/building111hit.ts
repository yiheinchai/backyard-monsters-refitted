import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="building111hit")]
@Embed({ source: "/_assets/assets.swf", symbol: "building111hit" })
export class building111hit extends MovieClip {
    constructor() {
        super();
    }
}
