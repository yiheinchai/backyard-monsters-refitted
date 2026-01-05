import MovieClip from 'openfl/display/MovieClip';
import SimpleButton from 'openfl/display/SimpleButton';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';

/**
 * BasePlannerTransferRow_CLIP - Base UI clip class for Base Planner Transfer Row
 * Contains all UI element declarations for individual transfer rows
 * Converted from ActionScript to TypeScript
 */
export class BasePlannerTransferRow_CLIP extends MovieClip {
    public tTemplateName!: TextField;
    public mcBackground!: MovieClip;
    public tSlotName!: TextField;
    public mcLock!: SimpleButton;
    public mcEdit!: MovieClip;
    public bTransfer!: Button_CLIP;

    constructor() {
        super();
    }
}
