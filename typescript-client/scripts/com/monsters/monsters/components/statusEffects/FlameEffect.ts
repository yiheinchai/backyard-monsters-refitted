import { SpriteData } from "../../../display/SpriteData";
import { SpriteSheetAnimation } from "../../../display/SpriteSheetAnimation";
import { CStatusEffect } from "./CStatusEffect";

// Lazy imports to break circular dependency chains
function getMonsterBase(): any { return require("../../MonsterBase").MonsterBase; }
function getSPRITES(): any { return require("../../../../../SPRITES").SPRITES; }



/**
 * Flame effect - fire damage over time.
 */
export class FlameEffect extends CStatusEffect {
    constructor(monster: MonsterBase, dps: number = 25) {
        super(monster);
        this._dps = dps;
        getSPRITES().SetupSprite("flame");
        this._icon = new SpriteSheetAnimation(getSPRITES().GetSpriteDescriptor("flame") as SpriteData, 1);
        this._icon.play();
    }
}
