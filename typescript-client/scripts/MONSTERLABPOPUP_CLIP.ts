import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { frame_CLIP } from './frame_CLIP';
import { creatureBarAdv } from './creatureBarAdv';
import { Embed } from "./core/Embed";

/**
 * MONSTERLABPOPUP_CLIP - Monster lab popup CLIP
 * Converted from ActionScript to TypeScript
 * 
 * Original: [Embed(source="/_assets/assets.swf", symbol="MONSTERLABPOPUP_CLIP")]
 */
@Embed({ source: "/_assets/assets.swf", symbol: "MONSTERLABPOPUP_CLIP" })
export class MONSTERLABPOPUP_CLIP extends MovieClip {
    public tStatusDesc: TextField;
    public tStatusTitle: TextField;
    public tStatsPBarLabel: TextField;
    public tProgress: TextField;
    public tStatsPBar: TextField;
    public title_txt: TextField;
    public bContinue: Button_CLIP;
    public mcList: MovieClip;
    public txtGuide: TextField;
    public tStatsWarning: TextField;
    public mcInstant: MovieClip;
    public tIdle: TextField;
    public mcResources: MovieClip;
    public mcPBarStatus: creatureBarAdv;
    public mcPBarStats: creatureBarAdv;
    public mcStatusIcon: MovieClip;
    public mcFrame: frame_CLIP;
    public tStatsTitle: TextField;
    public bAction: Button_CLIP;
    public mcPortraitIcon: MovieClip;

    constructor() {
        super();
        this.tStatusDesc = new TextField();
        this.tStatusTitle = new TextField();
        this.tStatsPBarLabel = new TextField();
        this.tProgress = new TextField();
        this.tStatsPBar = new TextField();
        this.title_txt = new TextField();
        this.bContinue = new Button_CLIP();
        this.mcList = new MovieClip();
        this.txtGuide = new TextField();
        this.tStatsWarning = new TextField();
        this.mcInstant = new MovieClip();
        this.tIdle = new TextField();
        this.mcResources = new MovieClip();
        this.mcPBarStatus = new creatureBarAdv();
        this.mcPBarStats = new creatureBarAdv();
        this.mcStatusIcon = new MovieClip();
        this.mcFrame = new frame_CLIP();
        this.tStatsTitle = new TextField();
        this.bAction = new Button_CLIP();
        this.mcPortraitIcon = new MovieClip();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    private frame1(): void {
        this.stop();
    }
}
