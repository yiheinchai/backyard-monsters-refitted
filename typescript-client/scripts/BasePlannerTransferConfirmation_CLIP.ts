import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { frame_CLIP } from './frame_CLIP';
//    [Embed(source="/_assets/assets.swf", symbol="BasePlannerTransferConfirmation_CLIP")]

/**
 * BasePlannerTransferConfirmation_CLIP - Transfer confirmation CLIP for base planner
 * Converted from ActionScript to TypeScript
 */
export class BasePlannerTransferConfirmation_CLIP extends MovieClip {
    public bConfirm: Button_CLIP;
    public tBody: TextField;
    public bCancel: Button_CLIP;
    public tTitle: TextField;
    public mcFrame: frame_CLIP;

    constructor() {
        super();
        this.bConfirm = new Button_CLIP();
        this.tBody = new TextField();
        this.bCancel = new Button_CLIP();
        this.tTitle = new TextField();
        this.mcFrame = new frame_CLIP();
    }
}
