import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";
import Point from "openfl/geom/Point";
import SoundChannel from "openfl/media/SoundChannel";
import { TweenLite, Expo } from "gs/TweenLite";

import { SpriteData } from "../../display/SpriteData";
import { SpriteSheetAnimation } from "../../display/SpriteSheetAnimation";
import { ChampionBase } from "../../monsters/champions/ChampionBase";
import { DecoyEffect } from "../../monsters/components/statusEffects/DecoyEffect";
import { CreepBase } from "../../monsters/creeps/CreepBase";
import { SiegeWeaponProperty } from "../SiegeWeaponProperty";
import { SiegeWeapon } from "./SiegeWeapon";

import { DROPZONE } from "../../../../DROPZONE";

// Lazy imports to break circular dependency chains
function getInstanceManager(): any { return require("../../managers/InstanceManager").InstanceManager; }
function getBASE(): any { return require("../../../../BASE").BASE; }
function getBFOUNDATION(): any { return require("../../../../BFOUNDATION").BFOUNDATION; }
function getBUILDING22(): any { return require("../../../../BUILDING22").BUILDING22; }
function getBMUSHROOM(): any { return require("../../../../BMUSHROOM").BMUSHROOM; }
function getCREATURES(): any { return require("../../../../CREATURES").CREATURES; }
function getGLOBAL(): any { return require("../../../../GLOBAL").GLOBAL; }
function getMAP(): any { return require("../../../../MAP").MAP; }
function getSOUNDS(): any { return require("../../../../SOUNDS").SOUNDS; }
function getSPRITES(): any { return require("../../../../SPRITES").SPRITES; }
function getTargeting(): any { return require("../../../../Targeting").Targeting; }


/**
 * Decoy - siege weapon that attracts defenders and explodes.
 */
export class Decoy extends SiegeWeapon {
    public static readonly ID: string = "decoy";
    public static readonly DAMAGE: string = "siegeWeaponDamage";
    public static readonly EXPLOSION_SOUND: string = "othersounds/decoyExplosionSound.mp3";
    public static readonly LOOPING_SOUND: string = "othersounds/decoyLoopingSound.mp3";
    public static readonly DECOY_WAVE: string = "decoyWaveAnimation";
    public static readonly DECOY_FUSE: string = "decoyFuseAnimation";
    public static readonly DECOY_EXPLOSION: string = "decoyExplosionAnimation";
    public static readonly LAND_SOUND: string = "othersounds/decoyLandSound.mp3";

    public x: number = 0;
    public y: number = 0;
    public decoyGraphic: SpriteSheetAnimation | null = null;
    private _attractedCreeps: Array<CreepBase> = [];
    private _loopingChannel: SoundChannel | null = null;
    private _isActive: boolean = false;
    private _container: Sprite | null = null;
    private _fuse: SpriteSheetAnimation | null = null;

    constructor() {
        super();
        this.weaponID = Decoy.ID;
        this.dropTarget = DROPZONE.SIEGEWEAPON_GROUND_SPECIAL;
        this.addProperty(Decoy.DAMAGE, new SiegeWeaponProperty([1000, 1500, 2500, 3500, 4500, 6500, 9000, 12500, 17000, 23500], 1));
        this.addProperty(SiegeWeapon.RANGE, new SiegeWeaponProperty([250, 270, 290, 310, 320, 350, 380, 410, 440, 480], 2));
        this.addProperty(SiegeWeapon.DURATION, new SiegeWeaponProperty([10, 11, 12, 12, 14, 15, 17, 18, 19, 21], 3));
        this.addProperty(SiegeWeapon.UPGRADE_COSTS, new SiegeWeaponProperty([
            { "r1": 37599.9587467407, "r2": 43866.6185378641, "r3": 43866.6185378641, "r4": 0, "time": 14400 },
            { "r1": 72169.829039505, "r2": 84198.1338794225, "r3": 84198.1338794225, "r4": 0, "time": 18900 },
            { "r1": 138513.14459241, "r2": 161598.668691145, "r3": 161598.668691145, "r4": 0, "time": 25200 },
            { "r1": 265769.311821143, "r2": 310064.197124667, "r3": 310064.197124667, "r4": 0, "time": 36000 },
            { "r1": 509415.86296686, "r2": 594318.50679467, "r3": 594318.50679467, "r4": 0, "time": 55800 },
            { "r1": 972778.278801511, "r2": 1134907.9919351, "r3": 1134907.9919351, "r4": 0, "time": 86400 },
            { "r1": 1833130.23035504, "r2": 2138651.93541421, "r3": 2138651.93541421, "r4": 0, "time": 216000 },
            { "r1": 3309676.9374281, "r2": 3861289.76033278, "r3": 3861289.76033278, "r4": 0, "time": 302400 },
            { "r1": 5369777.93088871, "r2": 6264740.91937016, "r3": 6264740.91937016, "r4": 0, "time": 345600 },
            { "r1": 7386672.13671496, "r2": 8617784.15950078, "r3": 8617784.15950078, "r4": 0, "time": 388800 }
        ]));
        this.addProperty(SiegeWeapon.BUILD_COSTS, new SiegeWeaponProperty([
            { "r1": 14324, "r2": 28648, "r3": 28648, "r4": 0, "time": 3000 },
            { "r1": 27493, "r2": 54987, "r3": 54987, "r4": 0, "time": 4500 },
            { "r1": 52767, "r2": 105534, "r3": 105534, "r4": 0, "time": 7200 },
            { "r1": 101245, "r2": 202491, "r3": 202491, "r4": 0, "time": 9900 },
            { "r1": 194063, "r2": 388126, "r3": 388126, "r4": 0, "time": 15300 },
            { "r1": 370582, "r2": 741164, "r3": 741164, "r4": 0, "time": 22500 },
            { "r1": 698335, "r2": 1396671, "r3": 1396671, "r4": 0, "time": 34200 },
            { "r1": 1260829, "r2": 2521659, "r3": 2521659, "r4": 0, "time": 51300 },
            { "r1": 2045630, "r2": 4091259, "r3": 4091259, "r4": 0, "time": 76500 },
            { "r1": 2813970, "r2": 5627941, "r3": 5627941, "r4": 0, "time": 86400 }
        ]));
        this.loadAssets();
    }

    private loadAssets(): void {
        getSPRITES().SetupSprite(Decoy.DECOY_EXPLOSION);
        getSPRITES().SetupSprite(Decoy.DECOY_FUSE);
        getSPRITES().SetupSprite(Decoy.DECOY_WAVE);
    }

    public get damage(): number {
        return Math.max(0, Math.min(23500, this.getProperty(Decoy.DAMAGE).getValueForLevel(this.level)));
    }

    public override onActivation(x: number, y: number): void {
        this.loadAssets();
        this.x = x;
        this.y = y;
        this._container = new Sprite();
        this._container.x = x;
        this._container.y = y;
        this.setDecoyGraphic(new SpriteSheetAnimation(getSPRITES().GetSpriteDescriptor(Decoy.DECOY_WAVE) as SpriteData, 45));
        this._fuse = new SpriteSheetAnimation(getSPRITES().GetSpriteDescriptor(Decoy.DECOY_FUSE) as SpriteData, 21);
        this._fuse.x = this.decoyGraphic!.x + -8;
        this._fuse.y = this.decoyGraphic!.y + 30;
        this._fuse.render();
        this._container.addChild(this._fuse);
        getMAP()._BUILDINGTOPS.addChild(this._container);
        TweenLite.from(this._container, 0.6, {
            "y": this._container.y - 300,
            "ease": Expo.easeIn,
            "onComplete": this.onDecoyLanding.bind(this)
        });
        TweenLite.delayedCall(this.duration - 0.5, this.startFuseAnimation.bind(this));
        this._attractedCreeps = [];
        getSOUNDS().Play(Decoy.LAND_SOUND);
    }

    private startFuseAnimation(): void {
        this._fuse!.play();
    }

    private onDecoyLanding(): void {
        this._isActive = true;
        this._loopingChannel = getSOUNDS().Play(Decoy.LOOPING_SOUND, 0.8, 0, Number.MAX_VALUE);
        this.decoyGraphic!.play();
        this.decoyGraphic!.doesRepeat = true;
        this._container!.addEventListener(Event.ENTER_FRAME, this.onEnterFrame.bind(this));
        this.ejectDefendersFromBunkers();
    }

    private ejectDefendersFromBunkers(): void {
        const buildings: Array<BFOUNDATION> = [];
        getBASE().GetBuildingOverlap(this.x, this.y, this.range, buildings);
        for (let i = 0; i < buildings.length; i++) {
            if (buildings[i] instanceof getBUILDING22()) {
                (buildings[i] as BUILDING22).EjectCreeps(new Point(this.x, this.y));
            }
        }
    }

    private updateDecoy(): void {
        const creepsInRange = this.getDefendingCreepsInRange();
        for (let i = 0; i < creepsInRange.length; i++) {
            if (creepsInRange[i] instanceof CreepBase) {
                const creep = creepsInRange[i] as CreepBase;
                if (this._attractedCreeps.indexOf(creep) === -1) {
                    this.attractCreep(creep);
                }
            }
        }
        for (let i = this._attractedCreeps.length - 1; i >= 0; i--) {
            const creep = this._attractedCreeps[i];
            if (creepsInRange.indexOf(creep) === -1) {
                this.detractCreep(creep, i);
            }
        }
        this.ejectDefendersFromBunkers();
    }

    private attractCreep(creep: CreepBase): void {
        this._attractedCreeps.push(creep);
        creep.addStatusEffect(new DecoyEffect(creep));
        creep.changeModeDecoy();
    }

    private detractCreep(creep: CreepBase, index: number): void {
        this._attractedCreeps.splice(index, 1);
        creep.findDefenseTargets();
        creep.removeStatusEffect(DecoyEffect);
        TweenLite.killDelayedCallsTo(this.startFuseAnimation.bind(this));
    }

    public override onDeactivation(): void {
        const pos = new Point(this.x, this.y);
        const targets: Array<any> = this.getDefendingCreepsInRange();
        const buildings = getInstanceManager().getInstancesByClass(getBFOUNDATION());
        for (const building of buildings) {
            const b = building as BFOUNDATION;
            if (!(b instanceof getBMUSHROOM()) && getGLOBAL().QuickDistance(pos, new Point(b.x, b.y)) < this.range * 0.65) {
                targets.push(b);
            }
        }
        getTargeting().DealLinearAEDamage(pos, this.range, this.damage, targets);
        for (let i = this._attractedCreeps.length - 1; i >= 0; i--) {
            const creep = this._attractedCreeps[i];
            this.detractCreep(creep, i);
        }
        getSOUNDS().Play(Decoy.EXPLOSION_SOUND);
        if (this._loopingChannel) {
            this._loopingChannel.stop();
        }
        this._container!.removeChild(this._fuse!);
        this.setDecoyGraphic(new SpriteSheetAnimation(getSPRITES().GetSpriteDescriptor(Decoy.DECOY_EXPLOSION) as SpriteData, 33));
        this.decoyGraphic!.play();
        this._isActive = false;
    }

    private setDecoyGraphic(graphic: SpriteSheetAnimation): void {
        if (Boolean(this.decoyGraphic) && Boolean(this.decoyGraphic!.parent)) {
            this.decoyGraphic!.parent.removeChild(this.decoyGraphic!);
        }
        this.decoyGraphic = graphic;
        this.decoyGraphic.render();
        this.decoyGraphic.x = -(this.decoyGraphic.width * 0.5);
        this.decoyGraphic.y = -(this.decoyGraphic.height * 0.5);
        this._container!.addChild(this.decoyGraphic);
    }

    private onEnterFrame(event: Event): void {
        this.decoyGraphic!.update();
        if (this._isActive) {
            this.updateDecoy();
            this._fuse!.update();
        } else if (this.decoyGraphic!.currentFrame >= this.decoyGraphic!.totalFrames) {
            this._container!.removeEventListener(Event.ENTER_FRAME, this.onEnterFrame.bind(this));
            if (this._container!.parent) {
                this._container!.parent.removeChild(this._container!);
            }
        }
    }

    private getDefendingCreepsInRange(maxCount: number = Number.MAX_VALUE): Array<any> {
        const result: Array<any> = [];
        if (!this._isActive) {
            return [];
        }
        const pos = new Point(this.x, this.y);
        const creatures = getCREATURES()._creatures;
        if (getCREATURES()._guardian) {
            if (getGLOBAL().QuickDistance(new Point(getCREATURES()._guardian._mc.x, getCREATURES()._guardian._mc.y), pos) <= this.range) {
                result.push(getCREATURES()._guardian);
            }
        }
        for (const key in creatures) {
            const creep = creatures[key];
            if (!(creep._behaviour !== "defend" && creep._behaviour !== "bunker" && creep._behaviour !== "decoy" && !(creep instanceof ChampionBase))) {
                const dist = getGLOBAL().QuickDistance(new Point(creep._mc.x, creep._mc.y), pos);
                if (dist <= this.range) {
                    result.push(creep);
                    if (result.length >= maxCount) {
                        return result;
                    }
                }
            }
        }
        return result;
    }
}
