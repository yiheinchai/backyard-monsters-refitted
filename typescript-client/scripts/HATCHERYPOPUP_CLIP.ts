import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { buttonClose_CLIP } from './buttonClose_CLIP';
import { creatureBar } from './creatureBar';
import { frame_CLIP } from './frame_CLIP';
import { HatcheryMonsterIcon_CLIP } from './HatcheryMonsterIcon_CLIP';
import { ScrollSet_CLIP } from './ScrollSet_CLIP';

/**
 * HATCHERYPOPUP_CLIP - Base UI clip class for Hatchery Popup
 * Contains all UI element declarations for hatchery popup
 * Converted from ActionScript to TypeScript
 */
export class HATCHERYPOPUP_CLIP extends MovieClip {
    public mcCount4!: MovieClip;
    public monsterCanvas!: MovieClip;
    public mcRemove4!: buttonClose_CLIP;
    public tProgress!: TextField;
    public mcCount2!: MovieClip;
    public mcMonsterInfo!: MovieClip;
    public monsterMask!: MovieClip;
    public mcCount3!: MovieClip;
    public title_txt!: TextField;
    public mcCount1!: MovieClip;
    public bProgress!: creatureBar;
    public bContinue!: Button_CLIP;
    public slot0!: HatcheryMonsterIcon_CLIP;
    public txtGuide!: TextField;
    public bFinish!: MovieClip;
    public slot1!: HatcheryMonsterIcon_CLIP;
    public scroller!: ScrollSet_CLIP;
    public slot2!: HatcheryMonsterIcon_CLIP;
    public slot3!: HatcheryMonsterIcon_CLIP;
    public slot4!: HatcheryMonsterIcon_CLIP;
    public mcRemove3!: buttonClose_CLIP;
    public portrait1!: MovieClip;
    public mcRemove2!: buttonClose_CLIP;
    public mcFrame!: frame_CLIP;
    public mcOverdrive!: MovieClip;
    public mcRemove1!: buttonClose_CLIP;
    public mcMessage!: MovieClip;
    public mcRemove0!: buttonClose_CLIP;
    public bSpeedup!: MovieClip;

    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    protected frame1(): void {
        this.stop();
    }
}
