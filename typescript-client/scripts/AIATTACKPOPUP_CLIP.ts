import MovieClip from 'openfl/display/MovieClip';
import { Button_CLIP } from './Button_CLIP';
import { HousingPopupMonster_CLIP } from './HousingPopupMonster_CLIP';
import { frame_CLIP } from './frame_CLIP';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="AIATTACKPOPUP_CLIP")]

/**
 * AIATTACKPOPUP_CLIP - Base UI clip class for AI Attack popup
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "AIATTACKPOPUP_CLIP" })
export class AIATTACKPOPUP_CLIP extends MovieClip {
    public waitBtn!: Button_CLIP;
    public name_txt: any; // TextField
    public title_txt: any; // TextField
    public c1!: HousingPopupMonster_CLIP;
    public c2!: HousingPopupMonster_CLIP;
    public c3!: HousingPopupMonster_CLIP;
    public sendNow!: Button_CLIP;
    public mcImage: any; // MovieClip
    public mcFrame!: frame_CLIP;
    
    constructor() {
        super();
    }
}
