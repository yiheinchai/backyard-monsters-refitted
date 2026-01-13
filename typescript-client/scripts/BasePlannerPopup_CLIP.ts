import MovieClip from 'openfl/display/MovieClip';
import { BasePlannerPopup_ZoomLayout } from './BasePlannerPopup_ZoomLayout';
import { BasePlannerPopup_ExplorerCanvas } from './BasePlannerPopup_ExplorerCanvas';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="BasePlannerPopup_CLIP")]

/**
 * BasePlannerPopup_CLIP - CLIP class for base planner popup
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "BasePlannerPopup_CLIP" })
export class BasePlannerPopup_CLIP extends MovieClip {
    public guideDisplayView: MovieClip;
    public guideZoom: BasePlannerPopup_ZoomLayout;
    public guideBG: MovieClip;
    public guideSidebar: BasePlannerPopup_ExplorerCanvas;

    constructor() {
        super();
        this.guideDisplayView = new MovieClip();
        this.guideZoom = new BasePlannerPopup_ZoomLayout();
        this.guideBG = new MovieClip();
        this.guideSidebar = new BasePlannerPopup_ExplorerCanvas();
    }
}
