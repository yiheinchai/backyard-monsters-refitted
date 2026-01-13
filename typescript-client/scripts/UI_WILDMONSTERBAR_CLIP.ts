import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="UI_WILDMONSTERBAR_CLIP")]

/**
 * UI_WILDMONSTERBAR_CLIP - CLIP class for wild monster bar
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "UI_WILDMONSTERBAR_CLIP" })
export class UI_WILDMONSTERBAR_CLIP extends MovieClip {
    public tA: TextField;
    public info: MovieClip;
    public back: MovieClip;
    public eta_txt: TextField;

    constructor() {
        super();
        this.tA = new TextField();
        this.info = new MovieClip();
        this.back = new MovieClip();
        this.eta_txt = new TextField();
    }
}
