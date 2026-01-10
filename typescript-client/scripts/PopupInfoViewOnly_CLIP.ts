import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { frame_CLIP } from './frame_CLIP';
//    [Embed(source="/_assets/assets.swf", symbol="PopupInfoViewOnly_CLIP")]

/**
 * PopupInfoViewOnly_CLIP - CLIP class for view-only info popup
 * Converted from ActionScript to TypeScript
 */
export class PopupInfoViewOnly_CLIP extends MovieClip {
    public mcArrow: MovieClip;
    public tName: TextField;
    public bView: Button_CLIP;
    public tHeight: TextField;
    public tLabel1: TextField;
    public tLabel2: TextField;
    public txtButtonInfo: TextField;
    public tBonus: TextField;
    public tLocation: TextField;
    public mcFrame: frame_CLIP;
    public mcProfilePic: MovieClip;

    constructor() {
        super();
        this.mcArrow = new MovieClip();
        this.tName = new TextField();
        this.bView = new Button_CLIP();
        this.tHeight = new TextField();
        this.tLabel1 = new TextField();
        this.tLabel2 = new TextField();
        this.txtButtonInfo = new TextField();
        this.tBonus = new TextField();
        this.tLocation = new TextField();
        this.mcFrame = new frame_CLIP();
        this.mcProfilePic = new MovieClip();
    }
}
