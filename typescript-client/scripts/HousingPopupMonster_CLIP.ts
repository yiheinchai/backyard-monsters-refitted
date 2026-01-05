import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { HatcheryMonsterIcon_CLIP } from './HatcheryMonsterIcon_CLIP';

/**
 * HousingPopupMonster_CLIP - CLIP class for housing popup monster item
 * Converted from ActionScript to TypeScript
 */
export class HousingPopupMonster_CLIP extends MovieClip {
    public tInfo: TextField;
    public tName: TextField;
    public mcIcon: HatcheryMonsterIcon_CLIP;

    constructor() {
        super();
        this.tInfo = new TextField();
        this.tName = new TextField();
        this.mcIcon = new HatcheryMonsterIcon_CLIP();
    }
}
