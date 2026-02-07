import { Rndm } from './com/gskinner/utils/Rndm';
import Rectangle from 'openfl/geom/Rectangle';
import { WORKERS } from './WORKERS';

// Lazy imports to break circular dependency chains
function getBASE(): any { return require("./BASE").BASE; }
function getBFOUNDATION(): any { return require("./BFOUNDATION").BFOUNDATION; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getGRID(): any { return require("./GRID").GRID; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getLOGGER(): any { return require("./LOGGER").LOGGER; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }
function getQUEUE(): any { return require("./QUEUE").QUEUE; }
function getQUESTS(): any { return require("./QUESTS").QUESTS; }


/**
 * MUSHROOMS - Mushroom Spawn and Collection System
 * Handles spawning and picking mushrooms on the map
 */
export class MUSHROOMS {
    public static _mushroom: BFOUNDATION | null = null;
    public static _mushroomID: number = 0;

    constructor() {}

    public static Setup(): void {
        let mushroomCount: number = 0;
        if (!getGLOBAL()._flags.mushrooms && getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD) {
            return;
        }
        if (!getBASE().isMainYard) {
            return;
        }
        try {
            if (getBASE()._lastSpawnedMushroom === 0) {
                getBASE()._mushroomList = [];
                const twist: number = Math.floor(Math.random() * 360);
                for (let i = 1; i < 6; i++) {
                    const dist: number = i * 100 + 300;
                    const angle: number = i * 60 + twist;
                    const spawn: number = 4;
                    const X: number = Math.sin(angle * 0.0174532925) * dist;
                    const Y: number = Math.cos(angle * 0.0174532925) * dist;
                    const a: number = 100 + Math.random() * 80;
                    const b: number = 100 + Math.random() * 80;
                    for (let s = 0; s < spawn; s++) {
                        const n: number = Math.floor(Math.random() * 5) + 1;
                        let X2: number = X + Math.sin(Math.floor(Math.random() * 360) * 0.0174532925) * a;
                        let Y2: number = Y + Math.cos(Math.floor(Math.random() * 360) * 0.0174532925) * b;
                        X2 = Math.floor(X2 / 10) * 10;
                        Y2 = Math.floor(Y2 / 10) * 10;
                        MUSHROOMS._mushroom = getBASE().addBuildingC(7);
                        MUSHROOMS._mushroom.Setup({
                            X: X2,
                            Y: Y2,
                            id: mushroomCount,
                            t: 7,
                            frame: n
                        });
                        mushroomCount++;
                    }
                }
                getBASE()._lastSpawnedMushroom = getGLOBAL().Timestamp();
            } else {
                for (let i = 0; i < Math.min(getBASE()._mushroomList.length, 20); i++) {
                    const shroom: any = {
                        frame: getBASE()._mushroomList[i][0],
                        X: getBASE()._mushroomList[i][1],
                        Y: getBASE()._mushroomList[i][2],
                        id: mushroomCount,
                        t: 7
                    };
                    let replace: boolean = false;
                    if (shroom.X > getGLOBAL()._mapWidth * 0.5 || shroom.X < -getGLOBAL()._mapWidth * 0.5 ||
                        shroom.Y > getGLOBAL()._mapHeight * 0.5 || shroom.Y < -getGLOBAL()._mapHeight * 0.5) {
                        replace = true;
                    }
                    if (!replace) {
                        MUSHROOMS._mushroom = getBASE().addBuildingC(7);
                        MUSHROOMS._mushroom.Setup(shroom);
                    } else {
                        MUSHROOMS.Spawn(1);
                    }
                    mushroomCount++;
                }
                if (getBASE()._mushroomList.length > 20) {
                    for (let i = getBASE()._mushroomList.length - 1; i > 19; i--) {
                        delete getBASE()._mushroomList[i];
                    }
                }
            }
        } catch (e: any) {
            getLOGGER().Log("err", "MUSHROOMS.SetupA: " + e.message + " | " + e.stack);
            getGLOBAL().ErrorMessage("");
        }
        try {
            const spawnCount: number = Math.min(10, Math.floor((getGLOBAL().Timestamp() - getBASE()._lastSpawnedMushroom) / 17280));
            if (spawnCount > 0) {
                getBASE()._lastSpawnedMushroom = getGLOBAL().Timestamp();
                const actualSpawnCount: number = Math.min(spawnCount, 10 - mushroomCount);
                if (actualSpawnCount > 0) {
                    MUSHROOMS.Spawn(actualSpawnCount);
                }
            }
        } catch (e: any) {
            getLOGGER().Log("err", "MUSHROOMS.SetupB: " + e.message + " | " + e.stack);
            getGLOBAL().ErrorMessage("");
        }
    }

    public static Spawn(count: number): void {
        if (!getGLOBAL()._flags.mushrooms && getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD) {
            return;
        }
        if (!getBASE().isMainYard) {
            return;
        }
        getBASE()._lastSpawnedMushroom = getGLOBAL().Timestamp();
        getLOGGER().Stat([35, count]);
        for (let i = 0; i < count; i++) {
            const frame: number = Math.floor(Math.random() * 5) + 1;
            let found: boolean = false;
            let X: number = 0;
            let Y: number = 0;
            let attempts: number = 0;
            while (!found && attempts < 5000) {
                attempts++;
                X = 200 + getGLOBAL()._mapWidth * 0.5 - Math.random() * (getGLOBAL()._mapWidth + 400);
                Y = 200 + getGLOBAL()._mapHeight * 0.5 - Math.random() * (getGLOBAL()._mapHeight + 400);
                if (X > getGLOBAL()._mapWidth * 0.5 || X < -getGLOBAL()._mapWidth * 0.5 ||
                    Y > getGLOBAL()._mapHeight * 0.5 || Y < -getGLOBAL()._mapHeight * 0.5) {
                    found = true;
                }
                if (!found && !getGRID().FootprintBlocked([new Rectangle(0, 0, 30, 30)], getGRID().ToISO(X, Y, 0), true)) {
                    found = true;
                }
            }
            if (found) {
                MUSHROOMS._mushroom = getBASE().addBuildingC(7);
                ++getBASE()._buildingCount;
                MUSHROOMS._mushroom.Setup({
                    X: X,
                    Y: Y,
                    id: getBASE()._buildingCount,
                    t: 7,
                    frame: frame
                });
            }
        }
    }

    public static PickWorker(building: BFOUNDATION): void {
        if (!building._picking) {
            if (getQUEUE().Add("mushroom" + building._id, building)) {
                building._mc!.alpha = 0.5;
                building._picking = true;
            } else {
                getPOPUPS().DisplayWorker(2, building);
            }
        }
    }

    public static Pick(building: BFOUNDATION): boolean {
        const mushroomId: number = building._id;
        let message: string = "";
        if (getBASE()._pendingPurchase.length > 0) {
            return false;
        }
        const rndm: Rndm = new Rndm(Math.floor(building.x * building.y));
        let shinyAmount: number = 0;
        ++getQUESTS()._global.mushroomspicked;
        if (Math.floor(rndm.random() * 4) === 0) {
            ++getQUESTS()._global.goldmushroomspicked;
            getGLOBAL().ValidateMushroomPick(building);
            const type: number = Math.floor(Math.random() * 3 + 1);
            const actualType: number = type === 3 ? 1 : type;
            getBASE().Purchase("MUSHROOM" + actualType, 1, "MUSHROOMS");
            shinyAmount = actualType === 1 ? 3 : 8;
            message = getKEYS().Get("pop_mushroom_msg1", { v1: shinyAmount });
            const popup: any = new (GLOBAL as any).popup_mushroomshiny();
            popup.tTitle.htmlText = "<b>" + getKEYS().Get("pop_goldenmushroom_title") + "</b>";
            popup.tMessage.htmlText = getKEYS().Get("pop_goldenmushroom_desc", { v1: shinyAmount });
            getPOPUPS().Push(popup, null, null, "chaching", "goldmushroom.png");
        } else {
            const msgType: number = Math.floor(Math.random() * 3);
            if (msgType === 0) {
                message = getKEYS().Get("pop_mushroom_msg2");
            } else if (msgType === 1) {
                message = getKEYS().Get("pop_mushroom_msg3");
            } else {
                message = getKEYS().Get("pop_mushroom_msg4");
            }
            getBASE().Save();
        }
        getLOGGER().Stat([34, shinyAmount]);
        getQUESTS().Check();
        WORKERS.Say(message, getQUEUE().Remove("mushroom" + mushroomId, true), 3000);
        building.RecycleC();
        return true;
    }
}
