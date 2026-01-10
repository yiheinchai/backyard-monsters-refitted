import MovieClip from 'openfl/display/MovieClip';
import SimpleButton from 'openfl/display/SimpleButton';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="BasePlannerTransferRow_CLIP")]

/**
 * BasePlannerTransferRow_CLIP - Transfer row CLIP for base planner
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "BasePlannerTransferRow_CLIP" })
export class BasePlannerTransferRow_CLIP extends MovieClip {
    public tTemplateName: TextField;
    public mcBackground: MovieClip;
    public tSlotName: TextField;
    public mcLock: SimpleButton;
    public mcEdit: MovieClip;
    public bTransfer: Button_CLIP;

    constructor() {
        super();
        this.tTemplateName = new TextField();
        this.mcBackground = new MovieClip();
        this.tSlotName = new TextField();
        this.mcLock = new SimpleButton();
        this.mcEdit = new MovieClip();
        this.bTransfer = new Button_CLIP();
    }
}
