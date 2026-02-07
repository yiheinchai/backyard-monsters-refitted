import { TweenLite, Bounce } from './gs/TweenLite';
import { ResourcePackage_CLIP } from './ResourcePackage_CLIP';

// Lazy imports to break circular dependency chains
function getBFOUNDATION(): any { return require("./BFOUNDATION").BFOUNDATION; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getMAP(): any { return require("./MAP").MAP; }
function getSOUNDS(): any { return require("./SOUNDS").SOUNDS; }


/**
 * ParticleLoot - Particle effect for loot dropping from buildings
 * Converted from ActionScript to TypeScript
 */
export class ParticleLoot {
    private _resourcePackage: ResourcePackage_CLIP;
    private _building: BFOUNDATION;

    constructor(param1: BFOUNDATION, param2: number, param3: number) {
        if (!getGLOBAL()._catchup) {
            this._building = param1;
            this._resourcePackage = new ResourcePackage_CLIP();
            getMAP()._RESOURCES.addChild(this._resourcePackage);
            this._resourcePackage.mcDot.gotoAndStop(param3);
            this._resourcePackage.x = param1._mc.x;
            this._resourcePackage.y = param1._mc.y;
            this.Launch();
            TweenLite.to(this._resourcePackage, 0.5, {
                "alpha": 0,
                "delay": 1.5,
                "overwrite": 0
            });
            getSOUNDS().Play("bankland");
        }
    }

    public Launch(): void {
        let _loc1_: number;
        let _loc2_: number;
        let _loc3_: number;
        let _loc7_: number;
        _loc1_ = this._building._mcFootprint.width * 0.35;
        _loc2_ = this._building._mcFootprint.height * 0.35;
        _loc3_ = Math.random() * 2 - 1;
        this._resourcePackage.x += _loc3_ * _loc1_;
        const _loc4_: number = this._resourcePackage.x + _loc3_ * _loc1_;
        TweenLite.to(this._resourcePackage, 2, {
            "x": _loc4_,
            "overwrite": 0,
            "onComplete": this.Remove.bind(this)
        });
        const _loc5_: number = Math.random() * 2 - 1;
        this._resourcePackage.y += _loc3_ * _loc2_;
        let _loc6_: number;
        _loc7_ = (_loc6_ = _loc3_ * -1 * _loc2_) + _loc2_ * 1.5;
        this._resourcePackage.mcShadow.y = _loc7_;
        TweenLite.to(this._resourcePackage.mcDot, 1, {
            "y": _loc7_,
            "ease": Bounce.easeOut,
            "overwrite": 0
        });
    }

    public Remove(): void {
        try {
            getMAP()._RESOURCES.removeChild(this._resourcePackage);
        } catch (e: any) {
        }
        this._resourcePackage = null!;
    }
}
