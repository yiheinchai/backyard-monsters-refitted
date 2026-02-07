import MovieClip from 'openfl/display/MovieClip';
import MouseEvent from 'openfl/events/MouseEvent';
import { UI_WORKERS } from './UI_WORKERS';
import { WORKERS } from './WORKERS';

// Lazy imports to break circular dependency chains
function getBFOUNDATION(): any { return require("./BFOUNDATION").BFOUNDATION; }
function getBASE(): any { return require("./BASE").BASE; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getLOGGER(): any { return require("./LOGGER").LOGGER; }
function getMAP(): any { return require("./MAP").MAP; }
function getSTORE(): any { return require("./STORE").STORE; }
function getTUTORIAL(): any { return require("./TUTORIAL").TUTORIAL; }


/**
 * QUEUE - Worker Task Queue Manager
 * Manages the queue of building tasks assigned to workers
 */
export class QUEUE {
    public static _mc: MovieClip | null = null;
    public static _items: Record<string, any> = {};
    public static _item: any = null;
    public static _stack: any[] = [];
    public static _workerCount: number = 0;
    public static _workingCount: number = 0;
    public static _placed: number = 0;

    constructor() {}

    public static Setup(): void {
        QUEUE._items = {};
        QUEUE._stack = [];
        QUEUE._workerCount = 0;
        QUEUE._workingCount = 0;
    }

    public static Spawn(count: number = 0): void {
        if (!getBASE().isMainYard) {
            if (QUEUE._workerCount > 0) {
                QUEUE._workerCount = WORKERS._workers.length;
                return;
            }
            if (count > 1) count = 1;
        }
        
        if (count === 0) {
            count = 1;
            if (getSTORE()._storeData?.BEW) {
                if (!getBASE().isMainYard) {
                    if (getSTORE()._storeData.BEW.q > 0) {
                        getLOGGER().Log("log", "QUEUE.Spawn Outpost " + getBASE()._loadedBaseID + "  has store data for " + getSTORE()._storeData.BEW.q + " extra worker(s)");
                    }
                } else {
                    count += getSTORE()._storeData.BEW.q;
                }
            }
        }
        
        QUEUE._workerCount += count;
        
        if (getGLOBAL().mode !== getGLOBAL().e_BASE_MODE.WMATTACK && getGLOBAL().mode !== getGLOBAL().e_BASE_MODE.WMVIEW) {
            for (let i = 0; i < count; i++) {
                const worker = WORKERS.Spawn();
                QUEUE._stack.push({
                    id: null,
                    workermc: worker.mc,
                    active: false,
                    expanded: false,
                    building: null,
                    title: "",
                    message: "",
                    say: ""
                });
            }
            UI_WORKERS.Update();
        }
    }

    public static CanDo(): { error: boolean; errormessage: string } {
        for (let i = 0; i < QUEUE._stack.length; i++) {
            if (!QUEUE._stack[i].active) {
                return { error: false, errormessage: "" };
            }
        }
        
        let errorName: string;
        if (!getSTORE().CheckUpgrade("BEW")) {
            if (getGLOBAL()._bStore) {
                errorName = getKEYS().Get("ui_worker_busy");
            } else {
                errorName = getKEYS().Get("ui_worker_waitforfinish");
                if (getTUTORIAL()._stage >= 200) {
                    errorName += " " + getKEYS().Get("ui_worker_impatient");
                } else {
                    errorName += " " + getKEYS().Get("ui_worker_tute");
                }
            }
        } else if (getSTORE().CheckUpgrade("BEW").q + 1 === 5) {
            errorName = getKEYS().Get("ui_worker_5busy");
        } else {
            errorName = getKEYS().Get("ui_worker_xbusy", {
                v1: getSTORE().CheckUpgrade("BEW").q + 1,
                v2: getSTORE().CheckUpgrade("BEW").q + 1
            });
        }
        return { error: true, errormessage: errorName };
    }

    public static GetBuilding(): BFOUNDATION | null {
        if (!getBASE().isMainYard) {
            if (QUEUE._stack[0]?.active) {
                return QUEUE._stack[0].building;
            }
            return null;
        }
        
        let building: BFOUNDATION | null = null;
        let minTime: number = 2000000000;
        for (let i = 0; i < QUEUE._stack.length; i++) {
            const b: BFOUNDATION = QUEUE._stack[i].building;
            if (b?._type !== 7) {
                const time = b._countdownUpgrade.Get() + b._countdownBuild.Get() + b._countdownFortify.Get();
                if (time < minTime) {
                    building = b;
                    minTime = time;
                }
            }
        }
        return building;
    }

    public static GetFinishCost(): number {
        const building = QUEUE.GetBuilding();
        if (building) {
            const time = building._countdownUpgrade.Get() + building._countdownBuild.Get() + building._countdownFortify.Get();
            return getSTORE().GetTimeCost(time);
        }
        return 0;
    }

    public static Add(id: string, building: BFOUNDATION | null = null): boolean {
        QUEUE._items[id] = { id: id, building: building };
        
        const test = QUEUE.CanDo();
        if (!test.error) {
            const worker = WORKERS.Assign(building);
            if (worker) {
                for (let i = 0; i < QUEUE._stack.length; i++) {
                    if (QUEUE._stack[i].workermc === worker.mc) {
                        QUEUE._stack[i].id = id;
                        QUEUE._stack[i].active = true;
                        QUEUE._stack[i].building = building;
                        QUEUE._stack[i].say = worker.say;
                        QUEUE._stack[i].timestamp = getGLOBAL().Timestamp();
                        break;
                    }
                }
                QUEUE._placed += 1;
            }
            QUEUE.Sort();
            QUEUE.Tick();
            return true;
        }
        return false;
    }

    public static Remove(id: string, complete: boolean, building: BFOUNDATION | null = null): MovieClip | null {
        delete QUEUE._items[id];
        for (let i = 0; i < QUEUE._stack.length; i++) {
            if (QUEUE._stack[i].id === id) {
                QUEUE._stack[i].active = false;
                QUEUE._stack[i].id = "";
                QUEUE._stack[i].message = "";
                QUEUE._stack[i].say = "";
                QUEUE._stack[i].timestamp = "";
                QUEUE.Sort();
                return WORKERS.Remove(QUEUE._stack[i].building, complete);
            }
        }
        return null;
    }

    public static Tick(): void {
        try {
            QUEUE._workingCount = 0;
            let upgradingCount = 0;
            
            for (let i = 0; i < QUEUE._stack.length; i++) {
                const s = QUEUE._stack[i];
                if (s.active) {
                    QUEUE._workingCount++;
                    if (s.building && s.building._countdownUpgrade.Get() > 0) {
                        upgradingCount++;
                    }
                    
                    let msg = "";
                    let title = "";
                    if (s.building._hasWorker) {
                        if (s.building._hasResources || s.building._repairing > 0) {
                            title = s.title;
                            msg = s.message;
                        } else {
                            title = getKEYS().Get("ui_worker_waiting");
                        }
                    } else {
                        s.title = getKEYS().Get("ui_worker_walking");
                        s.message = s.say;
                        title = getKEYS().Get("ui_worker_walking");
                        msg = s.say;
                    }
                    
                    if (!s.expanded) s.expanded = true;
                } else if (s.expanded) {
                    s.expanded = false;
                }
            }
        } catch (e: any) {
            getLOGGER().Log("err", "Queue.Tick: " + (e.message || "") + " | " + (e.stack || ""));
        }
        UI_WORKERS.Update();
    }

    public static Update(id: string, title: string, message: string): void {
        for (let i = 0; i < QUEUE._stack.length; i++) {
            if (QUEUE._stack[i].id === id) {
                QUEUE._stack[i].title = title;
                QUEUE._stack[i].message = message;
                break;
            }
        }
        QUEUE.Tick();
    }

    public static JumpToWorker(index: number): void {
        const workermc: MovieClip = QUEUE._stack[index].workermc;
        getMAP().FocusTo(workermc.x, workermc.y, 0.5);
    }

    public static Move(from: number, to: number): void {
        // Empty implementation
    }

    public static Speed(event: MouseEvent): void {
        getSTORE().SpeedUp("SP4");
    }

    public static Sort(): void {
        const sortArray: any[] = [];
        for (let i = 0; i < QUEUE._stack.length; i++) {
            const item = {
                stack: QUEUE._stack[i],
                active: Number(QUEUE._stack[i].active)
            };
            if (item.stack.building && item.stack.building._type === 7) {
                item.active = 0.5;
            }
            sortArray.push(item);
        }
        sortArray.sort((a, b) => b.active - a.active);
        for (let i = 0; i < QUEUE._stack.length; i++) {
            QUEUE._stack[i] = sortArray[i].stack;
        }
    }
}
