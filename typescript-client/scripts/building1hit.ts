import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="building1hit")]
@Embed({ source: "/_assets/assets.swf", symbol: "building1hit" })
export class building1hit extends MovieClip {
    constructor() {
        super();
    }
}
