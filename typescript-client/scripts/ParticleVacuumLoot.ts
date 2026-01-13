import { TweenLite, Sine } from './gs/TweenLite';
import { BFOUNDATION } from './BFOUNDATION';
import { GLOBAL } from './GLOBAL';
import { MAP } from './MAP';
import { ResourcePackage_CLIP } from './ResourcePackage_CLIP';
import { SOUNDS } from './SOUNDS';

/**
 * ParticleVacuumLoot - Particle effect for vacuum-style loot collection
 * Converted from ActionScript to TypeScript
 */
export class ParticleVacuumLoot {
    private _resourcePackage: ResourcePackage_CLIP;
    private _building: BFOUNDATION;

    constructor(param1: BFOUNDATION, param2: number, param3: number) {
        if (!GLOBAL._catchup) {
            this._building = param1;
            this._resourcePackage = new ResourcePackage_CLIP();
            MAP._RESOURCES.addChild(this._resourcePackage);
            this._resourcePackage.mcDot.gotoAndStop(param3);
            this._resourcePackage.x = param1._mc.x + param1._spoutPoint.x;
            this._resourcePackage.y = param1._mc.y + param1._spoutPoint.y;
            this._resourcePackage.mcShadow.visible = false;
            this.Launch();
            TweenLite.to(this._resourcePackage, 0.5, {
                "alpha": 0,
                "delay": 1.5,
                "overwrite": 0
            });
            SOUNDS.Play("bankland");
        }
    }

    public Launch(): void {
        let _loc2_: BFOUNDATION;
        const _loc1_: number = 10;
        _loc2_ = GLOBAL.townHall as BFOUNDATION;
        const _loc3_: number = this._resourcePackage.x;
        const _loc4_: number = this._resourcePackage.y + _loc2_._spoutPoint.y - 200;
        this._resourcePackage.x += (Math.random() * 2 - 1) * _loc1_;
        TweenLite.to(this._resourcePackage, 1, {
            "x": _loc3_,
            "y": _loc4_,
            "ease": Sine.easeIn,
            "onComplete": this.Remove.bind(this)
        });
    }

    public Remove(): void {
        try {
            MAP._RESOURCES.removeChild(this._resourcePackage);
        } catch (e: any) {
        }
        this._resourcePackage = null!;
    }
}
