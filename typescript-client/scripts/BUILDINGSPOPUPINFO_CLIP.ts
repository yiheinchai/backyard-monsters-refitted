import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { BUILDINGBUTTON_CLIP } from './BUILDINGBUTTON_CLIP';
import { frame_CLIP } from './frame_CLIP';
import { Embed } from "./core/Embed";

/**
 * BUILDINGSPOPUPINFO_CLIP - Buildings popup info CLIP
 * Converted from ActionScript to TypeScript
 * 
 * Original: [Embed(source="/_assets/assets.swf", symbol="BUILDINGSPOPUPINFO_CLIP")]
 */
@Embed({ source: "/_assets/assets.swf", symbol: "BUILDINGSPOPUPINFO_CLIP" })
export class BUILDINGSPOPUPINFO_CLIP extends MovieClip {
    public mcBG: frame_CLIP;
    public bBuild: Button_CLIP;
    public mcBlocker: MovieClip;
    public tDescription: TextField;
    public mcIcon: BUILDINGBUTTON_CLIP;
    public bTopup: Button_CLIP;

    constructor() {
        super();
        this.mcBG = new frame_CLIP();
        this.bBuild = new Button_CLIP();
        this.mcBlocker = new MovieClip();
        this.tDescription = new TextField();
        this.mcIcon = new BUILDINGBUTTON_CLIP();
        this.bTopup = new Button_CLIP();
    }
}
