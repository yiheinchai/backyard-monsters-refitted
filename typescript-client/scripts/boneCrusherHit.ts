import MovieClip from 'openfl/display/MovieClip';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="boneCrusherHit")]

@Embed({ source: "/_assets/assets.swf", symbol: "boneCrusherHit" })
export class boneCrusherHit extends MovieClip {
    constructor() {
        super();
    }
}
