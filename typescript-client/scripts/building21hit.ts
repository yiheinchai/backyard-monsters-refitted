import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="building21hit")]
@Embed({ source: "/_assets/assets.swf", symbol: "building21hit" })
export class building21hit extends MovieClip {
    constructor() {
        super();
    }
}
