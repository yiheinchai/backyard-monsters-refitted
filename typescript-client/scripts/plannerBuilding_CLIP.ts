import MovieClip from 'openfl/display/MovieClip';
import { plannerBuildingSquare } from './plannerBuildingSquare';

/**
 * plannerBuilding_CLIP - CLIP class for planner building
 * Converted from ActionScript to TypeScript
 */
export class plannerBuilding_CLIP extends MovieClip {
    public mcLocked: MovieClip;
    public mcSquare: plannerBuildingSquare;

    constructor() {
        super();
        this.mcLocked = new MovieClip();
        this.mcSquare = new plannerBuildingSquare();
    }
}
