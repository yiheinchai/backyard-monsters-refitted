import { MovieClip } from 'openfl/display/MovieClip';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="RAILGUNPROJECTILE_CLIP")]
@Embed({ source: "/_assets/assets.swf", symbol: "RAILGUNPROJECTILE_CLIP" })
export class RAILGUNPROJECTILE_CLIP extends MovieClip {
    constructor() {
        super();
    }
}
