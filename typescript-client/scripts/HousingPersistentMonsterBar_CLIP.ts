import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { HatcheryMonsterIcon_CLIP } from './HatcheryMonsterIcon_CLIP';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="HousingPersistentMonsterBar_CLIP")]
@Embed({ source: "/_assets/assets.swf", symbol: "HousingPersistentMonsterBar_CLIP" })
export class HousingPersistentMonsterBar_CLIP extends MovieClip {
    public tName: TextField;
    public bFinish: Button_CLIP;
    public bCancel: Button_CLIP;
    public tCapacityText: TextField;
    public bJuice: Button_CLIP;
    public m_capacityBar: MovieClip;
    public tHealStatusText: TextField;
    public bHeal: Button_CLIP;
    public m_shine: MovieClip;
    public mcIcon: HatcheryMonsterIcon_CLIP;
    public m_healthBar: MovieClip;

    constructor() {
        super();
    }
}
