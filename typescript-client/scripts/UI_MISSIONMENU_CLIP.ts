import MovieClip from 'openfl/display/MovieClip';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="UI_MISSIONMENU_CLIP")]

/**
 * UI_MISSIONMENU_CLIP - CLIP class for mission menu
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "UI_MISSIONMENU_CLIP" })
export class UI_MISSIONMENU_CLIP extends MovieClip {
    public footer: MovieClip;
    public frame: MovieClip;

    constructor() {
        super();
        this.footer = new MovieClip();
        this.frame = new MovieClip();
    }
}
