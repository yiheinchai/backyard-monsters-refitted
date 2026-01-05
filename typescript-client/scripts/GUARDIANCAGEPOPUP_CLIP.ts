import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { ButtonBrown_CLIP } from './ButtonBrown_CLIP';
import { creatureBarGuardian } from './creatureBarGuardian';
import { frame_CLIP } from './frame_CLIP';
import { GuardianCage_DNABar } from './GuardianCage_DNABar';
import { koth_looted_marker } from './koth_looted_marker';
import { MapRoomPopupInfoMonster_CLIP } from './MapRoomPopupInfoMonster_CLIP';
import { meterBar_rounded_blue_CLIP } from './meterBar_rounded_blue_CLIP';
import { meterBar_rounded_red_CLIP } from './meterBar_rounded_red_CLIP';

/**
 * GUARDIANCAGEPOPUP_CLIP - Base UI clip class for Guardian Cage Popup
 * Contains all UI element declarations for guardian cage popup
 * Converted from ActionScript to TypeScript
 */
export class GUARDIANCAGEPOPUP_CLIP extends MovieClip {
    public buff_txt!: TextField;
    public p3_abilities_txt!: TextField;
    public p3_bLootLeft!: meterBar_rounded_red_CLIP;
    public p3_bSpeed!: creatureBarGuardian;
    public p3_mcImage!: MovieClip;
    public bSpeed!: creatureBarGuardian;
    public tBuffDesc!: TextField;
    public damage_txt2!: TextField;
    public day1!: MovieClip;
    public p3_speed_txt!: TextField;
    public barHP!: MovieClip;
    public day2!: MovieClip;
    public p3_damage_txt!: TextField;
    public buff_txt2!: TextField;
    public tHealth2!: TextField;
    public day3!: MovieClip;
    public p3_mcAbility1!: MovieClip;
    public p3_tKothLevel!: TextField;
    public bBuff!: creatureBarGuardian;
    public tNextFeedTitle!: TextField;
    public p3_buff_txt!: TextField;
    public p3_tDamage!: TextField;
    public p3_bHealth!: creatureBarGuardian;
    public bDamage!: creatureBarGuardian;
    public bEvolve!: Button_CLIP;
    public p3_tDescription2!: TextField;
    public p3_timeleft_txt!: TextField;
    public p3_tSpeed!: TextField;
    public health_txt!: TextField;
    public health_txt2!: TextField;
    public tBuff2!: TextField;
    public mcNextGuardian!: MovieClip;
    public p3_tTimeleft!: TextField;
    public p3_tHP!: TextField;
    public b1!: ButtonBrown_CLIP;
    public mcInstant!: MovieClip;
    public p3_bTimeleft!: meterBar_rounded_blue_CLIP;
    public b2!: ButtonBrown_CLIP;
    public tTitle!: TextField;
    public tSpeed!: TextField;
    public tSpeed2!: TextField;
    public b3!: ButtonBrown_CLIP;
    public tHealth!: TextField;
    public bDamage2!: creatureBarGuardian;
    public mcFeed1!: MapRoomPopupInfoMonster_CLIP;
    public p3_gRankBG!: MovieClip;
    public p3_looted_txt!: TextField;
    public p3_bDamage!: creatureBarGuardian;
    public tFeedsFrom!: TextField;
    public barDNA!: GuardianCage_DNABar;
    public mcFeed2!: MapRoomPopupInfoMonster_CLIP;
    public p3_bHeal!: Button_CLIP;
    public bHeal!: Button_CLIP;
    public mcCurrGuardian!: MovieClip;
    public p3_health_txt!: TextField;
    public p3_tBuff!: TextField;
    public p3_bHP!: MovieClip;
    public tEvoDesc!: TextField;
    public tEvoStage!: TextField;
    public mcImage!: MovieClip;
    public speed_txt2!: TextField;
    public bHealth2!: creatureBarGuardian;
    public p3_mcLootMark2!: koth_looted_marker;
    public p3_tDescription!: TextField;
    public mcFrame!: frame_CLIP;
    public tHP!: TextField;
    public tBuff!: TextField;
    public bFeedTimer!: MovieClip;
    public barDNA_mask!: MovieClip;
    public window!: MovieClip;
    public tDamage!: TextField;
    public bSpeed2!: creatureBarGuardian;
    public gFeedBG!: MovieClip;
    public damage_txt!: TextField;
    public speed_txt!: TextField;
    public bHealth!: creatureBarGuardian;
    public tNextFeed!: TextField;
    public tDamage2!: TextField;
    public bBuff2!: creatureBarGuardian;
    public barDNA_bg!: GuardianCage_DNABar;
    public p3_mcLootMark1!: koth_looted_marker;
    public p3_tLootLeft!: TextField;
    public p3_tHealth!: TextField;
    public p3_bBuff!: creatureBarGuardian;

    constructor() {
        super();
    }
}
