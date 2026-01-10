import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { buttonClose_CLIP } from './buttonClose_CLIP';
import { creatureBar } from './creatureBar';
import { frame_CLIP } from './frame_CLIP';
import { HatcheryMonsterIcon_CLIP } from './HatcheryMonsterIcon_CLIP';
import { ScrollSet_CLIP } from './ScrollSet_CLIP';
import { Embed } from "./core/Embed";

/**
 * HATCHERYPOPUP_CLIP - Hatchery popup CLIP
 * Converted from ActionScript to TypeScript
 * 
 * Original: [Embed(source="/_assets/assets.swf", symbol="HATCHERYPOPUP_CLIP")]
 */
@Embed({ source: "/_assets/assets.swf", symbol: "HATCHERYPOPUP_CLIP" })
export class HATCHERYPOPUP_CLIP extends MovieClip {
    public mcCount4: MovieClip;
    public monsterCanvas: MovieClip;
    public mcRemove4: buttonClose_CLIP;
    public tProgress: TextField;
    public mcCount2: MovieClip;
    public mcMonsterInfo: MovieClip;
    public monsterMask: MovieClip;
    public mcCount3: MovieClip;
    public title_txt: TextField;
    public mcCount1: MovieClip;
    public bProgress: creatureBar;
    public bContinue: Button_CLIP;
    public slot0: HatcheryMonsterIcon_CLIP;
    public txtGuide: TextField;
    public bFinish: MovieClip;
    public slot1: HatcheryMonsterIcon_CLIP;
    public scroller: ScrollSet_CLIP;
    public slot2: HatcheryMonsterIcon_CLIP;
    public slot3: HatcheryMonsterIcon_CLIP;
    public slot4: HatcheryMonsterIcon_CLIP;
    public mcRemove3: buttonClose_CLIP;
    public portrait1: MovieClip;
    public mcRemove2: buttonClose_CLIP;
    public mcFrame: frame_CLIP;
    public mcOverdrive: MovieClip;
    public mcRemove1: buttonClose_CLIP;
    public mcMessage: MovieClip;
    public mcRemove0: buttonClose_CLIP;
    public bSpeedup: MovieClip;

    constructor() {
        super();
        this.mcCount4 = new MovieClip();
        this.monsterCanvas = new MovieClip();
        this.mcRemove4 = new buttonClose_CLIP();
        this.tProgress = new TextField();
        this.mcCount2 = new MovieClip();
        this.mcMonsterInfo = new MovieClip();
        this.monsterMask = new MovieClip();
        this.mcCount3 = new MovieClip();
        this.title_txt = new TextField();
        this.mcCount1 = new MovieClip();
        this.bProgress = new creatureBar();
        this.bContinue = new Button_CLIP();
        this.slot0 = new HatcheryMonsterIcon_CLIP();
        this.txtGuide = new TextField();
        this.bFinish = new MovieClip();
        this.slot1 = new HatcheryMonsterIcon_CLIP();
        this.scroller = new ScrollSet_CLIP();
        this.slot2 = new HatcheryMonsterIcon_CLIP();
        this.slot3 = new HatcheryMonsterIcon_CLIP();
        this.slot4 = new HatcheryMonsterIcon_CLIP();
        this.mcRemove3 = new buttonClose_CLIP();
        this.portrait1 = new MovieClip();
        this.mcRemove2 = new buttonClose_CLIP();
        this.mcFrame = new frame_CLIP();
        this.mcOverdrive = new MovieClip();
        this.mcRemove1 = new buttonClose_CLIP();
        this.mcMessage = new MovieClip();
        this.mcRemove0 = new buttonClose_CLIP();
        this.bSpeedup = new MovieClip();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    private frame1(): void {
        this.stop();
    }
}
