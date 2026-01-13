import TimerEvent from "openfl/events/TimerEvent";
import Timer from "openfl/utils/Timer";

import { SecNum } from "../../../cc/utils/SecNum";
import { SiegeWeaponProperty } from "../SiegeWeaponProperty";
import { SiegeWeapons } from "../SiegeWeapons";
import { SiegeWeapon } from "./SiegeWeapon";
import { IDurable } from "./IDurable";

import { BASE } from "../../../../BASE";
import { BFOUNDATION } from "../../../../BFOUNDATION";
import { BTOWER } from "../../../../BTOWER";
import { DROPZONE } from "../../../../DROPZONE";
import { KEYS } from "../../../../KEYS";
import { SPRITES } from "../../../../SPRITES";

/**
 * Jars - siege weapon that places protective jars on towers.
 */
export class Jars extends SiegeWeapon implements IDurable {
    public static readonly ID: string = "jars";
    public static readonly CRACKING_SOUNDS: Array<string> = [
        "othersounds/glass_cracking_1.mp3",
        "othersounds/glass_cracking_2.mp3",
        "othersounds/glass_cracking_3.mp3",
        "othersounds/glass_cracking_4.mp3"
    ];
    public static readonly EXPLODE_SOUNDS: Array<string> = [
        "othersounds/glass_explode_1.mp3",
        "othersounds/glass_explode_2.mp3"
    ];
    public static readonly LAND_SOUNDS: Array<string> = [
        "othersounds/jar_land_2.mp3"
    ];
    public static readonly JAR_GRAPHIC: string = "jarAnimation";
    public static readonly JAR_GRAPHIC_URL: string = "siegeimages/jar_anim.v2.png";
    public static readonly JAR_GRAPHIC_WIDTH: number = 163;
    public static readonly JAR_GRAPHIC_HEIGHT: number = 150;
    public static readonly JAR_GRAPHIC_FRAMES: number = 23;

    private _targets: Array<BTOWER> = [];
    private _activeTimer: Timer | null = null;

    constructor() {
        super();
        this.weaponID = Jars.ID;
        this.dropTarget = DROPZONE.SIEGEWEAPON_BUILDINGS;
        this.addProperty(SiegeWeapon.RANGE, new SiegeWeaponProperty([200, 210, 235, 335, 360, 370, 380, 390, 400, 410], 1));
        this.addProperty(SiegeWeapon.DURABILITY, new SiegeWeaponProperty([2000, 3000, 4500, 7000, 11000, 13500, 16500, 20500, 25500, 31500], 2));
        this.addProperty(SiegeWeapon.DURATION, new SiegeWeaponProperty([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
        this.addProperty(SiegeWeapon.UPGRADE_COSTS, new SiegeWeaponProperty([
            { "r1": 54788.2570728397, "r2": 73051.0094304529, "r3": 54788.2570728397, "r4": 0, "time": 8100 },
            { "r1": 94981.5611740237, "r2": 126642.081565365, "r3": 94981.5611740237, "r4": 0, "time": 13500 },
            { "r1": 164651.086038632, "r2": 219534.781384843, "r3": 164651.086038632, "r4": 0, "time": 19800 },
            { "r1": 285371.258002827, "r2": 380495.010670437, "r3": 285371.258002827, "r4": 0, "time": 30600 },
            { "r1": 494329.891507663, "r2": 659106.522010217, "r3": 494329.891507663, "r4": 0, "time": 51300 },
            { "r1": 854888.169815886, "r2": 1139850.89308785, "r3": 854888.169815886, "r4": 0, "time": 86400 },
            { "r1": 1471266.3489287, "r2": 1961688.46523827, "r3": 1471266.3489287, "r4": 0, "time": 216000 },
            { "r1": 2497108.33129819, "r2": 3329477.77506425, "r3": 2497108.33129819, "r4": 0, "time": 302400 },
            { "r1": 4086751.48181388, "r2": 5449001.97575184, "r3": 4086751.48181388, "r4": 0, "time": 345600 },
            { "r1": 6188066.53345743, "r2": 8250755.37794324, "r3": 6188066.53345743, "r4": 0, "time": 388800 }
        ]));
        this.addProperty(SiegeWeapon.BUILD_COSTS, new SiegeWeaponProperty([
            { "r4": 0, "r1": 42971, "r2": 42971, "r3": 21486, "time": 3600 },
            { "r4": 0, "r1": 74495, "r2": 74495, "r3": 37248, "time": 5400 },
            { "r4": 0, "r1": 129138, "r2": 129138, "r3": 64569, "time": 8100 },
            { "r4": 0, "r1": 223821, "r2": 223821, "r3": 111910, "time": 12600 },
            { "r4": 0, "r1": 387710, "r2": 387710, "r3": 193855, "time": 18000 },
            { "r4": 0, "r1": 670501, "r2": 670501, "r3": 335250, "time": 27000 },
            { "r4": 0, "r1": 1153934, "r2": 1153934, "r3": 576967, "time": 41400 },
            { "r4": 0, "r1": 1958516, "r2": 1958516, "r3": 979258, "time": 61200 },
            { "r4": 0, "r1": 3205295, "r2": 3205295, "r3": 1602648, "time": 86400 },
            { "r4": 0, "r1": 4853386, "r2": 4853386, "r3": 2426693, "time": 172800 }
        ]));
        SPRITES.SetupSprite(Jars.JAR_GRAPHIC);
    }

    public override get logMessage(): string {
        return KEYS.Get("attack_log_siegeplural", {
            "v1": this.level,
            "v2": this.name
        });
    }

    public get durability(): number {
        return this.getProperty(SiegeWeapon.DURABILITY).getValueForLevel(this.level);
    }

    public get activeDurability(): number {
        let total: number = 0;
        const targetCount = this._targets.length;
        for (let i = 0; i < targetCount; i++) {
            const jarHealth: SecNum | null = this._targets[i]._jarHealth;
            if (jarHealth) {
                total += jarHealth.Get();
            }
        }
        return total / (targetCount * this.durability) * this.durability;
    }

    public override onActivation(x: number, y: number): void {
        SPRITES.SetupSprite(Jars.JAR_GRAPHIC);
        this._targets = this.getValidTargets(x, y);
        for (let i = 0; i < this._targets.length; i++) {
            this._targets[i].ApplyJar(this.durability);
        }
        this._activeTimer = new Timer(1000, this.duration);
        this._activeTimer.addEventListener(TimerEvent.TIMER, this.update.bind(this));
        this._activeTimer.start();
    }

    private update(event: TimerEvent): void {
        if (Boolean(SiegeWeapons.activeWeapon) && this.activeDurability <= 0) {
            SiegeWeapons.deactivateWeapon();
        }
    }

    public override onDeactivation(): void {
        for (let i = 0; i < this._targets.length; i++) {
            this._targets[i].KillJar();
        }
        this._activeTimer!.removeEventListener(TimerEvent.TIMER, this.update.bind(this));
        this._activeTimer!.stop();
    }

    private getValidTargets(x: number, y: number): Array<BTOWER> {
        const buildings: Array<BFOUNDATION> = [];
        BASE.GetBuildingOverlap(x, y, this.range, buildings);
        const towers: Array<BTOWER> = [];
        for (const building of buildings) {
            if (building instanceof BTOWER) {
                towers.push(building);
            }
        }
        return towers;
    }
}
