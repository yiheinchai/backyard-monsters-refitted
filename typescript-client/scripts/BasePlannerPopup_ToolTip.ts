import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';

/**
 * BasePlannerPopup_ToolTip - Tooltip for base planner popup
 * Converted from ActionScript to TypeScript
 */
export class BasePlannerPopup_ToolTip extends MovieClip {
    public mcBG: MovieClip;
    public tLabel: TextField;

    constructor() {
        super();
        this.mcBG = new MovieClip();
        this.tLabel = new TextField();
    }
}
