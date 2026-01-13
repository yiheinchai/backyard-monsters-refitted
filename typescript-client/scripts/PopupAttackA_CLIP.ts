import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { frame_CLIP } from './frame_CLIP';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="PopupAttackA_CLIP")]

/**
 * PopupAttackA_CLIP - CLIP class for attack popup variant A
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "PopupAttackA_CLIP" })
export class PopupAttackA_CLIP extends MovieClip {
    public mMonstersMask: MovieClip;
    public mMonsters: MovieClip;
    public bCancel: Button_CLIP;
    public bAttack: Button_CLIP;
    public tAttackText: TextField;
    public tCatapult: TextField;
    public tMonsters: TextField;
    public mcAlliancePic: MovieClip;
    public scroll: MovieClip;
    public mcFrame: frame_CLIP;
    public mcProfilePic: MovieClip;

    constructor() {
        super();
        this.mMonstersMask = new MovieClip();
        this.mMonsters = new MovieClip();
        this.bCancel = new Button_CLIP();
        this.bAttack = new Button_CLIP();
        this.tAttackText = new TextField();
        this.tCatapult = new TextField();
        this.tMonsters = new TextField();
        this.mcAlliancePic = new MovieClip();
        this.scroll = new MovieClip();
        this.mcFrame = new frame_CLIP();
        this.mcProfilePic = new MovieClip();
    }
}
