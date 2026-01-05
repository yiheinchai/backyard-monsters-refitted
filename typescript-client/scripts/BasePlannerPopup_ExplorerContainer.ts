import MovieClip from 'openfl/display/MovieClip';
import { BasePlannerPopup_ExplorerCanvas } from './BasePlannerPopup_ExplorerCanvas';
import { BasePlannerPopup_ExplorerFrame } from './BasePlannerPopup_ExplorerFrame';

/**
 * BasePlannerPopup_ExplorerContainer - Base UI clip class for Base Planner Explorer Container
 * Contains all UI element declarations for the explorer container
 * Converted from ActionScript to TypeScript
 */
export class BasePlannerPopup_ExplorerContainer extends MovieClip {
    public canvasmask!: BasePlannerPopup_ExplorerCanvas;
    public bg!: BasePlannerPopup_ExplorerCanvas;
    public mcScroller!: MovieClip;
    public canvas!: MovieClip;
    public mcframe!: BasePlannerPopup_ExplorerFrame;

    constructor() {
        super();
    }
}
