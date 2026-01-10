import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="MonsterBunkerPopup_Persistent_CLIP")]

/**
 * MonsterBunkerPopup_Persistent_CLIP - CLIP class for persistent monster bunker popup
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "MonsterBunkerPopup_Persistent_CLIP" })
export class MonsterBunkerPopup_Persistent_CLIP extends MovieClip {
    public mcHousing: MovieClip;
    public transferCanvasBmask: MovieClip;
    public transferCanvasA: MovieClip;
    public transferCanvasAmask: MovieClip;
    public tNoMonsters: TextField;
    public tSize1: TextField;
    public title_txt: TextField;
    public tTransfer2: TextField;
    public tSize2: TextField;
    public bContinue: Button_CLIP;
    public tStored: TextField;
    public tTransfer1: TextField;
    public txtGuide: TextField;
    public tHoused: TextField;
    public tHousing: TextField;
    public scrollerA: MovieClip;
    public tAvailable1: TextField;
    public tAvailable2: TextField;
    public transferCanvasB: MovieClip;
    public scrollerB: MovieClip;
    public mcStorage: MovieClip;
    public tCapacity: TextField;

    constructor() {
        super();
        this.mcHousing = new MovieClip();
        this.transferCanvasBmask = new MovieClip();
        this.transferCanvasA = new MovieClip();
        this.transferCanvasAmask = new MovieClip();
        this.tNoMonsters = new TextField();
        this.tSize1 = new TextField();
        this.title_txt = new TextField();
        this.tTransfer2 = new TextField();
        this.tSize2 = new TextField();
        this.bContinue = new Button_CLIP();
        this.tStored = new TextField();
        this.tTransfer1 = new TextField();
        this.txtGuide = new TextField();
        this.tHoused = new TextField();
        this.tHousing = new TextField();
        this.scrollerA = new MovieClip();
        this.tAvailable1 = new TextField();
        this.tAvailable2 = new TextField();
        this.transferCanvasB = new MovieClip();
        this.scrollerB = new MovieClip();
        this.mcStorage = new MovieClip();
        this.tCapacity = new TextField();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    private frame1(): void {
        this.stop();
    }
}
