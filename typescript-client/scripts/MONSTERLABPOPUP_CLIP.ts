import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { creatureBarAdv } from './creatureBarAdv';
import { frame_CLIP } from './frame_CLIP';

/**
 * MONSTERLABPOPUP_CLIP - Base UI clip class for Monster Lab Popup
 * Contains all UI element declarations for monster lab popup
 * Converted from ActionScript to TypeScript
 */
export class MONSTERLABPOPUP_CLIP extends MovieClip {
    public tStatusDesc!: TextField;
    public tStatusTitle!: TextField;
    public tStatsPBarLabel!: TextField;
    public tProgress!: TextField;
    public tStatsPBar!: TextField;
    public title_txt!: TextField;
    public bContinue!: Button_CLIP;
    public mcList!: MovieClip;
    public txtGuide!: TextField;
    public tStatsWarning!: TextField;
    public mcInstant!: MovieClip;
    public tIdle!: TextField;
    public mcResources!: MovieClip;
    public mcPBarStatus!: creatureBarAdv;
    public mcPBarStats!: creatureBarAdv;
    public mcStatusIcon!: MovieClip;
    public mcFrame!: frame_CLIP;
    public tStatsTitle!: TextField;
    public bAction!: Button_CLIP;
    public mcPortraitIcon!: MovieClip;

    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    protected frame1(): void {
        this.stop();
    }
}
