import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="HousingPersistentPopup_CLIP")]
@Embed({ source: "/_assets/assets.swf", symbol: "HousingPersistentPopup_CLIP" })
export class HousingPersistentPopup_CLIP extends MovieClip {
    public tTitleBunkers: TextField;
    public title_txt: TextField;
    public tHealthText: TextField;
    public tCapacityText: TextField;
    public m_bgWhite: MovieClip;
    public bJuice: Button_CLIP;
    public m_line: MovieClip;
    public tJuicingText: TextField;
    public bHealAll: Button_CLIP;
    public bClear: Button_CLIP;
    public tTitleHousing: TextField;
    public capacity_desc_txt: TextField;
    public monsterContainerMask: MovieClip;
    public tStorage: TextField;
    public tAscendText: TextField;
    public tTitleHealing: TextField;
    public monsterContainer: MovieClip;
    public mcStorage: MovieClip;
    public bTransfer: Button_CLIP;

    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    private frame1(): void {
        this.stop();
    }
}
