import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { HatcheryMonsterIcon_CLIP } from './HatcheryMonsterIcon_CLIP';
//    [Embed(source="/_assets/assets.swf", symbol="MonsterBunkerPopup_TransferBtnA_CLIP")]

/**
 * MonsterBunkerPopup_TransferBtnA_CLIP - CLIP class for bunker transfer button A
 * Converted from ActionScript to TypeScript
 */
export class MonsterBunkerPopup_TransferBtnA_CLIP extends MovieClip {
    public bRemove: Button_CLIP;
    public tName: TextField;
    public tSelected: TextField;
    public tHoused: TextField;
    public bAdd: Button_CLIP;
    public mcIcon: HatcheryMonsterIcon_CLIP;
    public id: string;
    public _id: string;
    public index: string;

    constructor() {
        super();
        this.bRemove = new Button_CLIP();
        this.tName = new TextField();
        this.tSelected = new TextField();
        this.tHoused = new TextField();
        this.bAdd = new Button_CLIP();
        this.mcIcon = new HatcheryMonsterIcon_CLIP();
        this.id = "";
        this._id = "";
        this.index = "";
    }
}
