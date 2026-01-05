import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { creatureBar } from './creatureBar';

/**
 * SiegeBuildingPopup_ListItem_CLIP - List item for siege building popup
 * Displays siege building items with stars and progress
 * Converted from ActionScript to TypeScript
 */
export class SiegeBuildingPopup_ListItem_CLIP extends MovieClip {
    public star1!: MovieClip;
    public tTime!: TextField;
    public star2!: MovieClip;
    public tReady!: TextField;
    public star3!: MovieClip;
    public star4!: MovieClip;
    public star5!: MovieClip;
    public star6!: MovieClip;
    public tLabel!: TextField;
    public star7!: MovieClip;
    public star8!: MovieClip;
    public mcTime!: creatureBar;
    public star9!: MovieClip;
    public mcImage!: MovieClip;
    public tDescription!: TextField;
    public star10!: MovieClip;

    constructor() {
        super();
    }
}
