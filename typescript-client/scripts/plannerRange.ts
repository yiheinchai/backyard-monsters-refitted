import { MovieClip } from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="plannerRange")]
@Embed({ source: "/_assets/assets.swf", symbol: "plannerRange" })
export class plannerRange extends MovieClip {
    constructor() {
        super();
    }
}
