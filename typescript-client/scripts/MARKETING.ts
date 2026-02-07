import MovieClip from 'openfl/display/MovieClip';
import MouseEvent from 'openfl/events/MouseEvent';
import Point from 'openfl/geom/Point';

// Lazy imports to break circular dependency chains
function getInstanceManager(): any { return require("./com/monsters/managers/InstanceManager").InstanceManager; }
function getBFOUNDATION(): any { return require("./BFOUNDATION").BFOUNDATION; }
function getBUILDING6(): any { return require("./BUILDING6").BUILDING6; }
function getBUILDING13(): any { return require("./BUILDING13").BUILDING13; }
function getBUILDING23(): any { return require("./BUILDING23").BUILDING23; }
function getBUILDING25(): any { return require("./BUILDING25").BUILDING25; }
function getBASE(): any { return require("./BASE").BASE; }
function getBUILDINGOPTIONS(): any { return require("./BUILDINGOPTIONS").BUILDINGOPTIONS; }
function getBUILDINGS(): any { return require("./BUILDINGS").BUILDINGS; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getLOGGER(): any { return require("./LOGGER").LOGGER; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }
function getSTORE(): any { return require("./STORE").STORE; }
function getTUTORIAL(): any { return require("./TUTORIAL").TUTORIAL; }


export class MARKETING {
    constructor() {
    }

    public static Show(key: string): boolean {
        let found = false;
        let pTitle: string = null;
        let pBody: string = null;
        let pImage: string = null;
        let pImagePosition: Point = null;
        let pButton: string = null;
        let pAction: Function = null;
        let tmpBuilding: BFOUNDATION = null;
        let tmpCountA = 0;
        let tmpCountB = 0;
        let tgtb: BFOUNDATION = null;

        if (getGLOBAL().mode != getGLOBAL().e_BASE_MODE.BUILD) {
            return false;
        }
        if (getBASE()._showingWhatsNew) {
            return false;
        }
        if (getBASE().isInfernoMainYardOrOutpost) {
            return false;
        }
        try {
            switch (key) {
                case "upgradeapult":
                    if (getGLOBAL()._bCatapult && getGLOBAL()._bCatapult._lvl.Get() == 1 && getGLOBAL().townHall._lvl.Get() >= 5 && getGLOBAL().Timestamp() - getGLOBAL().StatGet("CM2") > 60 * 60 * 24 * 5) {
                        getGLOBAL().StatSet("CM2", getGLOBAL().Timestamp());
                        pTitle = getKEYS().Get("mkting_upgradeapult_title");
                        pBody = getKEYS().Get("mkting_upgradeapult_body");
                        pImage = "building-catapult.png";
                        pImagePosition = new Point(-270, -65);
                        pButton = getKEYS().Get("mkting_upgradeapult_btn");
                        pAction = (param1: MouseEvent): void => {
                            getBUILDINGOPTIONS().Show(getGLOBAL()._bCatapult, "upgrade");
                            getPOPUPS().Next();
                        };
                        found = true;
                    }
                    break;
                case "fillapult":
                    if (getGLOBAL()._bCatapult && getBASE()._resources.r1.Get() < getBASE()._resources.r1max * 0.5 && getGLOBAL().Timestamp() - getGLOBAL().StatGet("CM4") > 60 * 60 * 24 * 5) {
                        getGLOBAL().StatSet("CM4", getGLOBAL().Timestamp());
                        pTitle = getKEYS().Get("mkting_fillapult_title");
                        pBody = getKEYS().Get("mkting_fillapult_body");
                        pImage = "building-catapult.png";
                        pImagePosition = new Point(-270, -65);
                        pButton = getKEYS().Get("mkting_fillapult_btn");
                        pAction = (param1: MouseEvent): void => {
                            if (!getBASE().isInfernoMainYardOrOutpost) {
                                getSTORE().ShowB(2, 0, ["BR11", "BR12", "BR13", "BR21", "BR22", "BR23", "BR31", "BR32", "BR33", "BR41", "BR42", "BR43"]);
                            } else {
                                getSTORE().ShowB(2, 0, ["BR11I", "BR12I", "BR13I", "BR21I", "BR22I", "BR23I", "BR31I", "BR32I", "BR33I", "BR41I", "BR42I", "BR43I"]);
                            }
                            getPOPUPS().Next();
                        };
                        found = true;
                    }
                    break;
                case "train":
                    break;
                case "overdrive":
                    tmpCountA = 0;
                    tmpCountB = 0;
                    const buildingInstances = getInstanceManager().getInstancesByClass(getBFOUNDATION());
                    for (const building of buildingInstances) {
                        tmpBuilding = building as BFOUNDATION;
                        if (tmpBuilding._type == 13) {
                            tmpCountA += 1;
                            if ((tmpBuilding as BUILDING13)._producing) {
                                tmpCountB += 1;
                            }
                        }
                    }
                    if (tmpCountA > 1 && tmpCountA == tmpCountB && getGLOBAL().Timestamp() - getGLOBAL().StatGet("CM6") > 60 * 60 * 24 * 2) {
                        getGLOBAL().StatSet("CM6", getGLOBAL().Timestamp());
                        pTitle = getKEYS().Get("mkting_overdrive_title");
                        pBody = getKEYS().Get("mkting_overdrive_body");
                        pImage = "building-hatchery.png";
                        pImagePosition = new Point(-270, -65);
                        pButton = getKEYS().Get("mkting_overdrive_btn");
                        pAction = (param1: MouseEvent): void => {
                            if (!getBASE().isInfernoMainYardOrOutpost) {
                                getSTORE().ShowB(3, 1, ["HOD", "HOD2", "HOD3"]);
                            } else {
                                getSTORE().ShowB(3, 1, ["HODI", "HOD2I", "HOD3I"]);
                            }
                            getPOPUPS().Next();
                        };
                        found = true;
                    }
                    break;
                case "planner":
                    break;
                case "hcc":
                    const hatCount = getInstanceManager().getInstancesByClass(getBUILDING13()).length;
                    if (!getGLOBAL()._bHatcheryCC && hatCount == 3 && getGLOBAL().Timestamp() - getGLOBAL().StatGet("CM8") > 60 * 60 * 24 * 5) {
                        getGLOBAL().StatSet("CM8", getGLOBAL().Timestamp());
                        pTitle = getKEYS().Get("mkting_hcc_title");
                        pBody = getKEYS().Get("mkting_hcc_body");
                        pImage = "building-hcc.png";
                        pImagePosition = new Point(-270, -65);
                        pButton = getKEYS().Get("mkting_hcc_btn");
                        pAction = (param1: MouseEvent): void => {
                            getBUILDINGS()._menuA = 2;
                            getBUILDINGS()._menuB = 1;
                            getBUILDINGS()._page = 0;
                            getBUILDINGS()._buildingID = 16;
                            getBUILDINGS().Show();
                            getPOPUPS().Next();
                        };
                        found = true;
                    }
                    break;
                case "storagemore":
                    const siloCount = getInstanceManager().getInstancesByClass(getBUILDING6()).length;
                    let quantityIndex = getGLOBAL().townHall._lvl.Get() - 1 < getGLOBAL()._buildingProps[5].quantity.length ? getGLOBAL().townHall._lvl.Get() - 1 : getGLOBAL()._buildingProps[5].quantity.length - 1;
                    let canbuild = siloCount < getGLOBAL()._buildingProps[5].quantity[quantityIndex];
                    const tmpr1 = getBASE()._resources.r1.Get() >= 0.8 * getBASE()._resources.r1max;
                    const tmpr2 = getBASE()._resources.r2.Get() >= 0.8 * getBASE()._resources.r2max;
                    const tmpr3 = getBASE()._resources.r3.Get() >= 0.8 * getBASE()._resources.r3max;
                    const tmpr4 = getBASE()._resources.r4.Get() >= 0.8 * getBASE()._resources.r4max;
                    if (canbuild && (tmpr1 || tmpr2 || tmpr3 || tmpr4) && getGLOBAL().Timestamp() - getGLOBAL().StatGet("CM9") > 60 * 60 * 24 * 5) {
                        getGLOBAL().StatSet("CM9", getGLOBAL().Timestamp());
                        pTitle = getKEYS().Get("mkting_silo_title");
                        pBody = getBASE().isInfernoMainYardOrOutpost ? getKEYS().Get("inf_mkting_silo_body") : getKEYS().Get("mkting_silo_body");
                        pImage = "building-storage.png";
                        pButton = getKEYS().Get("mkting_silo_btn");
                        pAction = (param1: MouseEvent): void => {
                            getBUILDINGS()._menuA = 1;
                            getBUILDINGS()._menuB = 1;
                            getBUILDINGS()._page = 0;
                            getBUILDINGS()._buildingID = 6;
                            getBUILDINGS().Show();
                            getPOPUPS().Next();
                        };
                        found = true;
                    }
                    break;
                case "storageupgrade":
                    let sc = 0;
                    const storageInstances = getInstanceManager().getInstancesByClass(getBUILDING6());
                    for (const storage of storageInstances) {
                        tmpBuilding = storage as BFOUNDATION;
                        if (!getBASE().CanUpgrade(tmpBuilding).error && !tmpBuilding._repairing && tmpBuilding._countdownUpgrade.Get() == 0) {
                            tgtb = tmpBuilding;
                            sc++;
                            break;
                        }
                    }
                    quantityIndex = getGLOBAL().townHall._lvl.Get() - 1 < getGLOBAL()._buildingProps[5].quantity.length ? getGLOBAL().townHall._lvl.Get() - 1 : getGLOBAL()._buildingProps[5].quantity.length - 1;
                    canbuild = sc < getGLOBAL()._buildingProps[5].quantity[quantityIndex];
                    const tmpr1b = getBASE()._resources.r1.Get() >= 0.8 * getBASE()._resources.r1max;
                    const tmpr2b = getBASE()._resources.r2.Get() >= 0.8 * getBASE()._resources.r2max;
                    const tmpr3b = getBASE()._resources.r3.Get() >= 0.8 * getBASE()._resources.r3max;
                    const tmpr4b = getBASE()._resources.r4.Get() >= 0.8 * getBASE()._resources.r4max;
                    if (!canbuild && tgtb && (tmpr1b || tmpr2b || tmpr3b || tmpr4b) && getGLOBAL().Timestamp() - getGLOBAL().StatGet("CM10") > 60 * 60 * 24 * 5) {
                        getGLOBAL().StatSet("CM10", getGLOBAL().Timestamp());
                        pTitle = getKEYS().Get("mkting_siloupgrade_title");
                        pBody = getKEYS().Get("mkting_siloupgrade_body");
                        pButton = getKEYS().Get("mkting_siloupgrade_btn");
                        pImage = "building-storage.png";
                        pAction = (param1: MouseEvent): void => {
                            getBUILDINGOPTIONS().Show(tgtb, "upgrade");
                            getPOPUPS().Next();
                        };
                        found = true;
                    }
                    break;
                case "mushroompick":
                    break;
                case "laser":
                    const laser = getInstanceManager().getInstancesByClass(getBUILDING23()).length > 0;
                    if (getGLOBAL().townHall._lvl.Get() >= 4 && !laser && getGLOBAL().Timestamp() - getGLOBAL().StatGet("CM11") > 60 * 60 * 24 * 5) {
                        getGLOBAL().StatSet("CM11", getGLOBAL().Timestamp());
                        pTitle = getKEYS().Get("mkting_laser_title");
                        pBody = getKEYS().Get("mkting_laser_body");
                        pButton = getKEYS().Get("mkting_laser_btn");
                        pImage = "building-laser.png";
                        pAction = (param1: MouseEvent): void => {
                            getBUILDINGS()._menuA = 3;
                            getBUILDINGS()._menuB = 1;
                            getBUILDINGS()._page = 0;
                            getBUILDINGS()._buildingID = 23;
                            getBUILDINGS().Show();
                            getPOPUPS().Next();
                        };
                        found = true;
                    }
                    break;
                case "tesla":
                    const tesla = getInstanceManager().getInstancesByClass(getBUILDING25()).length > 0;
                    if (getGLOBAL().townHall._lvl.Get() >= 4 && !tesla && getGLOBAL().Timestamp() - getGLOBAL().StatGet("CM12") > 60 * 60 * 24 * 5) {
                        getGLOBAL().StatSet("CM12", getGLOBAL().Timestamp());
                        pTitle = getKEYS().Get("mkting_tesla_title");
                        pBody = getKEYS().Get("mkting_tesla_body");
                        pButton = getKEYS().Get("mkting_tesla_btn");
                        pImage = "building-tesla.png";
                        pAction = (param1: MouseEvent): void => {
                            getBUILDINGS()._menuA = 3;
                            getBUILDINGS()._menuB = 1;
                            getBUILDINGS()._page = 0;
                            getBUILDINGS()._buildingID = 25;
                            getBUILDINGS().Show();
                            getPOPUPS().Next();
                        };
                        found = true;
                    }
            }
            if (found) {
                getGLOBAL().StatSet("CM", getGLOBAL().Timestamp());
                getPOPUPS().DisplayGeneric(pTitle, pBody, pButton, pImage, pAction);
                getLOGGER().Stat([36, key]);
            }
        } catch (e) {
            getLOGGER().Log("err", "MARKETING.Show " + key + " " + e.stack);
        }
        return found;
    }

    public static Process(): void {
        let done = false;
        try {
            if (getGLOBAL().mode == getGLOBAL().e_BASE_MODE.BUILD && getTUTORIAL()._stage > 200 && getGLOBAL()._sessionCount > 10 && getGLOBAL().Timestamp() - getGLOBAL().StatGet("CM") > 60 * 60 * 24 * 1) {
                getGLOBAL().StatSet("CM", getGLOBAL().Timestamp());
                done = MARKETING.Show("unlock");
                if (!done) {
                    done = MARKETING.Show("catapult");
                }
                if (!done) {
                    done = MARKETING.Show("upgradeapult");
                }
            }
        } catch (e) {
            getLOGGER().Log("err", "MARKETING.Process " + e.stack);
        }
    }
}
