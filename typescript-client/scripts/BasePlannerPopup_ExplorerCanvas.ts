import MovieClip from 'openfl/display/MovieClip';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="BasePlannerPopup_ExplorerCanvas")]

/**
 * BasePlannerPopup_ExplorerCanvas - Explorer canvas for base planner popup
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "BasePlannerPopup_ExplorerCanvas" })
export class BasePlannerPopup_ExplorerCanvas extends MovieClip {
    public mcMask: MovieClip;
    public mcCanvas: MovieClip;

    constructor() {
        super();
        this.mcMask = new MovieClip();
        this.mcCanvas = new MovieClip();
    }
}
