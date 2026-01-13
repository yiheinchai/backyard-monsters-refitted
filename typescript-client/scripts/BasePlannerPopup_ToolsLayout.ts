import MovieClip from 'openfl/display/MovieClip';
import { BasePlannerPopup_ToolsButton_Store } from './BasePlannerPopup_ToolsButton_Store';
import { BasePlannerPopup_ToolsButton_Move } from './BasePlannerPopup_ToolsButton_Move';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="BasePlannerPopup_ToolsLayout")]

/**
 * BasePlannerPopup_ToolsLayout - Tools layout for base planner popup
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "BasePlannerPopup_ToolsLayout" })
export class BasePlannerPopup_ToolsLayout extends MovieClip {
    public mcBG: MovieClip;
    public mcExpand: MovieClip;
    public mcStore: BasePlannerPopup_ToolsButton_Store;
    public mcSelectMove: BasePlannerPopup_ToolsButton_Move;

    constructor() {
        super();
        this.mcBG = new MovieClip();
        this.mcExpand = new MovieClip();
        this.mcStore = new BasePlannerPopup_ToolsButton_Store();
        this.mcSelectMove = new BasePlannerPopup_ToolsButton_Move();
    }
}
