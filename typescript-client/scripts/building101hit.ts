import { MovieClip } from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="building101hit")]
@Embed({ source: "/_assets/assets.swf", symbol: "building101hit" })
export class building101hit extends MovieClip {
    constructor() {
        super();
    }
}
