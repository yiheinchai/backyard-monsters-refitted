import { MovieClip } from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="building3hit")]
@Embed({ source: "/_assets/assets.swf", symbol: "building3hit" })
export class building3hit extends MovieClip {
    constructor() {
        super();
    }
}
