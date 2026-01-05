import MovieClip from 'openfl/display/MovieClip';
import { BasePlannerPopup_ZoomLayout } from './BasePlannerPopup_ZoomLayout';
import { BasePlannerPopup_ExplorerCanvas } from './BasePlannerPopup_ExplorerCanvas';

/**
 * BasePlannerPopup_CLIP - Base UI clip class for Base Planner Popup
 * Contains all UI element declarations for the main popup frame
 * Converted from ActionScript to TypeScript
 */
export class BasePlannerPopup_CLIP extends MovieClip {
    public guideDisplayView!: MovieClip;
    public guideZoom!: BasePlannerPopup_ZoomLayout;
    public guideBG!: MovieClip;
    public guideSidebar!: BasePlannerPopup_ExplorerCanvas;

    constructor() {
        super();
    }
}
