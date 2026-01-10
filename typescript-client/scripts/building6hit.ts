import { MovieClip } from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="building6hit")]
@Embed({ source: "/_assets/assets.swf", symbol: "building6hit" })
export class building6hit extends MovieClip {
    constructor() {
        super();
    }
}
