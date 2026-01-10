import MovieClip from "openfl/display/MovieClip";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="plannerBuildingSquare")]
@Embed({ source: "/_assets/assets.swf", symbol: "plannerBuildingSquare" })
export class plannerBuildingSquare extends MovieClip {
    public mcBlocked: MovieClip;
    public mcOver: MovieClip;

    constructor() {
        super();
    }
}
