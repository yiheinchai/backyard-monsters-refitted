import { MovieClip } from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="changeCatapultBtn")]
@Embed({ source: "/_assets/assets.swf", symbol: "changeCatapultBtn" })
export class changeCatapultBtn extends MovieClip {
    constructor() {
        super();
    }
}
