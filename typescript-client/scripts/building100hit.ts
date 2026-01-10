import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="building100hit")]
@Embed({ source: "/_assets/assets.swf", symbol: "building100hit" })
export class building100hit extends MovieClip {
    constructor() {
        super();
    }
}
