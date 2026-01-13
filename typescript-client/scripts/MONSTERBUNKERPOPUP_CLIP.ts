import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { Embed } from "./core/Embed";

/**
 * MONSTERBUNKERPOPUP_CLIP - Monster bunker popup CLIP
 * Converted from ActionScript to TypeScript
 * 
 * Original: [Embed(source="/_assets/assets.swf", symbol="MONSTERBUNKERPOPUP_CLIP")]
 */
@Embed({ source: "/_assets/assets.swf", symbol: "MONSTERBUNKERPOPUP_CLIP" })
export class MONSTERBUNKERPOPUP_CLIP extends MovieClip {
    public transferCanvasBmask: MovieClip;
    public transferCanvasA: MovieClip;
    public transferCanvasAmask: MovieClip;
    public tNoMonsters: TextField;
    public title_txt: TextField;
    public bHousing: Button_CLIP;
    public bContinue: Button_CLIP;
    public tStored: TextField;
    public txtGuide: TextField;
    public bSpecial: Button_CLIP;
    public scrollerA: MovieClip;
    public tCost: TextField;
    public transferCanvasB: MovieClip;
    public scrollerB: MovieClip;
    public mcStorage: MovieClip;
    public tCapacity: TextField;
    public bTransfer: Button_CLIP;

    constructor() {
        super();
        this.transferCanvasBmask = new MovieClip();
        this.transferCanvasA = new MovieClip();
        this.transferCanvasAmask = new MovieClip();
        this.tNoMonsters = new TextField();
        this.title_txt = new TextField();
        this.bHousing = new Button_CLIP();
        this.bContinue = new Button_CLIP();
        this.tStored = new TextField();
        this.txtGuide = new TextField();
        this.bSpecial = new Button_CLIP();
        this.scrollerA = new MovieClip();
        this.tCost = new TextField();
        this.transferCanvasB = new MovieClip();
        this.scrollerB = new MovieClip();
        this.mcStorage = new MovieClip();
        this.tCapacity = new TextField();
        this.bTransfer = new Button_CLIP();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    private frame1(): void {
        this.stop();
    }
}
