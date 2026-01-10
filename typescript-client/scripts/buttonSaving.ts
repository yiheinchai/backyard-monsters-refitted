import { MovieClip } from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="buttonSaving")]
@Embed({ source: "/_assets/assets.swf", symbol: "buttonSaving" })
export class buttonSaving extends MovieClip {
    constructor() {
        super();
    }
}
