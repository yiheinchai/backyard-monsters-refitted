import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { frame_CLIP } from './frame_CLIP';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="BasePlannerTransfer_CLIP")]

/**
 * BasePlannerTransfer_CLIP - Transfer CLIP for base planner
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "BasePlannerTransfer_CLIP" })
export class BasePlannerTransfer_CLIP extends MovieClip {
    public tTitle: TextField;
    public mcRowContainer: MovieClip;
    public mcFrame: frame_CLIP;

    constructor() {
        super();
        this.tTitle = new TextField();
        this.mcRowContainer = new MovieClip();
        this.mcFrame = new frame_CLIP();
    }
}
