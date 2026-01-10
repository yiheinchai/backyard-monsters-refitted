import { MovieClip } from 'openfl/display/MovieClip';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="GuardianCage_DNABar")]
@Embed({ source: "/_assets/assets.swf", symbol: "GuardianCage_DNABar" })
export class GuardianCage_DNABar extends MovieClip {
    constructor() {
        super();
    }
}
