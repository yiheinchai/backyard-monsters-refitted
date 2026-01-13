import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { frame_CLIP } from './frame_CLIP';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="popup_prefab_CLIP")]

/**
 * popup_prefab_CLIP - CLIP class for prefab popup
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "popup_prefab_CLIP" })
export class popup_prefab_CLIP extends MovieClip {
    public tCol1: TextField;
    public img2: MovieClip;
    public tCol2: TextField;
    public t1: TextField;
    public img3: MovieClip;
    public tSelect: TextField;
    public tCol3: TextField;
    public t2: TextField;
    public tInstantNotice: TextField;
    public tCol4: TextField;
    public t3: TextField;
    public b1: Button_CLIP;
    public b2: Button_CLIP;
    public c1: TextField;
    public b3: Button_CLIP;
    public c2: TextField;
    public b1s: Button_CLIP;
    public c3: TextField;
    public b2s: Button_CLIP;
    public b3s: Button_CLIP;
    public tShiny: TextField;
    public mcFrame: frame_CLIP;
    public img1: MovieClip;

    constructor() {
        super();
        this.tCol1 = new TextField();
        this.img2 = new MovieClip();
        this.tCol2 = new TextField();
        this.t1 = new TextField();
        this.img3 = new MovieClip();
        this.tSelect = new TextField();
        this.tCol3 = new TextField();
        this.t2 = new TextField();
        this.tInstantNotice = new TextField();
        this.tCol4 = new TextField();
        this.t3 = new TextField();
        this.b1 = new Button_CLIP();
        this.b2 = new Button_CLIP();
        this.c1 = new TextField();
        this.b3 = new Button_CLIP();
        this.c2 = new TextField();
        this.b1s = new Button_CLIP();
        this.c3 = new TextField();
        this.b2s = new Button_CLIP();
        this.b3s = new Button_CLIP();
        this.tShiny = new TextField();
        this.mcFrame = new frame_CLIP();
        this.img1 = new MovieClip();
    }
}
