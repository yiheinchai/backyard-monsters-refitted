import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { frame_CLIP } from './frame_CLIP';
import { Button_CLIP } from './Button_CLIP';
import { Embed } from "./core/Embed";

/**
 * popup_monster - Monster popup display class
 * Converted from ActionScript to TypeScript
 * 
 * Original: [Embed(source="/_assets/assets.swf", symbol="popup_monster")]
 */
@Embed({ source: "/_assets/assets.swf", symbol: "popup_monster" })
export class popup_monster extends MovieClip {
    public tText: TextField;
    public mcImage: MovieClip;
    public mcFrame: frame_CLIP;
    public bSpeedup: Button_CLIP;
    public bAction: Button_CLIP;

    constructor() {
        super();
        this.tText = new TextField();
        this.mcImage = new MovieClip();
        this.mcFrame = new frame_CLIP();
        this.bSpeedup = new Button_CLIP();
        this.bAction = new Button_CLIP();
    }
}
