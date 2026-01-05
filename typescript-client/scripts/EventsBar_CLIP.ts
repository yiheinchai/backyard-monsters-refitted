import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { creatureBar } from './creatureBar';

/**
 * EventsBar_CLIP - Events progress bar UI
 * Displays event status and progress
 * Converted from ActionScript to TypeScript
 */
export class EventsBar_CLIP extends MovieClip {
    public mcHit!: MovieClip;
    public mcBG!: MovieClip;
    public tLabel!: TextField;
    public barProgressTxt!: TextField;
    public tTitle!: TextField;
    public barProgress!: creatureBar;
    public bHelp!: MovieClip;
    public mcImage!: MovieClip;
    public bActionTxt!: TextField;
    public bAction!: MovieClip;
    public mcLogo!: MovieClip;

    constructor() {
        super();
    }
}
