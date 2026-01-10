import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="buttonProtection")]
@Embed({ source: "/_assets/assets.swf", symbol: "buttonProtection" })
export class buttonProtection extends MovieClip {
    constructor() {
        super();
    }
}
