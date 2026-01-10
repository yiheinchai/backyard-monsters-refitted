import { MovieClip } from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="building8hit")]
@Embed({ source: "/_assets/assets.swf", symbol: "building8hit" })
export class building8hit extends MovieClip {
    constructor() {
        super();
    }
}
