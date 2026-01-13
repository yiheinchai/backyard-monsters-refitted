import MovieClip from 'openfl/display/MovieClip';
import { BasePlannerPopup_ExplorerCanvas } from './BasePlannerPopup_ExplorerCanvas';
import { BasePlannerPopup_ExplorerFrame } from './BasePlannerPopup_ExplorerFrame';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="BasePlannerPopup_ExplorerContainer")]

/**
 * BasePlannerPopup_ExplorerContainer - Explorer container for base planner
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "BasePlannerPopup_ExplorerContainer" })
export class BasePlannerPopup_ExplorerContainer extends MovieClip {
    public canvasmask: BasePlannerPopup_ExplorerCanvas;
    public bg: BasePlannerPopup_ExplorerCanvas;
    public mcScroller: MovieClip;
    public canvas: MovieClip;
    public mcframe: BasePlannerPopup_ExplorerFrame;

    constructor() {
        super();
        this.canvasmask = new BasePlannerPopup_ExplorerCanvas();
        this.bg = new BasePlannerPopup_ExplorerCanvas();
        this.mcScroller = new MovieClip();
        this.canvas = new MovieClip();
        this.mcframe = new BasePlannerPopup_ExplorerFrame();
    }
}
