import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';

/**
 * MONSTERBUNKERPOPUP_CLIP - Base UI clip class for Monster Bunker Popup
 * Contains all UI element declarations for monster bunker popup
 * Converted from ActionScript to TypeScript
 */
export class MONSTERBUNKERPOPUP_CLIP extends MovieClip {
    public transferCanvasBmask!: MovieClip;
    public transferCanvasA!: MovieClip;
    public transferCanvasAmask!: MovieClip;
    public tNoMonsters!: TextField;
    public title_txt!: TextField;
    public bHousing!: Button_CLIP;
    public bContinue!: Button_CLIP;
    public tStored!: TextField;
    public txtGuide!: TextField;
    public bSpecial!: Button_CLIP;
    public scrollerA!: MovieClip;
    public tCost!: TextField;
    public transferCanvasB!: MovieClip;
    public scrollerB!: MovieClip;
    public mcStorage!: MovieClip;
    public tCapacity!: TextField;
    public bTransfer!: Button_CLIP;

    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    protected frame1(): void {
        this.stop();
    }
}
