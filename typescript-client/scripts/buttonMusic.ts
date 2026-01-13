import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="buttonMusic")]
@Embed({ source: "/_assets/assets.swf", symbol: "buttonMusic" })
export class buttonMusic extends MovieClip {
    constructor() {
        super();
    }
}
