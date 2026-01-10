import MovieClip from 'openfl/display/MovieClip';
import { BasePlanner_FrameMask } from './BasePlanner_FrameMask';
//    [Embed(source="/_assets/assets.swf", symbol="BasePlannerPopup_DisplayViewContainer")]

/**
 * BasePlannerPopup_DisplayViewContainer - Display view container for base planner
 * Converted from ActionScript to TypeScript
 */
export class BasePlannerPopup_DisplayViewContainer extends MovieClip {
    public canvasmask: MovieClip;
    public mcframemask: BasePlanner_FrameMask;
    public canvas: MovieClip;
    public mcframe: MovieClip;

    constructor() {
        super();
        this.canvasmask = new MovieClip();
        this.mcframemask = new BasePlanner_FrameMask();
        this.canvas = new MovieClip();
        this.mcframe = new MovieClip();
    }
}
