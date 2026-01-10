import { MovieClip } from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="infernoAcademyHit")]
@Embed({ source: "/_assets/assets.swf", symbol: "infernoAcademyHit" })
export class infernoAcademyHit extends MovieClip {
    constructor() {
        super();
    }
}
