import { MovieClip } from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="button_buildings")]
@Embed({ source: "/_assets/assets.swf", symbol: "button_buildings" })
export class button_buildings extends MovieClip {
    constructor() {
        super();
    }
}
