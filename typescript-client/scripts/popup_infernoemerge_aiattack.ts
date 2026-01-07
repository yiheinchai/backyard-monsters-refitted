import { MovieClip } from "openfl/display/MovieClip";
import { TextField } from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";
import { HousingPopupMonster_CLIP } from "./HousingPopupMonster_CLIP";
import { frame3_CLIP } from "./frame3_CLIP";

// [Embed(source="/_assets/assets.swf", symbol="popup_infernoemerge_aiattack")]
export class popup_infernoemerge_aiattack extends MovieClip {
    public tName: TextField;
    public c1: HousingPopupMonster_CLIP;
    public c2: HousingPopupMonster_CLIP;
    public tTitle: TextField;
    public c3: HousingPopupMonster_CLIP;
    public c4: HousingPopupMonster_CLIP;
    public c5: HousingPopupMonster_CLIP;
    public mcImage: MovieClip;
    public mcFrame: frame3_CLIP;
    public bAction: Button_CLIP;

    constructor() {
        super();
    }
}
