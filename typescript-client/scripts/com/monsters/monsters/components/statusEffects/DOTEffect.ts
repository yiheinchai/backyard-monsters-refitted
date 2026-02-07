import { SpriteData } from "../../../display/SpriteData";
import { SpriteSheetAnimation } from "../../../display/SpriteSheetAnimation";
import { CStatusEffect } from "./CStatusEffect";

// Lazy imports to break circular dependency chains
function getMonsterBase(): any { return require("../../MonsterBase").MonsterBase; }
function getSPRITES(): any { return require("../../../../../SPRITES").SPRITES; }



/**
 * DOT effect - damage over time status effect with stacking/renewal options.
 */
export class DOTEffect extends CStatusEffect {
    public static readonly kDOTType_Stacks: number = 0;
    public static readonly kDOTType_Renews: number = 1;

    private _initialDPS: number = 0;
    private _renewsPerAttack: number = 0;
    private _numRenews: number = -1;
    private _stacks: number = 1;
    private _dotType: number = 0;

    constructor(target: MonsterBase, dps: number = 0, spriteKey: string = "venom", dotType: number = 0, numRenews: number = -1) {
        super(target);
        this._renewsPerAttack = this._numRenews = numRenews;
        this._initialDPS = this._dps = dps;
        getSPRITES().SetupSprite(spriteKey);
        this._icon = new SpriteSheetAnimation(getSPRITES().GetSpriteDescriptor(spriteKey) as SpriteData, 1);
        this._icon.play();
    }

    protected override updateDPS(delta: number): void {
        super.updateDPS(delta);
        if (this._numRenews > 0) {
            --this._numRenews;
        }
        if (!this._numRenews) {
            this.unregister();
        }
    }

    public override renew(): void {
        if (this._dotType === DOTEffect.kDOTType_Stacks) {
            ++this._stacks;
            this._dps = this._initialDPS * this._stacks;
        } else if (this._dotType === DOTEffect.kDOTType_Renews) {
            if (this._numRenews > -1) {
                this._numRenews += this._renewsPerAttack;
            }
        }
    }
}
