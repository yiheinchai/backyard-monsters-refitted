import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Embed } from "./core/Embed";

/**
 * BUILDINGBUTTON_CLIP - Building button UI element CLIP
 * Converted from ActionScript to TypeScript
 * 
 * Original: [Embed(source="/_assets/assets.swf", symbol="BUILDINGBUTTON_CLIP")]
 */
@Embed({ source: "/_assets/assets.swf", symbol: "BUILDINGBUTTON_CLIP" })
export class BUILDINGBUTTON_CLIP extends MovieClip {
    public tName: TextField;
    public mcBG: MovieClip;
    public mcShroud: MovieClip;
    public mcNew: MovieClip;
    public mcSale: MovieClip;
    public tQuantity: TextField;
    public mcCheck: MovieClip;

    constructor() {
        super();
        this.tName = new TextField();
        this.mcBG = new MovieClip();
        this.mcShroud = new MovieClip();
        this.mcNew = new MovieClip();
        this.mcSale = new MovieClip();
        this.tQuantity = new TextField();
        this.mcCheck = new MovieClip();
    }
}
