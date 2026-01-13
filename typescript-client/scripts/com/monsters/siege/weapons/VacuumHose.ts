import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";
import Point from "openfl/geom/Point";
import Rectangle from "openfl/geom/Rectangle";
import SoundChannel from "openfl/media/SoundChannel";
import { TweenLite, Expo } from "gs/TweenLite";

import { SecNum } from "../../../cc/utils/SecNum";
import { IAttackable } from "../../interfaces/IAttackable";
import { ITargetable } from "../../interfaces/ITargetable";
import { ITickable } from "../../interfaces/ITickable";
import { SiegeWeapons } from "../SiegeWeapons";
import { ResourceOutpost } from "../../../../ResourceOutpost";

import { ATTACK } from "../../../../ATTACK";
import { BASE } from "../../../../BASE";
import { BFOUNDATION } from "../../../../BFOUNDATION";
import { GLOBAL } from "../../../../GLOBAL";
import { MAP } from "../../../../MAP";
import { SOUNDS } from "../../../../SOUNDS";
import { SPRITES } from "../../../../SPRITES";
import { UI2 } from "../../../../UI2";
import { bmp_healthbarsmall } from "../../../../bmp_healthbarsmall";

/**
 * VacuumHose - siege weapon that drains resources from a target.
 */
export class VacuumHose implements IAttackable, ITickable {
    public static readonly MR3_MAX_LOOT_MULTIPLIER: number = 0.1;
    public static readonly END_URL: string = "siegeimages/anim1.bottom.png";
    public static readonly END_NUM_FRAMES: number = 15;
    public static readonly END_WIDTH: number = 52;
    public static readonly END_HEIGHT: number = 52;
    public static readonly PIPE_URL: string = "siegeimages/anim1.top.png";
    public static readonly PIPE_NUM_FRAMES: number = 15;
    public static readonly PIPE_WIDTH: number = 26;
    public static readonly PIPE_HEIGHT: number = 97;

    public _vacuum: Sprite | null = null;
    public _vacuumSound: SoundChannel | null = null;
    public _vacuumHealth: SecNum;
    public _vacuumMaxHealth: number = 0;
    public _vacuumLootRate: SecNum | null = null;
    public _vacuumFrame: number = 0;
    public _vacuumStartTime: number = 0;
    public _vacuumCurrTime: number = 0;
    public _vacuumPipeSource: BitmapData | null = null;
    public _vacuumEndSource: BitmapData | null = null;
    public _vacuumHealthBar: BitmapData;
    public _vacuumLootTotals: Array<number> = [];
    public _target: BFOUNDATION;
    public _totalPossibleLoot: number = 0;
    public _amountLooted: number = 0;

    constructor(target: BFOUNDATION, health: number, lootRate: number) {
        this._vacuumHealthBar = new bmp_healthbarsmall(0, 0);
        this._vacuumHealth = new SecNum(0);
        SPRITES.SetupSprite("vacuum_pipe");
        SPRITES.SetupSprite("vacuum_end");
        this._target = target;
        this.ApplyVacuum(health, lootRate);
    }

    public hasMaxedAmountToLoot(): boolean {
        return this._amountLooted > this._totalPossibleLoot;
    }

    public VacuumLoot(amount: number): void {
        if (!this.hasMaxedAmountToLoot()) {
            let lootAmount = 0;
            const avail = [];
            if (BASE._resources.r1.Get() > 0) {
                avail.push({ "id": 1, "quantity": BASE._resources.r1.Get() });
            }
            if (BASE._resources.r2.Get() > 0) {
                avail.push({ "id": 2, "quantity": BASE._resources.r2.Get() });
            }
            if (BASE._resources.r3.Get() > 0) {
                avail.push({ "id": 3, "quantity": BASE._resources.r3.Get() });
            }
            if (BASE._resources.r4.Get() > 0) {
                avail.push({ "id": 4, "quantity": BASE._resources.r4.Get() });
            }
            if (avail.length > 0) {
                const choice = avail[Math.floor(Math.random() * avail.length)];
                if (choice.quantity >= Math.ceil(amount)) {
                    lootAmount = Math.ceil(amount);
                } else {
                    lootAmount = choice.quantity;
                }
                BASE._resources["r" + choice.id].Add(-lootAmount);
                BASE._hpResources["r" + choice.id] -= lootAmount;
                if (BASE._deltaResources["r" + choice.id]) {
                    BASE._deltaResources["r" + choice.id].Add(-lootAmount);
                    BASE._hpDeltaResources["r" + choice.id] -= lootAmount;
                } else {
                    BASE._deltaResources["r" + choice.id] = new SecNum(-lootAmount);
                    BASE._hpDeltaResources["r" + choice.id] = -lootAmount;
                }
                BASE._deltaResources.dirty = true;
                BASE._hpDeltaResources.dirty = true;
                if (GLOBAL.mode === GLOBAL.e_BASE_MODE.WMATTACK) {
                    lootAmount = Math.floor(lootAmount / 5);
                }
                ATTACK.Loot(choice.id, lootAmount, this._target.x, this._target.y, 9, this._target, true);
                this._vacuumLootTotals[choice.id - 1] += lootAmount;
                this._amountLooted += lootAmount;
            }
        }
        const hp = this._vacuumHealth.Get();
        if (hp < this._vacuumMaxHealth) {
            const frame = 11 - Math.floor(11 / this._vacuumMaxHealth * hp);
            this._vacuumEndSource!.copyPixels(this._vacuumHealthBar, new Rectangle(0, 5 * frame, 17, 5), new Point(17, 6));
        }
    }

    public get health(): number {
        return this._vacuumHealth.Get();
    }

    public get maxHealth(): number {
        return this._vacuumMaxHealth;
    }

    public modifyHealth(amount: number, source: ITargetable | null = null): number {
        this._vacuumHealth.Set(this._vacuumHealth.Get() + amount);
        return amount;
    }

    public get x(): number {
        return this._vacuum!.x;
    }

    public get y(): number {
        return this._vacuum!.y;
    }

    public get defenseFlags(): number {
        return 0;
    }

    public get attackFlags(): number {
        return 0;
    }

    public get attackPriorityFlags(): Array<number> | null {
        return null;
    }

    public ApplyVacuum(health: number, lootRate: number): void {
        if (this._target._destroyed) {
            return;
        }
        this._vacuum = new Sprite();
        this._vacuumEndSource = new BitmapData(VacuumHose.END_WIDTH, VacuumHose.END_HEIGHT, true, 0);
        this._vacuumPipeSource = new BitmapData(VacuumHose.PIPE_WIDTH, VacuumHose.PIPE_HEIGHT, true, 0);
        const endBmp = new Bitmap(this._vacuumEndSource);
        this._vacuum.addChild(endBmp);
        MAP._EFFECTSTOP.addChild(this._vacuum);
        this._vacuumSound = SOUNDS.Play("othersounds/vacuumstart.mp3");
        if (this._vacuumSound) {
            this._vacuumSound.addEventListener(Event.SOUND_COMPLETE, this.onLoopStartSoundComplete.bind(this), false, 0, true);
        }
        this._vacuumLootTotals = [0, 0, 0, 0];
        const top = -GLOBAL._mapHeight;
        let yPos = 0;
        endBmp.x = -(VacuumHose.END_WIDTH / 2);
        endBmp.y = yPos -= VacuumHose.END_HEIGHT;
        while (yPos > top) {
            const pipeBmp = new Bitmap(this._vacuumPipeSource);
            pipeBmp.x = -(VacuumHose.PIPE_WIDTH / 2);
            pipeBmp.y = yPos -= VacuumHose.PIPE_HEIGHT;
            this._vacuum.addChild(pipeBmp);
        }
        this._totalPossibleLoot = Number.MAX_VALUE;
        if (this._target instanceof ResourceOutpost) {
            const totalRes = BASE._resources.r1.Get() + BASE._resources.r2.Get() + BASE._resources.r3.Get() + BASE._resources.r4.Get();
            this._totalPossibleLoot = totalRes * VacuumHose.MR3_MAX_LOOT_MULTIPLIER;
            console.log("Using the loot-o-tron on a Resource Outpost. This base has " + GLOBAL.FormatNumber(totalRes) + " resources so you will only be able to take " + GLOBAL.FormatNumber(this._totalPossibleLoot) + ". (" + VacuumHose.MR3_MAX_LOOT_MULTIPLIER + "%)");
        }
        this._amountLooted = 0;
        this._vacuumLootRate = new SecNum(lootRate);
        this._vacuumMaxHealth = health;
        this._vacuumHealth = new SecNum(health);
        this._vacuumStartTime = this._vacuumCurrTime = Date.now();
        this._vacuum.x = this._target.x;
        this._vacuum.y = this._target.y - 400;
        this._vacuum.alpha = 0;
        TweenLite.to(this._vacuum, 2, {
            "y": this._target.y + this._target._spoutPoint.y - 50,
            "alpha": 1,
            "ease": Expo.easeOut
        });
    }

    public onLoopStartSoundComplete(event: Event): void {
        this._vacuumSound = SOUNDS.Play("othersounds/vacuumloop.mp3", 0.8, 0, 100);
    }

    public RemoveVacuum(wasDestroyed: boolean = false): void {
        const savedVacuum = this._vacuum;
        const actuallyRemove = () => {
            if (savedVacuum!.parent) {
                savedVacuum!.parent.removeChild(savedVacuum!);
            }
            this._vacuumEndSource!.dispose();
            this._vacuumPipeSource!.dispose();
        };
        if (this._vacuum) {
            this._vacuum = null;
            if (this._vacuumHealth) {
                this._vacuumHealth.Set(0);
            }
            this._vacuumMaxHealth = 0;
            if (this._vacuumSound) {
                this._vacuumSound.stop();
                SOUNDS.Play(wasDestroyed ? "othersounds/vacuumbroken.mp3" : "othersounds/vacuumloopoff.mp3");
            }
            TweenLite.to(savedVacuum, 2, {
                "y": this._target.y - 400,
                "alpha": 0,
                "ease": Expo.easeOut,
                "onComplete": actuallyRemove
            });
        }
    }

    public tick(delta: number = 1): void {
        if (this._target._destroyed) {
            this.targetDestroyed();
            return;
        }
        if (this._vacuum) {
            if (!this.hasMaxedAmountToLoot()) {
                ++this._vacuumFrame;
                SPRITES.GetFrameById(this._vacuumEndSource!, "vacuum_end", this._vacuumFrame % VacuumHose.END_NUM_FRAMES, 0);
                SPRITES.GetFrameById(this._vacuumPipeSource!, "vacuum_pipe", this._vacuumFrame % VacuumHose.PIPE_NUM_FRAMES, 0);
            }
            if (this._vacuumHealth.Get() > 0) {
                const prevLoot = (this._vacuumCurrTime - this._vacuumStartTime) * this._vacuumLootRate!.Get() / 1000;
                this._vacuumCurrTime = Date.now();
                const currLoot = (this._vacuumCurrTime - this._vacuumStartTime) * this._vacuumLootRate!.Get() / 1000;
                this.VacuumLoot(currLoot - prevLoot);
            } else if (SiegeWeapons.activeWeapon) {
                SiegeWeapons.deactivateWeapon();
            }
        }
    }

    private targetDestroyed(): void {
        SiegeWeapons.deactivateWeapon();
        if (UI2._top) {
            UI2._top.validateSiegeWeapon();
        }
    }
}
