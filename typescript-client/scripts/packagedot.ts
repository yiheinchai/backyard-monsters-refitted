import { MovieClip } from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="packagedot")]
@Embed({ source: "/_assets/assets.swf", symbol: "packagedot" })
export class packagedot extends MovieClip {
    constructor() {
        super();
    }
}
