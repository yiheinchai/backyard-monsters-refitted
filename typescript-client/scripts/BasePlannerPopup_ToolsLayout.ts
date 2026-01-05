import MovieClip from 'openfl/display/MovieClip';
import { BasePlannerPopup_ToolsButton_Store } from './BasePlannerPopup_ToolsButton_Store';
import { BasePlannerPopup_ToolsButton_Move } from './BasePlannerPopup_ToolsButton_Move';

/**
 * BasePlannerPopup_ToolsLayout - Base UI clip class for Base Planner Tools Layout
 * Contains all UI element declarations for the tools bar
 * Converted from ActionScript to TypeScript
 */
export class BasePlannerPopup_ToolsLayout extends MovieClip {
    public mcBG!: MovieClip;
    public mcExpand!: MovieClip;
    public mcStore!: BasePlannerPopup_ToolsButton_Store;
    public mcSelectMove!: BasePlannerPopup_ToolsButton_Move;

    constructor() {
        super();
    }
}
