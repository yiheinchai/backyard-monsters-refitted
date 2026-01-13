import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { Embed } from "./core/Embed";

/**
 * GUARDIANBUTTON_CLIP - Guardian button CLIP
 * Converted from ActionScript to TypeScript
 * 
 * Original: [Embed(source="/_assets/assets.swf", symbol="GUARDIANBUTTON_CLIP")]
 */
@Embed({ source: "/_assets/assets.swf", symbol: "GUARDIANBUTTON_CLIP" })
export class GUARDIANBUTTON_CLIP extends MovieClip {
    public _bg: MovieClip;
    public txtName: TextField;
    public bRetreat: Button_CLIP;
    public bSend: Button_CLIP;
    public mcImage: MovieClip;

    constructor() {
        super();
        this._bg = new MovieClip();
        this.txtName = new TextField();
        this.bRetreat = new Button_CLIP();
        this.bSend = new Button_CLIP();
        this.mcImage = new MovieClip();
    }
}
