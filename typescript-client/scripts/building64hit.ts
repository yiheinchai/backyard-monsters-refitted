import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="building64hit")]
@Embed({ source: "/_assets/assets.swf", symbol: "building64hit" })
export class building64hit extends MovieClip {
    constructor() {
        super();
    }
}
