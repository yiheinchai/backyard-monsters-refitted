import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { frame_CLIP } from './frame_CLIP';
import { Button_CLIP } from './Button_CLIP';
import { Embed } from "./core/Embed";

/**
 * popup_generic - Generic popup display class
 * Converted from ActionScript to TypeScript
 * 
 * Original: [Embed(source="/_assets/assets.swf", symbol="popup_generic")]
 */
@Embed({ source: "/_assets/assets.swf", symbol: "popup_generic" })
export class popup_generic extends MovieClip {
    public mcBG: frame_CLIP;
    public tA: TextField;
    public tB: TextField;
    public mcImage: MovieClip;
    public bAction: Button_CLIP;
    public mcImageFrame: MovieClip;

    constructor() {
        super();
        this.mcBG = new frame_CLIP();
        this.tA = new TextField();
        this.tB = new TextField();
        this.mcImage = new MovieClip();
        this.bAction = new Button_CLIP();
        this.mcImageFrame = new MovieClip();
    }
}
