import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="UI_MISSIONS_ITEM_CLIP")]

/**
 * UI_MISSIONS_ITEM_CLIP - CLIP class for mission item
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "UI_MISSIONS_ITEM_CLIP" })
export class UI_MISSIONS_ITEM_CLIP extends MovieClip {
    public tName: TextField;
    public tDesc: TextField;
    public bg: MovieClip;
    public mcImage: MovieClip;
    public mcLoading: MovieClip;
    public mcCheck: MovieClip;

    constructor() {
        super();
        this.tName = new TextField();
        this.tDesc = new TextField();
        this.bg = new MovieClip();
        this.mcImage = new MovieClip();
        this.mcLoading = new MovieClip();
        this.mcCheck = new MovieClip();
    }
}
