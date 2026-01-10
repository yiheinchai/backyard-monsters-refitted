import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { creatureBar } from './creatureBar';
//    [Embed(source="/_assets/assets.swf", symbol="SiegeBuildingPopup_ListItem_CLIP")]

/**
 * SiegeBuildingPopup_ListItem_CLIP - CLIP class for siege building list item
 * Converted from ActionScript to TypeScript
 */
export class SiegeBuildingPopup_ListItem_CLIP extends MovieClip {
    public star1: MovieClip;
    public tTime: TextField;
    public star2: MovieClip;
    public tReady: TextField;
    public star3: MovieClip;
    public star4: MovieClip;
    public star5: MovieClip;
    public star6: MovieClip;
    public tLabel: TextField;
    public star7: MovieClip;
    public star8: MovieClip;
    public mcTime: creatureBar;
    public star9: MovieClip;
    public mcImage: MovieClip;
    public tDescription: TextField;
    public star10: MovieClip;

    constructor() {
        super();
        this.star1 = new MovieClip();
        this.tTime = new TextField();
        this.star2 = new MovieClip();
        this.tReady = new TextField();
        this.star3 = new MovieClip();
        this.star4 = new MovieClip();
        this.star5 = new MovieClip();
        this.star6 = new MovieClip();
        this.tLabel = new TextField();
        this.star7 = new MovieClip();
        this.star8 = new MovieClip();
        this.mcTime = new creatureBar();
        this.star9 = new MovieClip();
        this.mcImage = new MovieClip();
        this.tDescription = new TextField();
        this.star10 = new MovieClip();
    }
}
