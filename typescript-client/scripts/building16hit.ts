import { MovieClip } from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="building16hit")]
@Embed({ source: "/_assets/assets.swf", symbol: "building16hit" })
export class building16hit extends MovieClip {
    constructor() {
        super();
    }
}
