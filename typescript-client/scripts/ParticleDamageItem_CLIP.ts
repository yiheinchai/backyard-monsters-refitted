import Sprite from 'openfl/display/Sprite';
import TextField from 'openfl/text/TextField';
//    [Embed(source="/_assets/assets.swf", symbol="ParticleDamageItem_CLIP")]

/**
 * ParticleDamageItem_CLIP - CLIP class for damage particle display
 * Converted from ActionScript to TypeScript
 */
export class ParticleDamageItem_CLIP extends Sprite {
    public tLootA: TextField;
    public tLootB: TextField;

    constructor() {
        super();
        this.tLootA = new TextField();
        this.tLootB = new TextField();
    }
}
