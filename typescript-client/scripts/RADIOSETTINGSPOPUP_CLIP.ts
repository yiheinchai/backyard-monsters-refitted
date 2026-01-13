import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { frame_CLIP } from './frame_CLIP';
import { CheckBox_CLIP } from './CheckBox_CLIP';
import { Button_CLIP } from './Button_CLIP';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="RADIOSETTINGSPOPUP_CLIP")]
@Embed({ source: "/_assets/assets.swf", symbol: "RADIOSETTINGSPOPUP_CLIP" })
export class RADIOSETTINGSPOPUP_CLIP extends MovieClip {
    public tAttack: TextField;
    public tEmail: TextField;
    public mcBG: frame_CLIP;
    public cbNews: CheckBox_CLIP;
    public bSave: Button_CLIP;
    public tNews: TextField;
    public tDesc: TextField;
    public tTitle: TextField;
    public tEmailInput: TextField;
    public tProxy: TextField;
    public cbAttack: CheckBox_CLIP;
    public cbProxy: CheckBox_CLIP;

    constructor() {
        super();
    }
}
