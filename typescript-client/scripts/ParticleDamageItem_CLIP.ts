import Sprite from 'openfl/display/Sprite';
import TextField from 'openfl/text/TextField';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="ParticleDamageItem_CLIP")]

/**
 * ParticleDamageItem_CLIP - CLIP class for damage particle display
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "ParticleDamageItem_CLIP" })
export class ParticleDamageItem_CLIP extends Sprite {
    public tLootA: TextField;
    public tLootB: TextField;

    constructor() {
        super();
        this.tLootA = new TextField();
        this.tLootB = new TextField();
    }
}
