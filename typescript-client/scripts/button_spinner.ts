import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="button_spinner")]
@Embed({ source: "/_assets/assets.swf", symbol: "button_spinner" })
export class button_spinner extends MovieClip {
    constructor() {
        super();
    }
}
