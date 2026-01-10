import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { frame_CLIP } from './frame_CLIP';
//    [Embed(source="/_assets/assets.swf", symbol="PopupInfoEnemy_CLIP")]

/**
 * PopupInfoEnemy_CLIP - CLIP class for enemy info popup
 * Converted from ActionScript to TypeScript
 */
export class PopupInfoEnemy_CLIP extends MovieClip {
    public tNameLabel: TextField;
    public bTruce: Button_CLIP;
    public tName: TextField;
    public bView: Button_CLIP;
    public bSendMessage: Button_CLIP;
    public tHeight: TextField;
    public bAttack: Button_CLIP;
    public bAlliance: Button_CLIP;
    public mcAlliancePic: MovieClip;
    public tHeightLabel: TextField;
    public tBonus: TextField;
    public tLocationLabel: TextField;
    public tLocation: TextField;
    public mcFrame: frame_CLIP;
    public mcRelations: MovieClip;
    public tYardHasLabel: TextField;
    public mcLevel: MovieClip;
    public mcProfilePic: MovieClip;
    public bBookmark: Button_CLIP;

    constructor() {
        super();
        this.tNameLabel = new TextField();
        this.bTruce = new Button_CLIP();
        this.tName = new TextField();
        this.bView = new Button_CLIP();
        this.bSendMessage = new Button_CLIP();
        this.tHeight = new TextField();
        this.bAttack = new Button_CLIP();
        this.bAlliance = new Button_CLIP();
        this.mcAlliancePic = new MovieClip();
        this.tHeightLabel = new TextField();
        this.tBonus = new TextField();
        this.tLocationLabel = new TextField();
        this.tLocation = new TextField();
        this.mcFrame = new frame_CLIP();
        this.mcRelations = new MovieClip();
        this.tYardHasLabel = new TextField();
        this.mcLevel = new MovieClip();
        this.mcProfilePic = new MovieClip();
        this.bBookmark = new Button_CLIP();
    }
}
