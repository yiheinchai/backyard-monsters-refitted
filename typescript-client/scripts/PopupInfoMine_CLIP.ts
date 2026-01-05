import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { frame_CLIP } from './frame_CLIP';

/**
 * PopupInfoMine_CLIP - CLIP class for own base info popup
 * Converted from ActionScript to TypeScript
 */
export class PopupInfoMine_CLIP extends MovieClip {
    public mMonstersMask: MovieClip;
    public mcArrow: MovieClip;
    public tName: TextField;
    public bInviteMigrate: Button_CLIP;
    public mMonsters: MovieClip;
    public tHeight: TextField;
    public tLabel1: TextField;
    public bOpen: Button_CLIP;
    public tLabel2: TextField;
    public txtButtonInfo: TextField;
    public tLabel3: TextField;
    public tBonus: TextField;
    public bMonsters: Button_CLIP;
    public tLabel4: TextField;
    public tLocation: TextField;
    public scroll: MovieClip;
    public mcFrame: frame_CLIP;
    public bRelocate: Button_CLIP;
    public bBookmark: Button_CLIP;

    constructor() {
        super();
        this.mMonstersMask = new MovieClip();
        this.mcArrow = new MovieClip();
        this.tName = new TextField();
        this.bInviteMigrate = new Button_CLIP();
        this.mMonsters = new MovieClip();
        this.tHeight = new TextField();
        this.tLabel1 = new TextField();
        this.bOpen = new Button_CLIP();
        this.tLabel2 = new TextField();
        this.txtButtonInfo = new TextField();
        this.tLabel3 = new TextField();
        this.tBonus = new TextField();
        this.bMonsters = new Button_CLIP();
        this.tLabel4 = new TextField();
        this.tLocation = new TextField();
        this.scroll = new MovieClip();
        this.mcFrame = new frame_CLIP();
        this.bRelocate = new Button_CLIP();
        this.bBookmark = new Button_CLIP();
    }
}
