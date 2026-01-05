import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { HatcheryMonsterIcon_CLIP } from './HatcheryMonsterIcon_CLIP';

/**
 * MonsterBunkerPopup_TransferBtnA_CLIP_Persistant - CLIP class for persistent transfer button A
 * Converted from ActionScript to TypeScript
 */
export class MonsterBunkerPopup_TransferBtnA_CLIP_Persistant extends MovieClip {
    public tName: TextField;
    public tHoused: TextField;
    public bAdd: Button_CLIP;
    public tSize: TextField;
    public mcIcon: HatcheryMonsterIcon_CLIP;

    constructor() {
        super();
        this.tName = new TextField();
        this.tHoused = new TextField();
        this.bAdd = new Button_CLIP();
        this.tSize = new TextField();
        this.mcIcon = new HatcheryMonsterIcon_CLIP();
    }
}
