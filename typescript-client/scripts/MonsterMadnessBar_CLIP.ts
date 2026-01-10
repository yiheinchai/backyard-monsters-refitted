import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { creatureBar } from './creatureBar';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="MonsterMadnessBar_CLIP")]

/**
 * MonsterMadnessBar_CLIP - CLIP class for monster madness event bar
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "MonsterMadnessBar_CLIP" })
export class MonsterMadnessBar_CLIP extends MovieClip {
    public mcHit: MovieClip;
    public mcBG: MovieClip;
    public tLabel: TextField;
    public barProgressTxt: TextField;
    public barProgress: creatureBar;
    public mcImage: MovieClip;
    public bActionTxt: TextField;
    public bAction: MovieClip;

    constructor() {
        super();
        this.mcHit = new MovieClip();
        this.mcBG = new MovieClip();
        this.tLabel = new TextField();
        this.barProgressTxt = new TextField();
        this.barProgress = new creatureBar();
        this.mcImage = new MovieClip();
        this.bActionTxt = new TextField();
        this.bAction = new MovieClip();
    }
}
