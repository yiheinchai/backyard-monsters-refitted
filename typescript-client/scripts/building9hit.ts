import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="building9hit")]
@Embed({ source: "/_assets/assets.swf", symbol: "building9hit" })
export class building9hit extends MovieClip {
    constructor() {
        super();
    }
}
