import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { HatcheryMonsterIcon_CLIP } from './HatcheryMonsterIcon_CLIP';

/**
 * MonsterBunkerPopup_TransferBtnB_CLIP_Persistant - CLIP class for persistent transfer button B
 * Converted from ActionScript to TypeScript
 */
export class MonsterBunkerPopup_TransferBtnB_CLIP_Persistant extends MovieClip {
    public bRemove: Button_CLIP;
    public tName: TextField;
    public tHoused: TextField;
    public tSize: TextField;
    public mcIcon: HatcheryMonsterIcon_CLIP;

    constructor() {
        super();
        this.bRemove = new Button_CLIP();
        this.tName = new TextField();
        this.tHoused = new TextField();
        this.tSize = new TextField();
        this.mcIcon = new HatcheryMonsterIcon_CLIP();
    }
}
