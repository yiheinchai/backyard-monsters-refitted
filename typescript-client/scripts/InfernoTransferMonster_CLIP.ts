import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { HatcheryMonsterIcon_CLIP } from './HatcheryMonsterIcon_CLIP';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="InfernoTransferMonster_CLIP")]
@Embed({ source: "/_assets/assets.swf", symbol: "InfernoTransferMonster_CLIP" })
export class InfernoTransferMonster_CLIP extends MovieClip {
    public bRemove: Button_CLIP;
    public tName: TextField;
    public tAvailable: TextField;
    public bAdd: Button_CLIP;
    public mcIcon: HatcheryMonsterIcon_CLIP;

    constructor() {
        super();
    }
}
