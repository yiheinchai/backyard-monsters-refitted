import MouseEvent from 'openfl/events/MouseEvent';
import Point from 'openfl/geom/Point';
import { CUSTOMATTACKS } from './CUSTOMATTACKS';
import { MONSTERBAITERPOPUP } from './MONSTERBAITERPOPUP';

// Lazy imports to break circular dependency chains
function getBASE(): any { return require("./BASE").BASE; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getMAP(): any { return require("./MAP").MAP; }
function getSOUNDS(): any { return require("./SOUNDS").SOUNDS; }
function getUI2(): any { return require("./UI2").UI2; }
function getWMATTACK(): any { return require("./WMATTACK").WMATTACK; }


/**
 * MONSTERBAITER - Monster Baiter Controller
 * Attracts wild monsters to attack the base and manages the attack wave
 */
export class MONSTERBAITER {
    public static readonly TYPE: number = 19;
    public static _mc: MONSTERBAITERPOPUP | null = null;
    public static _attacking: number = 0;
    public static _scaredAway: boolean = false;
    public static _musk: number = 0;
    public static _muskLimit: number = 300;
    public static _replenishRate: number = 0;
    public static _currentAttackers: any[] = [];
    public static _attPrep: number = 0;
    public static _attackPt: Point = new Point();
    public static _queue: Record<string, number> = {};
    public static _attackDir: number = 0;
    public static _frameNumber: number = 0;

    constructor() {}

    public static Tick(): void {
        if (getGLOBAL()._bBaiter) {
            MONSTERBAITER._musk = MONSTERBAITER._muskLimit;
            if (MONSTERBAITER._mc) {
                MONSTERBAITER._mc.Update();
            }
            if (MONSTERBAITER._attPrep > 0) {
                if (MONSTERBAITER._attPrep === 1) {
                    getUI2()._warning.Update("<font size=\"28\">" + getKEYS().Get("msg_dontpanic") + "</font>");
                    MONSTERBAITER._attPrep = 0;
                    const attackers: any[] = [];
                    for (const creatureId in MONSTERBAITER._queue) {
                        if (MONSTERBAITER._queue[creatureId] > 0) {
                            attackers.push([creatureId, "bounce", MONSTERBAITER._queue[creatureId], MONSTERBAITER._attackPt.x, MONSTERBAITER._attackPt.y, 0, 0]);
                        }
                    }
                    getWMATTACK()._type = getWMATTACK().TYPE_DAMAGE;
                    MONSTERBAITER._currentAttackers = CUSTOMATTACKS.CustomAttack(attackers);
                    for (const group of MONSTERBAITER._currentAttackers) {
                        for (const monster of group) {
                            monster._hitLimit = Number.MAX_VALUE;
                        }
                    }
                } else {
                    getUI2()._warning.Update("<font size=\"28\">" + (MONSTERBAITER._attPrep - 1) + "</font>");
                    getSOUNDS().PlayMusic(getBASE().isInfernoMainYardOrOutpost ? "musicipanic" : "musicpanic");
                    MONSTERBAITER._attPrep--;
                }
            }
            MONSTERBAITER._frameNumber++;
        }
    }

    public static PrepAttack(): void {
        MONSTERBAITER._scaredAway = true;
        MONSTERBAITER._attPrep = 4;
        MONSTERBAITER._attacking = 1;
        getMAP().FocusTo(getGLOBAL()._bBaiter.x, getGLOBAL()._bBaiter.y, 2);
        getUI2().Show("warning");
        getBASE().Save();
        getUI2().Hide("top");
        getUI2().Hide("bottom");
    }

    public static End(silent: boolean = false): void {
        MONSTERBAITER._scaredAway = true;
        if (!silent) getSOUNDS().Play("wmbhorn");
        getUI2().Hide("scareAway");
        getUI2().Hide("warning");
        getSOUNDS().PlayMusic(getBASE().isInfernoMainYardOrOutpost ? "musicibuild" : "musicbuild");
        
        for (const group of MONSTERBAITER._currentAttackers) {
            for (let i = 0; i < group.length; i++) {
                group[i].changeModeRetreat();
            }
        }
        MONSTERBAITER._attacking = 0;
        MONSTERBAITER._currentAttackers = [];
    }

    public static Setup(data: any = null): void {
        if (data) {
            if (data.queue) {
                if (data.queue.C100 !== undefined) {
                    data.queue.C12 = data.queue.C100;
                    delete data.queue.C100;
                }
                MONSTERBAITER._queue = data.queue;
            }
            if (data.attackDir !== undefined) {
                MONSTERBAITER._attackDir = data.attackDir;
            }
            if (data.musk !== undefined) {
                MONSTERBAITER._musk = data.musk;
            }
        }
    }

    public static Update(): void {
        try {
            if (getGLOBAL()._bBaiter !== null) {
                const props = getGLOBAL()._buildingProps[18];
                MONSTERBAITER._muskLimit = props.capacity[getGLOBAL()._bBaiter._lvl.Get() - 1];
                MONSTERBAITER._replenishRate = props.produce[getGLOBAL()._bBaiter._lvl.Get() - 1];
            }
        } catch (e) {
            // Ignore errors
        }
    }

    public static Fill(): void {
        MONSTERBAITER._musk = MONSTERBAITER._muskLimit;
    }

    public static Export(): any {
        return {
            queue: MONSTERBAITER._queue,
            attackDir: MONSTERBAITER._attackDir,
            musk: MONSTERBAITER._musk
        };
    }

    public static Show(): void {
        if (!MONSTERBAITER._mc) {
            getSOUNDS().Play("click1");
            getGLOBAL().BlockerAdd();
            MONSTERBAITER._mc = getGLOBAL()._layerWindows.addChild(new MONSTERBAITERPOPUP()) as MONSTERBAITERPOPUP;
            MONSTERBAITER._mc.Setup(MONSTERBAITER._queue, MONSTERBAITER._attackDir);
            MONSTERBAITER._mc.Center();
            MONSTERBAITER._mc.ScaleUp();
        }
    }

    public static Hide(event: MouseEvent | null = null): void {
        getSOUNDS().Play("close");
        getGLOBAL().BlockerRemove();
        if (MONSTERBAITER._mc) {
            getGLOBAL()._layerWindows.removeChild(MONSTERBAITER._mc);
            MONSTERBAITER._mc = null;
        }
    }
}
