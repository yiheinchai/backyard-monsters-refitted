import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';

/**
 * ChampionChamberFrozen - Champion chamber frozen component
 * Converted from ActionScript to TypeScript
 */
export class ChampionChamberFrozen extends MovieClip {
    public tName: TextField;
    public bFreeze: Button_CLIP;
    public mcImage: MovieClip;

    constructor() {
        super();
        this.tName = new TextField();
        this.bFreeze = new Button_CLIP();
        this.mcImage = new MovieClip();
    }
}
