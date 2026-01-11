import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { frame_CLIP } from './frame_CLIP';
import { bubblepopup6_CLIP } from './bubblepopup6_CLIP';
import { Embed } from "./core/Embed";

/**
 * BUILDINGOPTIONSPOPUP_CLIP - Building options popup CLIP
 * Converted from ActionScript to TypeScript
 * 
 * Original: [Embed(source="/_assets/assets.swf", symbol="BUILDINGOPTIONSPOPUP_CLIP")]
 */
@Embed({ source: "/_assets/assets.swf", symbol: "BUILDINGOPTIONSPOPUP_CLIP" })
export class BUILDINGOPTIONSPOPUP_CLIP extends MovieClip {
    public mcCBBG: MovieClip;
    public mcBG: frame_CLIP;
    public mcInstant: any; // Dynamic MovieClip with bAction, tDescription, gCoin
    public mcResources: any; // Dynamic MovieClip with bAction, mcR1-mcR4, mcTime
    public mcImage: MovieClip;
    public mcInfoCB: bubblepopup6_CLIP;
    public tDescription: TextField;

    constructor() {
        super();
        this.mcCBBG = new MovieClip();
        this.mcBG = new frame_CLIP();
        this.mcInstant = new MovieClip();
        this.mcResources = new MovieClip();
        this.mcImage = new MovieClip();
        this.mcInfoCB = new bubblepopup6_CLIP();
        this.tDescription = new TextField();
    }
}
