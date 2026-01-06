import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';

/**
 * BasePlannerPopup_ExplorerItem_Type - Explorer type item for base planner
 * Converted from ActionScript to TypeScript
 */
export class BasePlannerPopup_ExplorerItem_Type extends MovieClip {
    public tLabel: TextField;
    public mcFrame: MovieClip;
    public mcLevel: MovieClip;

    constructor() {
        super();
        this.tLabel = new TextField();
        this.mcFrame = new MovieClip();
        this.mcLevel = new MovieClip();
    }
}
