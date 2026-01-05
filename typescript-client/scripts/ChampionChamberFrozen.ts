import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';

export class ChampionChamberFrozen extends MovieClip {
    public tName!: TextField;
    public bFreeze!: Button_CLIP;
    public mcImage!: MovieClip;

    constructor() {
        super();
    }
}
