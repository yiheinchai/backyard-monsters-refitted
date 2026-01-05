import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { buttonClose_CLIP } from './buttonClose_CLIP';
import { creatureBar } from './creatureBar';
import { frame_CLIP } from './frame_CLIP';
import { HatcheryMonsterIcon_CLIP } from './HatcheryMonsterIcon_CLIP';
import { ScrollSet_CLIP } from './ScrollSet_CLIP';

/**
 * HATCHERYCCPOPUP_CLIP - Base UI clip class for Hatchery CC Popup
 * Contains all UI element declarations for hatchery command center popup
 * Converted from ActionScript to TypeScript
 */
export class HATCHERYCCPOPUP_CLIP extends MovieClip {
    public tHousingLabel!: TextField;
    public mcRemove6!: buttonClose_CLIP;
    public hatchery5!: HatcheryMonsterIcon_CLIP;
    public mcCount4!: MovieClip;
    public mcRemove5!: buttonClose_CLIP;
    public mcCount5!: MovieClip;
    public hatchery2!: HatcheryMonsterIcon_CLIP;
    public hatcheryBG4!: MovieClip;
    public monsterCanvas!: MovieClip;
    public mcRemove4!: buttonClose_CLIP;
    public mcMonsterInfo!: MovieClip;
    public hatchery3!: HatcheryMonsterIcon_CLIP;
    public mcCount2!: MovieClip;
    public hatcheryBG5!: MovieClip;
    public monsterMask!: MovieClip;
    public mcCount3!: MovieClip;
    public hatchery1!: HatcheryMonsterIcon_CLIP;
    public bProgress5!: creatureBar;
    public title_txt!: TextField;
    public mcGoo!: MovieClip;
    public hatcheryRemove5!: buttonClose_CLIP;
    public mcCount1!: MovieClip;
    public bProgress4!: creatureBar;
    public bContinue!: Button_CLIP;
    public hatcheryRemove4!: buttonClose_CLIP;
    public bProgress3!: creatureBar;
    public txtGuide!: TextField;
    public bProgress2!: creatureBar;
    public slot1!: HatcheryMonsterIcon_CLIP;
    public scroller!: ScrollSet_CLIP;
    public bFinish!: MovieClip;
    public bProgress1!: creatureBar;
    public slot2!: HatcheryMonsterIcon_CLIP;
    public txtGoo!: TextField;
    public txtStorage!: TextField;
    public hatlabel4_txt!: TextField;
    public hatcheryRemove1!: buttonClose_CLIP;
    public slot3!: HatcheryMonsterIcon_CLIP;
    public mcMagma!: MovieClip;
    public hatlabel5_txt!: TextField;
    public slot4!: HatcheryMonsterIcon_CLIP;
    public hatcheryRemove3!: buttonClose_CLIP;
    public tProgress5!: TextField;
    public slot5!: HatcheryMonsterIcon_CLIP;
    public txtMagma!: TextField;
    public tGooLabel!: TextField;
    public mcRemove3!: buttonClose_CLIP;
    public hatcheryRemove2!: buttonClose_CLIP;
    public tProgress4!: TextField;
    public hatcheryBG2!: MovieClip;
    public mcSlotsGoldFrame!: MovieClip;
    public slot6!: HatcheryMonsterIcon_CLIP;
    public bTopupMagma!: MovieClip;
    public mcRemove2!: buttonClose_CLIP;
    public tProgress3!: TextField;
    public hatcheryBG3!: MovieClip;
    public slot7!: HatcheryMonsterIcon_CLIP;
    public mcFrame!: frame_CLIP;
    public mcOverdrive!: MovieClip;
    public hatlabel1_txt!: TextField;
    public mcRemove1!: buttonClose_CLIP;
    public tProgress2!: TextField;
    public bTopup!: MovieClip;
    public hatlabel2_txt!: TextField;
    public mcCount6!: MovieClip;
    public tProgress1!: TextField;
    public hatcheryBG1!: MovieClip;
    public bSpeedup!: MovieClip;
    public tMagmaLabel!: TextField;
    public mcStorage!: MovieClip;
    public hatlabel3_txt!: TextField;
    public mcRemove7!: buttonClose_CLIP;
    public mcCount7!: MovieClip;
    public hatchery4!: HatcheryMonsterIcon_CLIP;

    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    protected frame1(): void {
        this.stop();
    }
}
