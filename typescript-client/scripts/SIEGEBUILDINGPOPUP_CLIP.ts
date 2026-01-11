import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { ButtonBrown_CLIP } from './ButtonBrown_CLIP';
import { creatureBarAdv } from './creatureBarAdv';
import { frame3_CLIP } from './frame3_CLIP';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="SIEGEBUILDINGPOPUP_CLIP")]

/**
 * SIEGEBUILDINGPOPUP_CLIP - CLIP class for siege building popup
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "SIEGEBUILDINGPOPUP_CLIP" })
export class SIEGEBUILDINGPOPUP_CLIP extends MovieClip {
    public title_siegelab: TextField;
    public weaponContainer_frame: MovieClip;
    public stat1_bar: creatureBarAdv;
    public stat3_bar: creatureBarAdv;
    public stat2_bar: creatureBarAdv;
    public tab_siegelab: ButtonBrown_CLIP;
    public bMap: Button_CLIP;
    public videoCanvas_mc: any; // Dynamic MovieClip with container
    public tNotice: TextField;
    public scroller: MovieClip;
    public weaponContainer_mc: MovieClip;
    public stat1_label: TextField;
    public mcInstant: any; // Dynamic MovieClip with bAction, tDescription, gCoin
    public title_siegefactory: TextField;
    public bCancel: Button_CLIP;
    public tDesc: TextField;
    public tTitle: TextField;
    public mcTime: creatureBarAdv;
    public stat3_label: TextField;
    public mcResources: any; // Dynamic MovieClip with bAction, mcR1, mcR2, mcR3, mcTime
    public stat2_label: TextField;
    public stat2_bartxt: TextField;
    public stat3_bartxt: TextField;
    public stat1_bartxt: TextField;
    public tTitleReady: TextField;
    public mcFrame: frame3_CLIP;
    public weaponContainer_mask: MovieClip;
    public mcTimeTxt: TextField;
    public tWarning: TextField;
    public window: MovieClip;
    public tab_siegefactory: ButtonBrown_CLIP;

    constructor() {
        super();
        this.title_siegelab = new TextField();
        this.weaponContainer_frame = new MovieClip();
        this.stat1_bar = new creatureBarAdv();
        this.stat3_bar = new creatureBarAdv();
        this.stat2_bar = new creatureBarAdv();
        this.tab_siegelab = new ButtonBrown_CLIP();
        this.bMap = new Button_CLIP();
        this.videoCanvas_mc = new MovieClip();
        this.tNotice = new TextField();
        this.scroller = new MovieClip();
        this.weaponContainer_mc = new MovieClip();
        this.stat1_label = new TextField();
        this.mcInstant = new MovieClip();
        this.title_siegefactory = new TextField();
        this.bCancel = new Button_CLIP();
        this.tDesc = new TextField();
        this.tTitle = new TextField();
        this.mcTime = new creatureBarAdv();
        this.stat3_label = new TextField();
        this.mcResources = new MovieClip();
        this.stat2_label = new TextField();
        this.stat2_bartxt = new TextField();
        this.stat3_bartxt = new TextField();
        this.stat1_bartxt = new TextField();
        this.tTitleReady = new TextField();
        this.mcFrame = new frame3_CLIP();
        this.weaponContainer_mask = new MovieClip();
        this.mcTimeTxt = new TextField();
        this.tWarning = new TextField();
        this.window = new MovieClip();
        this.tab_siegefactory = new ButtonBrown_CLIP();
    }
}
