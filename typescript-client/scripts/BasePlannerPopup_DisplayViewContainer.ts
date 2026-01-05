import MovieClip from 'openfl/display/MovieClip';
import { BasePlanner_FrameMask } from './BasePlanner_FrameMask';

/**
 * BasePlannerPopup_DisplayViewContainer - Base UI clip class for Base Planner Display View Container
 * Contains all UI element declarations for the main display view
 * Converted from ActionScript to TypeScript
 */
export class BasePlannerPopup_DisplayViewContainer extends MovieClip {
    public canvasmask!: MovieClip;
    public mcframemask!: BasePlanner_FrameMask;
    public canvas!: MovieClip;
    public mcframe!: MovieClip;

    constructor() {
        super();
    }
}
