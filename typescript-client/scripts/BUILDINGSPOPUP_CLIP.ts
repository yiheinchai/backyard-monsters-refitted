import MovieClip from 'openfl/display/MovieClip';
import { BUILDINGSARROW } from './BUILDINGSARROW';
import { buttonClose_CLIP } from './buttonClose_CLIP';
import { Button_CLIP } from './Button_CLIP';
import { Embed } from "./core/Embed";

/**
 * BUILDINGSPOPUP_CLIP - Buildings popup CLIP
 * Converted from ActionScript to TypeScript
 * 
 * Original: [Embed(source="/_assets/assets.swf", symbol="BUILDINGSPOPUP_CLIP")]
 */
@Embed({ source: "/_assets/assets.swf", symbol: "BUILDINGSPOPUP_CLIP" })
export class BUILDINGSPOPUP_CLIP extends MovieClip {
    public bNext: BUILDINGSARROW;
    public bClose: buttonClose_CLIP;
    public bPrevious: BUILDINGSARROW;
    public b1: Button_CLIP;
    public b2: Button_CLIP;
    public b3: Button_CLIP;
    public b4: Button_CLIP;
    public mcNew: MovieClip;

    constructor() {
        super();
        this.bNext = new BUILDINGSARROW();
        this.bClose = new buttonClose_CLIP();
        this.bPrevious = new BUILDINGSARROW();
        this.b1 = new Button_CLIP();
        this.b2 = new Button_CLIP();
        this.b3 = new Button_CLIP();
        this.b4 = new Button_CLIP();
        this.mcNew = new MovieClip();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    private frame1(): void {
        this.stop();
    }
}
