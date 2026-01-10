import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { frame_CLIP } from './frame_CLIP';
import { Embed } from "./core/Embed";

/**
 * HOUSINGPOPUP_CLIP - Housing popup CLIP
 * Converted from ActionScript to TypeScript
 * 
 * Original: [Embed(source="/_assets/assets.swf", symbol="HOUSINGPOPUP_CLIP")]
 */
@Embed({ source: "/_assets/assets.swf", symbol: "HOUSINGPOPUP_CLIP" })
export class HOUSINGPOPUP_CLIP extends MovieClip {
    public juicefooter_desc_txt: TextField;
    public footer_desc_txt: TextField;
    public ascend_desc_txt: TextField;
    public title_txt: TextField;
    public bCancel: Button_CLIP;
    public bJuice: Button_CLIP;
    public bAll: Button_CLIP;
    public bAscend: Button_CLIP;
    public capacity_desc_txt: TextField;
    public monsterContainerMask: MovieClip;
    public tStorage: TextField;
    public monsterContainer: MovieClip;
    public mcStorage: MovieClip;

    constructor() {
        super();
        this.juicefooter_desc_txt = new TextField();
        this.footer_desc_txt = new TextField();
        this.ascend_desc_txt = new TextField();
        this.title_txt = new TextField();
        this.bCancel = new Button_CLIP();
        this.bJuice = new Button_CLIP();
        this.bAll = new Button_CLIP();
        this.bAscend = new Button_CLIP();
        this.capacity_desc_txt = new TextField();
        this.monsterContainerMask = new MovieClip();
        this.tStorage = new TextField();
        this.monsterContainer = new MovieClip();
        this.mcStorage = new MovieClip();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    private frame1(): void {
        this.stop();
    }
}
