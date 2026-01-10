import { MovieClip } from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="buttonSound")]
@Embed({ source: "/_assets/assets.swf", symbol: "buttonSound" })
export class buttonSound extends MovieClip {
    constructor() {
        super();
    }
}
