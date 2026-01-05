import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { frame_CLIP } from './frame_CLIP';

/**
 * BasePlannerTransfer_CLIP - Base UI clip class for Base Planner Transfer
 * Contains all UI element declarations for the transfer dialog
 * Converted from ActionScript to TypeScript
 */
export class BasePlannerTransfer_CLIP extends MovieClip {
    public tTitle!: TextField;
    public mcRowContainer!: MovieClip;
    public mcFrame!: frame_CLIP;

    constructor() {
        super();
    }
}
