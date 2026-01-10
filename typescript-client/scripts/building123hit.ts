import { MovieClip } from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="building123hit")]
@Embed({ source: "/_assets/assets.swf", symbol: "building123hit" })
export class building123hit extends MovieClip {
    constructor() {
        super();
    }
}
