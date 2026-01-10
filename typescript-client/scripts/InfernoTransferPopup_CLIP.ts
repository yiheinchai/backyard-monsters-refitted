import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { InfernoTransferMonster_CLIP } from './InfernoTransferMonster_CLIP';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="InfernoTransferPopup_CLIP")]
@Embed({ source: "/_assets/assets.swf", symbol: "InfernoTransferPopup_CLIP" })
export class InfernoTransferPopup_CLIP extends MovieClip {
    public m8: InfernoTransferMonster_CLIP;
    public m9: InfernoTransferMonster_CLIP;
    public transfer_action_txt: TextField;
    public title_txt: TextField;
    public m10: InfernoTransferMonster_CLIP;
    public m11: InfernoTransferMonster_CLIP;
    public m12: InfernoTransferMonster_CLIP;
    public m13: InfernoTransferMonster_CLIP;
    public m14: InfernoTransferMonster_CLIP;
    public m1: InfernoTransferMonster_CLIP;
    public m15: InfernoTransferMonster_CLIP;
    public m2: InfernoTransferMonster_CLIP;
    public m3: InfernoTransferMonster_CLIP;
    public capacity_desc_txt: TextField;
    public m4: InfernoTransferMonster_CLIP;
    public tStorage: TextField;
    public transfer_desc_txt: TextField;
    public m5: InfernoTransferMonster_CLIP;
    public m6: InfernoTransferMonster_CLIP;
    public m7: InfernoTransferMonster_CLIP;
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
