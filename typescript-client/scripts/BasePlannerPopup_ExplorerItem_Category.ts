import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
//    [Embed(source="/_assets/assets.swf", symbol="BasePlannerPopup_ExplorerItem_Category")]

/**
 * BasePlannerPopup_ExplorerItem_Category - Explorer category item for base planner
 * Converted from ActionScript to TypeScript
 */
export class BasePlannerPopup_ExplorerItem_Category extends MovieClip {
    public mcBG: MovieClip;
    public tLabel: TextField;
    public mcCarrot: MovieClip;
    public mcFrame: MovieClip;

    constructor() {
        super();
        this.mcBG = new MovieClip();
        this.tLabel = new TextField();
        this.mcCarrot = new MovieClip();
        this.mcFrame = new MovieClip();
    }
}
