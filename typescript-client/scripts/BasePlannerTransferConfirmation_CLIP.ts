import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { frame_CLIP } from './frame_CLIP';

/**
 * BasePlannerTransferConfirmation_CLIP - Base UI clip class for Base Planner Transfer Confirmation
 * Contains all UI element declarations for the transfer confirmation dialog
 * Converted from ActionScript to TypeScript
 */
export class BasePlannerTransferConfirmation_CLIP extends MovieClip {
    public bConfirm!: Button_CLIP;
    public tBody!: TextField;
    public bCancel!: Button_CLIP;
    public tTitle!: TextField;
    public mcFrame!: frame_CLIP;

    constructor() {
        super();
    }
}
