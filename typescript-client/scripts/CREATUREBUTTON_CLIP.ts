import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { Embed } from "./core/Embed";

/**
 * CREATUREBUTTON_CLIP - Creature button UI element CLIP
 * Converted from ActionScript to TypeScript
 * 
 * Original: [Embed(source="/_assets/assets.swf", symbol="CREATUREBUTTON_CLIP")]
 */
@Embed({ source: "/_assets/assets.swf", symbol: "CREATUREBUTTON_CLIP" })
export class CREATUREBUTTON_CLIP extends MovieClip {
    public _creatureImage: MovieClip;
    public txtNumber: TextField;
    public _bg: MovieClip;
    public txtName: TextField;
    public bLess: Button_CLIP;
    public mcImage: MovieClip;
    public bMore: Button_CLIP;

    constructor() {
        super();
        this._creatureImage = new MovieClip();
        this.txtNumber = new TextField();
        this._bg = new MovieClip();
        this.txtName = new TextField();
        this.bLess = new Button_CLIP();
        this.mcImage = new MovieClip();
        this.bMore = new Button_CLIP();
    }
}
