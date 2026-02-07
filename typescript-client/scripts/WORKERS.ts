import MovieClip from 'openfl/display/MovieClip';
import Point from 'openfl/geom/Point';
import { WORKER } from './WORKER';
import { TweenLite } from './gs/TweenLite';

// Lazy imports to break circular dependency chains
function getBASE(): any { return require("./BASE").BASE; }
function getBFOUNDATION(): any { return require("./BFOUNDATION").BFOUNDATION; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getMAP(): any { return require("./MAP").MAP; }
function getQUESTS(): any { return require("./QUESTS").QUESTS; }
function getTUTORIAL(): any { return require("./TUTORIAL").TUTORIAL; }


/**
 * WORKERS - Worker Management System
 * Handles worker spawning, assignment, and task management
 */
export class WORKERS {
    public static _workers: any[] = [];
    public static _sayings: Record<string, string[]> = {};

    constructor() {}

    public static Setup(): void {
        WORKERS._workers = [];
        if (getBASE().isInfernoMainYardOrOutpost) {
            WORKERS._sayings = {
                assign: [getKEYS().Get("ai_worker_comment1"), getKEYS().Get("ai_worker_comment2"), getKEYS().Get("ai_worker_comment3"), getKEYS().Get("ai_worker_comment5"), getKEYS().Get("ai_worker_comment6"), getKEYS().Get("ai_worker_comment7")],
                remove: [getKEYS().Get("ai_worker_cancel1"), getKEYS().Get("ai_worker_cancel2"), getKEYS().Get("ai_worker_cancel3"), getKEYS().Get("ai_worker_cancel4")],
                doneConstruct: [getKEYS().Get("ai_worker_doneconstruct1"), getKEYS().Get("ai_worker_doneconstruct2"), getKEYS().Get("ai_worker_doneconstruct3"), getKEYS().Get("ai_worker_doneconstruct4")],
                doneRepair: [getKEYS().Get("ai_worker_donerepair1"), getKEYS().Get("ai_worker_donerepair2"), getKEYS().Get("ai_worker_donerepair3"), getKEYS().Get("ai_worker_donerepair4")],
                doneUpgrade: [getKEYS().Get("ai_worker_doneupgrade1"), getKEYS().Get("ai_worker_doneupgrade2"), getKEYS().Get("ai_worker_doneupgrade3"), getKEYS().Get("ai_worker_doneupgrade4")]
            };
        } else {
            WORKERS._sayings = {
                assign: [getKEYS().Get("ui_worker_assign1"), getKEYS().Get("ui_worker_assign2"), getKEYS().Get("ui_worker_assign3"), getKEYS().Get("ui_worker_assign4"), getKEYS().Get("ui_worker_assign5"), getKEYS().Get("ui_worker_assign6")],
                remove: [getKEYS().Get("ui_worker_remove1"), getKEYS().Get("ui_worker_remove2"), getKEYS().Get("ui_worker_remove3"), getKEYS().Get("ui_worker_remove4")],
                doneConstruct: [getKEYS().Get("ui_worker_doneconstruct1"), getKEYS().Get("ui_worker_doneconstruct2"), getKEYS().Get("ui_worker_doneconstruct3"), getKEYS().Get("ui_worker_doneconstruct4"), getKEYS().Get("ui_worker_doneconstruct5"), getKEYS().Get("ui_worker_doneconstruct6"), getKEYS().Get("ui_worker_doneconstruct7"), getKEYS().Get("ui_worker_doneconstruct8")],
                doneRepair: [getKEYS().Get("ui_worker_donerepair1"), getKEYS().Get("ui_worker_donerepair2")],
                doneUpgrade: [getKEYS().Get("ui_worker_doneupgrade1"), getKEYS().Get("ui_worker_doneupgrade2"), getKEYS().Get("ui_worker_doneupgrade3"), getKEYS().Get("ui_worker_doneupgrade4"), getKEYS().Get("ui_worker_doneupgrade5")]
            };
        }
    }

    public static Spawn(): Record<string, any> {
        let spawnPoint: Point;
        if (getTUTORIAL()._stage < 10) {
            spawnPoint = new Point(0, 0);
        } else {
            spawnPoint = new Point(getGLOBAL()._mapWidth / 2 - Math.random() * getGLOBAL()._mapWidth, getGLOBAL()._mapHeight / 2 - Math.random() * getGLOBAL()._mapHeight);
        }
        const worker: WORKER = getMAP()._BUILDINGTOPS.addChild(new WORKER(getMAP()._BUILDINGTOPS, spawnPoint, Math.random() * 360)) as WORKER;
        WORKERS._workers.push({
            mc: worker,
            task: null
        });
        getQUESTS()._global.worder_count = WORKERS._workers.length;
        return { mc: worker };
    }

    public static Tick(): void {
        if (getGLOBAL()._render) {
            for (const key in WORKERS._workers) {
                const workerData = WORKERS._workers[key];
                workerData.mc.Tick();
            }
        }
    }

    public static Assign(building: BFOUNDATION): Record<string, any> | null {
        let minDist: number = 3000;
        let closestWorker: any = null;
        for (const key in WORKERS._workers) {
            const workerData = WORKERS._workers[key];
            if (!workerData.task) {
                const dist: number = Point.distance(new Point(workerData.mc.x, workerData.mc.y), new Point(building._mc!.x, building._mc!.y));
                if (dist < minDist) {
                    minDist = dist;
                    closestWorker = workerData;
                }
            }
        }
        if (closestWorker) {
            closestWorker.task = building;
            closestWorker.mc.Target(new Point(building._mc!.x, building._mc!.y + building._mcFootprint!.height / 2), building);
            closestWorker.mc._targetTask = building;
            let saying: string = "";
            if (!getGLOBAL()._catchup) {
                saying = WORKERS._sayings.assign[Math.floor(Math.random() * WORKERS._sayings.assign.length)];
                WORKERS.Say(saying, closestWorker.mc);
            } else {
                closestWorker.mc.x = building._mc!.x;
                closestWorker.mc.y = building._mc!.y;
                closestWorker.mc._targetPosition = new Point(building._mc!.x, building._mc!.y + building._mcFootprint!.height / 2 - 5);
                closestWorker.mc._waypoints = [new Point(building._mc!.x, building._mc!.y + building._mcFootprint!.height / 2 - 5)];
                building._hasWorker = true;
            }
            return { mc: closestWorker.mc, say: saying };
        }
        return null;
    }

    public static Remove(building: BFOUNDATION, success: boolean = true, taskType: string = "Construct"): MovieClip | null {
        for (const key in WORKERS._workers) {
            const workerData = WORKERS._workers[key];
            if (workerData.task === building) {
                workerData.task = null;
                workerData.mc._targetTask = null;
                building._hasWorker = false;
                if (getGLOBAL()._render) {
                    workerData.mc.Wander();
                    if (success) {
                        const sayings: string[] = WORKERS._sayings["done" + taskType];
                        WORKERS.Say(sayings[Math.floor(Math.random() * sayings.length)], workerData.mc);
                    } else {
                        WORKERS.Say(WORKERS._sayings.remove[Math.floor(Math.random() * WORKERS._sayings.remove.length)], workerData.mc);
                    }
                } else {
                    const newPos: Point = new Point(building._mc!.x + 20, building._mc!.y + 80);
                    workerData.mc._targetPosition = newPos;
                    workerData.mc._waypoints = [];
                    workerData.mc.x = newPos.x;
                    workerData.mc.y = newPos.y;
                }
                return workerData.mc;
            }
        }
        return null;
    }

    public static Say(message: string, workerMC: MovieClip | null = null, duration: number = 2000): void {
        if (!workerMC) {
            workerMC = WORKERS._workers[0].mc;
            (workerMC as any).Target(new Point((workerMC as any).x + 20, (workerMC as any).y + 150));
            (workerMC as any).Move();
            (workerMC as any).Update();
        }
        (workerMC as any).Say(message, duration);
    }
}
