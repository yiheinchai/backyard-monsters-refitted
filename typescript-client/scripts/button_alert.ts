import { MovieClip } from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="button_alert")]
@Embed({ source: "/_assets/assets.swf", symbol: "button_alert" })
export class button_alert extends MovieClip {
    constructor() {
        super();
    }
}
