import { SpriteData } from "../../../display/SpriteData";
import { SpriteSheetAnimation } from "../../../display/SpriteSheetAnimation";
import { CStatusEffect } from "./CStatusEffect";

// Lazy imports to break circular dependency chains
function getMonsterBase(): any { return require("../../MonsterBase").MonsterBase; }
function getSPRITES(): any { return require("../../../../../SPRITES").SPRITES; }



/**
 * Decoy effect - makes monster a decoy target.
 */
export class DecoyEffect extends CStatusEffect {
    constructor(monster: MonsterBase) {
        super(monster);
        this._dps = 0;
        getSPRITES().SetupSprite("heart");
        this._icon = new SpriteSheetAnimation(getSPRITES().GetSpriteDescriptor("heart") as SpriteData, 1);
        this._icon.play();
    }
}
