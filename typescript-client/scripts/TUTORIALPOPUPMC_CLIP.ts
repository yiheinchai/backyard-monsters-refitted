import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { TUTORIALARROWMC_CLIP } from './TUTORIALARROWMC_CLIP';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="TUTORIALPOPUPMC_CLIP")]

/**
 * TUTORIALPOPUPMC_CLIP - CLIP class for tutorial popup
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "TUTORIALPOPUPMC_CLIP" })
export class TUTORIALPOPUPMC_CLIP extends MovieClip {
    public mcArrow: TUTORIALARROWMC_CLIP;
    public mcBubble: MovieClip;
    public mcText: TextField;
    public mcButton: Button_CLIP;
    public mcBlocker: MovieClip;

    constructor() {
        super();
        this.mcArrow = new TUTORIALARROWMC_CLIP();
        this.mcBubble = new MovieClip();
        this.mcText = new TextField();
        this.mcButton = new Button_CLIP();
        this.mcBlocker = new MovieClip();
    }
}
