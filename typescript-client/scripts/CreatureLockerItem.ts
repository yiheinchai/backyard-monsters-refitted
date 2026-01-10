import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
//    [Embed(source="/_assets/assets.swf", symbol="CreatureLockerItem")]

/**
 * CreatureLockerItem - CLIP class for creature locker item
 * Converted from ActionScript to TypeScript
 */
export class CreatureLockerItem extends MovieClip {
    public mcTick: MovieClip;
    public tLabel: TextField;
    public mcBar: MovieClip;

    constructor() {
        super();
        this.mcTick = new MovieClip();
        this.tLabel = new TextField();
        this.mcBar = new MovieClip();
    }
}
