import MovieClip from 'openfl/display/MovieClip';
import { HatcheryMonsterIcon_CLIP } from './HatcheryMonsterIcon_CLIP';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="HatcheryCCMonsterIcon_CLIP")]

/**
 * HatcheryCCMonsterIcon_CLIP - CLIP class for hatchery CC monster icon
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "HatcheryCCMonsterIcon_CLIP" })
export class HatcheryCCMonsterIcon_CLIP extends MovieClip {
    public mcMonster: HatcheryMonsterIcon_CLIP;
    public mcLevel: MovieClip;

    constructor() {
        super();
        this.mcMonster = new HatcheryMonsterIcon_CLIP();
        this.mcLevel = new MovieClip();
    }
}
