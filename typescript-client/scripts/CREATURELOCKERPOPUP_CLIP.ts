import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { creatureBar } from './creatureBar';
import { frame_CLIP } from './frame_CLIP';

/**
 * CREATURELOCKERPOPUP_CLIP - Base UI clip class for Creature Locker Popup
 * Contains all UI element declarations for creature locker popup
 * Converted from ActionScript to TypeScript
 */
export class CREATURELOCKERPOPUP_CLIP extends MovieClip {
    public bNext!: Button_CLIP;
    public tTime!: TextField;
    public bSpeed!: creatureBar;
    public time_txt!: TextField;
    public bResource!: creatureBar;
    public bInstant!: Button_CLIP;
    public mcButtons!: MovieClip;
    public tResource!: TextField;
    public bDamage!: creatureBar;
    public title_txt!: TextField;
    public bPrevious!: Button_CLIP;
    public bContinue!: Button_CLIP;
    public health_txt!: TextField;
    public mcList!: MovieClip;
    public txtGuide!: TextField;
    public prod_label_txt!: TextField;
    public tSpeed!: TextField;
    public bTime!: creatureBar;
    public bStorage!: creatureBar;
    public tCosts!: TextField;
    public tHealth!: TextField;
    public housing_txt!: TextField;
    public tStorage!: TextField;
    public mcImage!: MovieClip;
    public mcFrame!: frame_CLIP;
    public goo_txt!: TextField;
    public tDescription!: TextField;
    public tDamage!: TextField;
    public damage_txt!: TextField;
    public speed_txt!: TextField;
    public bHealth!: creatureBar;

    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    protected frame1(): void {
        this.stop();
    }
}
