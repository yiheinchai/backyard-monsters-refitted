import MovieClip from 'openfl/display/MovieClip';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="MapRoom3ResourcesDisplay")]
@Embed({ source: "/_assets/assets.swf", symbol: "MapRoom3ResourcesDisplay" })
export class MapRoom3ResourcesDisplay extends MovieClip {
    public resourceDisplay4: MovieClip;
    public resourceDisplay2: MovieClip;
    public resourceDisplay3: MovieClip;
    public resourceDisplay1: MovieClip;

    constructor() {
        super();
    }
}
