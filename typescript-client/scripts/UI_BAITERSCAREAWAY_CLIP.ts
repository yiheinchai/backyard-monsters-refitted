import MovieClip from 'openfl/display/MovieClip';
import { Button_CLIP } from './Button_CLIP';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="UI_BAITERSCAREAWAY_CLIP")]

/**
 * UI_BAITERSCAREAWAY_CLIP - CLIP class for baiter scare away UI
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "UI_BAITERSCAREAWAY_CLIP" })
export class UI_BAITERSCAREAWAY_CLIP extends MovieClip {
    public mcBG: MovieClip;
    public bReturn: Button_CLIP;

    constructor() {
        super();
        this.mcBG = new MovieClip();
        this.bReturn = new Button_CLIP();
    }
}
