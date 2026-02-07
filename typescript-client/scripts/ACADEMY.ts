import { SecNum } from './com/cc/utils/SecNum';
import { ACADEMYPOPUP } from './ACADEMYPOPUP';
import { popup_monster } from './popup_monster';

// Lazy imports to break circular dependency chains
function getInstanceManager(): any { return require("./com/monsters/managers/InstanceManager").InstanceManager; }
function getBFOUNDATION(): any { return require("./BFOUNDATION").BFOUNDATION; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getSOUNDS(): any { return require("./SOUNDS").SOUNDS; }
function getBASE(): any { return require("./BASE").BASE; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getCREATURELOCKER(): any { return require("./CREATURELOCKER").CREATURELOCKER; }
function getBUILDING26(): any { return require("./BUILDING26").BUILDING26; }
function getLOGGER(): any { return require("./LOGGER").LOGGER; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }


/**
 * ACADEMY - Handles monster training upgrades
 * Converted from ActionScript to TypeScript
 */
export class ACADEMY {
    public static readonly ID: number = 26;
    
    public static _building: BFOUNDATION | null = null;
    public static _mc: ACADEMYPOPUP | null = null;
    public static _monsterID: string = '';
    public static _open: boolean = false;
    
    private static _monsterString: string = "C";
    private static _maxMonsters: number = 16;
    private static readonly _infernoFrameOffset: number = 6;
    private static readonly _yardMaxMonsters: number = 16;
    private static readonly _infernoMaxMonsters: number = 9;
    
    constructor() {
        // Empty constructor
    }
    
    public static Show(building: BFOUNDATION): void {
        if (!ACADEMY._open) {
            ACADEMY._open = true;
            ACADEMY._building = building;
            getGLOBAL().BlockerAdd();
            ACADEMY._mc = getGLOBAL()._layerWindows.addChild(new ACADEMYPOPUP()) as ACADEMYPOPUP;
            ACADEMY._mc.Center();
            ACADEMY._mc.ScaleUp();
        }
    }
    
    public static Hide(event?: MouseEvent): void {
        if (ACADEMY._open) {
            getGLOBAL().BlockerRemove();
            getSOUNDS().Play("close");
            getBASE().BuildingDeselect();
            ACADEMY._open = false;
            getGLOBAL()._layerWindows.removeChild(ACADEMY._mc!);
            ACADEMY._mc = null;
        }
    }
    
    public static StartMonsterUpgrade(monsterID: string, checkOnly: boolean = false): { error: boolean; errorMessage: string; status: string } {
        let trainingCosts: any[] | null = null;
        
        if (!getGLOBAL().player.m_upgrades[monsterID]) {
            getGLOBAL().player.m_upgrades[monsterID] = { level: 1 };
        }
        
        let hasError: boolean = false;
        let errorMessage: string = "";
        let status: string = getKEYS().Get("acad_status_level", { v1: getGLOBAL().player.m_upgrades[monsterID].level });
        
        if (ACADEMY._building && !ACADEMY._building._upgrading) {
            if (!getGLOBAL().player.m_upgrades[monsterID].time) {
                if (getCREATURELOCKER()._lockerData[monsterID] && getCREATURELOCKER()._lockerData[monsterID].t === 2) {
                    if (getGLOBAL().player.m_upgrades[monsterID].level < getCREATURELOCKER()._creatures[monsterID].trainingCosts.length + 1) {
                        if (getGLOBAL().player.m_upgrades[monsterID].level <= ACADEMY._building._lvl.Get()) {
                            trainingCosts = getCREATURELOCKER()._creatures[monsterID].trainingCosts[getGLOBAL().player.m_upgrades[monsterID].level - 1];
                            
                            if (getBASE().Charge(3, trainingCosts![0], true) > 0) {
                                if (!checkOnly) {
                                    getBASE().Charge(3, trainingCosts![0]);
                                    getGLOBAL().player.m_upgrades[monsterID].time = new SecNum(getGLOBAL().Timestamp() + trainingCosts![1]);
                                    getGLOBAL().player.m_upgrades[monsterID].duration = trainingCosts![1];
                                    ACADEMY._building._upgrading = monsterID;
                                    getBASE().Save();
                                    getLOGGER().Stat([11, parseInt(monsterID.substr(1)), getGLOBAL().player.m_upgrades[monsterID].level + 1]);
                                }
                            } else {
                                hasError = true;
                                errorMessage = getBASE().isInfernoMainYardOrOutpost ? getKEYS().Get("acad_err_sulfur") : getKEYS().Get("acad_err_putty");
                                status = getBASE().isInfernoMainYardOrOutpost ? getKEYS().Get("acad_err_sulfur") : getKEYS().Get("acad_err_putty");
                            }
                        } else {
                            hasError = true;
                            errorMessage = getKEYS().Get("acad_err_upgrade");
                            status = getKEYS().Get("acad_err_upgrade");
                            
                            if (getBASE().isInfernoMainYardOrOutpost && getGLOBAL().player.m_upgrades[monsterID].level >= 5) {
                                hasError = true;
                                errorMessage = getKEYS().Get("acad_err_fullytrained");
                                status = getKEYS().Get("acad_err_lfullytrained", { v1: getGLOBAL().player.m_upgrades[monsterID].level });
                            }
                        }
                    } else {
                        hasError = true;
                        errorMessage = getKEYS().Get("acad_err_fullytrained");
                        status = getKEYS().Get("acad_err_lfullytrained", { v1: getGLOBAL().player.m_upgrades[monsterID].level });
                    }
                } else {
                    hasError = true;
                    errorMessage = getKEYS().Get("acad_err_locked");
                    status = getKEYS().Get("acad_err_locked");
                }
            } else {
                hasError = true;
                errorMessage = getKEYS().Get("acad_err_training", { v1: getGLOBAL().player.m_upgrades[monsterID].level + 1 });
                status = getKEYS().Get("acad_err_trainingstatus", {
                    v1: getGLOBAL().player.m_upgrades[monsterID].level + 1,
                    v2: getGLOBAL().ToTime(getGLOBAL().player.m_upgrades[monsterID].time.Get() - getGLOBAL().Timestamp())
                });
            }
        } else {
            hasError = true;
            errorMessage = getKEYS().Get("acad_err_busy");
            
            if (getGLOBAL().player.m_upgrades[monsterID].time) {
                status = getKEYS().Get("acad_err_trainingstatus", {
                    v1: getGLOBAL().player.m_upgrades[monsterID].level + 1,
                    v2: getGLOBAL().ToTime(getGLOBAL().player.m_upgrades[monsterID].time.Get() - getGLOBAL().Timestamp())
                });
            }
        }
        
        return {
            error: hasError,
            errorMessage: errorMessage,
            status: status
        };
    }
    
    public static CancelMonsterUpgrade(monsterID: string): void {
        delete getGLOBAL().player.m_upgrades[monsterID].time;
        delete getGLOBAL().player.m_upgrades[monsterID].duration;
        
        const academyInstances: BUILDING26[] = getInstanceManager().getInstancesByClass(getBUILDING26()) as BUILDING26[];
        
        for (const academy of academyInstances) {
            if (academy._upgrading === monsterID) {
                academy._upgrading = null;
                break;
            }
        }
        
        getBASE().Fund(3, getCREATURELOCKER()._creatures[monsterID].trainingCosts[getGLOBAL().player.m_upgrades[monsterID].level - 1][0]);
        getBASE().Save();
    }
    
    public static FinishMonsterUpgrade(monsterID: string): void {
        delete getGLOBAL().player.m_upgrades[monsterID].time;
        delete getGLOBAL().player.m_upgrades[monsterID].duration;
        ++getGLOBAL().player.m_upgrades[monsterID].level;
        
        if (getGLOBAL().player.monsterListByID(monsterID)) {
            getGLOBAL().player.monsterListByID(monsterID).level = getGLOBAL().player.m_upgrades[monsterID].level;
        }
        
        const stat: any[] = getCREATURELOCKER()._creatures[monsterID].props.cResource;
        
        if (stat && getGLOBAL().player.m_upgrades[monsterID].level === stat.length - 1) {
            getLOGGER().KongStat([5, monsterID.substr(1)]);
        }
        
        const academyInstances: BUILDING26[] = getInstanceManager().getInstancesByClass(getBUILDING26()) as BUILDING26[];
        
        for (const academy of academyInstances) {
            if (academy._upgrading === monsterID) {
                academy._upgrading = null;
                break;
            }
        }
        
        getLOGGER().Stat([12, monsterID.substr(monsterID.indexOf("C") + 1), getGLOBAL().player.m_upgrades[monsterID].level]);
        
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD) {
            let bragImage: string | null = null;
            
            if (getCREATURELOCKER()._creatures[monsterID].stream[2]) {
                bragImage = String(getCREATURELOCKER()._creatures[monsterID].stream[2]);
            }
            
            const monsterName: string = getKEYS().Get(getCREATURELOCKER()._creatures[monsterID].name);
            
            const Post = (): void => {
                if (getBASE().isInfernoMainYardOrOutpost) {
                    getGLOBAL().CallJS("sendFeed", [
                        "academy-training",
                        getKEYS().Get("acad_stream_title_inf", {
                            v1: monsterName,
                            v2: getGLOBAL().player.m_upgrades[monsterID].level
                        }),
                        getKEYS().Get("acad_stream_description"),
                        bragImage,
                        0
                    ]);
                } else {
                    getGLOBAL().CallJS("sendFeed", [
                        "academy-training",
                        getKEYS().Get("acad_stream_title", {
                            v1: monsterName,
                            v2: getGLOBAL().player.m_upgrades[monsterID].level
                        }),
                        getKEYS().Get("acad_stream_description"),
                        bragImage,
                        0
                    ]);
                }
                getPOPUPS().Next();
            };
            
            const popupMC: popup_monster = new popup_monster();
            popupMC.tText.htmlText = getKEYS().Get("acad_pop_complete", { v1: monsterName });
            popupMC.bAction.SetupKey("btn_warnyourfriends");
            popupMC.bAction.addEventListener("click", Post);
            popupMC.bAction.Highlight = true;
            popupMC.bSpeedup.visible = false;
            getPOPUPS().Push(popupMC, null, null, null, `${monsterID}-150.png`);
        }
    }
    
    public static Tick(): void {
        for (const monsterID in getGLOBAL().player.m_upgrades) {
            const upgrade = getGLOBAL().player.m_upgrades[monsterID];
            
            if (upgrade.time != null) {
                if (getGLOBAL().player.m_upgrades[monsterID].time.Get() <= getGLOBAL().Timestamp()) {
                    ACADEMY.FinishMonsterUpgrade(monsterID);
                }
            }
        }
        
        ACADEMY.Update();
    }
    
    public static Update(): void {
        if (ACADEMY._mc) {
            ACADEMY._mc.Update();
        }
    }
}
