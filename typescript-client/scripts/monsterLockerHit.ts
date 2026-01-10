import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="monsterLockerHit")]
@Embed({ source: "/_assets/assets.swf", symbol: "monsterLockerHit" })
export class monsterLockerHit extends MovieClip {
    constructor() {
        super();
    }
}
