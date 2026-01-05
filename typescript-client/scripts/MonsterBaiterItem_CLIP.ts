import MovieClip from 'openfl/display/MovieClip';
import SimpleButton from 'openfl/display/SimpleButton';
import TextField from 'openfl/text/TextField';
import { HatcheryMonsterIcon_CLIP } from './HatcheryMonsterIcon_CLIP';

/**
 * MonsterBaiterItem_CLIP - CLIP class for monster baiter item
 * Converted from ActionScript to TypeScript
 */
export class MonsterBaiterItem_CLIP extends MovieClip {
    public tInfo: TextField;
    public tName: TextField;
    public decr_btn: SimpleButton;
    public mcIcon: HatcheryMonsterIcon_CLIP;
    public incr_btn: SimpleButton;

    constructor() {
        super();
        this.tInfo = new TextField();
        this.tName = new TextField();
        this.decr_btn = new SimpleButton();
        this.mcIcon = new HatcheryMonsterIcon_CLIP();
        this.incr_btn = new SimpleButton();
    }
}
