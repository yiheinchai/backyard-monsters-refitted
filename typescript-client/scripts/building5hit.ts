import { MovieClip } from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="building5hit")]
@Embed({ source: "/_assets/assets.swf", symbol: "building5hit" })
export class building5hit extends MovieClip {
    constructor() {
        super();
    }
}
