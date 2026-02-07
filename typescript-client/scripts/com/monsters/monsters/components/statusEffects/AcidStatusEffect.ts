import { SpriteData } from "../../../display/SpriteData";
import { SpriteSheetAnimation } from "../../../display/SpriteSheetAnimation";
import { CStatusEffect } from "./CStatusEffect";

// Lazy imports to break circular dependency chains
function getMonsterBase(): any { return require("../../MonsterBase").MonsterBase; }
function getSPRITES(): any { return require("../../../../../SPRITES").SPRITES; }



/**
 * Acid status effect - damage over time from acid.
 */
export class AcidStatusEffect extends CStatusEffect {
    constructor(monster: MonsterBase, dps: number) {
        super(monster);
        this._dps = dps;
        getSPRITES().SetupSprite("venomBal");
        this._icon = new SpriteSheetAnimation(getSPRITES().GetSpriteDescriptor("venomBal") as SpriteData, 1);
        this._icon.play();
    }
}
