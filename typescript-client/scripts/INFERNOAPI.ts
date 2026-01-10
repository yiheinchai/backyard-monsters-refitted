import EventDispatcher from 'openfl/events/EventDispatcher';
import Event from 'openfl/events/Event';
import IOErrorEvent from 'openfl/events/IOErrorEvent';
import getTimer from 'openfl/utils/getTimer';
import { SecNum } from './com/cc/utils/SecNum';
import { WMBASE } from './com/monsters/ai/WMBASE';
import { URLLoaderApi } from './URLLoaderApi';
import { BASE } from './BASE';
import { GLOBAL } from './GLOBAL';
import { LOGGER } from './LOGGER';
import { MAPROOM_DESCENT } from './MAPROOM_DESCENT';
import { PLEASEWAIT } from './PLEASEWAIT';

class InternalClass {
    constructor() {
    }
}

export class INFERNOAPI extends EventDispatcher {
    public static _baseID: number;
    public static _wmID: number;
    public static _saving: boolean;
    public static _loading: boolean;
    public static _initialized: boolean = false;
    private static _loadedSomething: boolean = false;
    private static _loadType: string;
    private static _prevMode: string;
    public static _infernoLoadData: any = {};
    public static _descentLoadData: any = {};
    public static _wmBasesDescent: any[];
    public static _wmBasesInferno: any[];
    public static _wmBases: any[];
    public static _descentLootData: any;
    private static _infernoapi: INFERNOAPI;
    private static eventDispatcher: EventDispatcher;
    public static readonly EVENT_DESCENTLOADED: string = "descentDataProcessed";

    constructor(param1: InternalClass) {
        super();
        INFERNOAPI._infernoapi = this;
    }

    public static getInstance(): INFERNOAPI {
        if (INFERNOAPI._infernoapi == null) {
            INFERNOAPI._infernoapi = new INFERNOAPI(new InternalClass());
        }
        return INFERNOAPI._infernoapi;
    }

    public static Cleanup(): void {
        INFERNOAPI._infernoLoadData = {};
        INFERNOAPI._descentLoadData = {};
    }

    public static LoadInfernoData(url: string = null, userid: number = 0, baseid: number = 0, mode: string = "idescent", createinfernobase: boolean = false): void {
        const handleLoadSuccessful = (param1: any): void => {
            if (param1.error == 0) {
                if (!INFERNOAPI._loadedSomething && typeof (window as any).cc?.recordStats === 'function') {
                    (window as any).cc.recordStats("baseend");
                    INFERNOAPI._loadedSomething = true;
                }
                if (INFERNOAPI._loadType == "idescent") {
                    INFERNOAPI._descentLoadData = param1;
                    if (param1.wmstatus) {
                        INFERNOAPI._wmBasesDescent = param1.wmstatus;
                        INFERNOAPI.ProcessWmBases(INFERNOAPI._wmBasesDescent);
                        INFERNOAPI.DescentDataReady();
                    }
                    if (param1.resources) {
                        INFERNOAPI._descentLootData = param1.resources;
                        if (INFERNOAPI._descentLootData.r1) {
                            MAPROOM_DESCENT._loot.r1 = new SecNum(Number(INFERNOAPI._descentLootData.r1));
                        } else {
                            MAPROOM_DESCENT._loot.r1 = new SecNum(0);
                        }
                        if (INFERNOAPI._descentLootData.r2) {
                            MAPROOM_DESCENT._loot.r2 = new SecNum(Number(INFERNOAPI._descentLootData.r2));
                        } else {
                            MAPROOM_DESCENT._loot.r2 = new SecNum(0);
                        }
                        if (INFERNOAPI._descentLootData.r3) {
                            MAPROOM_DESCENT._loot.r3 = new SecNum(Number(INFERNOAPI._descentLootData.r3));
                        } else {
                            MAPROOM_DESCENT._loot.r3 = new SecNum(0);
                        }
                        if (INFERNOAPI._descentLootData.r4) {
                            MAPROOM_DESCENT._loot.r4 = new SecNum(Number(INFERNOAPI._descentLootData.r4));
                        } else {
                            MAPROOM_DESCENT._loot.r4 = new SecNum(0);
                        }
                    } else {
                        INFERNOAPI._descentLootData = {};
                        MAPROOM_DESCENT._loot.r1 = new SecNum(0);
                        MAPROOM_DESCENT._loot.r2 = new SecNum(0);
                        MAPROOM_DESCENT._loot.r3 = new SecNum(0);
                        MAPROOM_DESCENT._loot.r4 = new SecNum(0);
                    }
                } else if (BASE.isInfernoMainYardOrOutpost) {
                    INFERNOAPI._infernoLoadData = param1;
                }
                GLOBAL.WaitHide();
            }
            INFERNOAPI._loading = false;
        };
        const handleLoadError = (param1: IOErrorEvent): void => {
            if (GLOBAL._reloadonerror) {
                GLOBAL.CallJS("reloadPage");
            } else {
                LOGGER.Log("err", "INFERNOAPI.Load HTTP");
                PLEASEWAIT.Hide();
                GLOBAL.ErrorMessage("INFERNO.Load HTTP");
            }
            INFERNOAPI._loading = false;
        };
        const t = getTimer();
        INFERNOAPI._loading = true;
        INFERNOAPI._baseID = baseid;
        PLEASEWAIT.Hide();
        INFERNOAPI.Cleanup();
        PLEASEWAIT.Show(KEYS.Get("msg_loading"));
        const tmpMode = GLOBAL.mode;
        INFERNOAPI._loadType = mode;
        const loadVars = [["userid", userid > 0 ? userid : ""], ["baseid", INFERNOAPI._baseID], ["type", INFERNOAPI._loadType]];
        if (url) {
            new URLLoaderApi().load(url + "load", loadVars, handleLoadSuccessful, handleLoadError);
        } else if (BASE.isInfernoMainYardOrOutpost) {
            new URLLoaderApi().load(GLOBAL._infBaseURL + "load", loadVars, handleLoadSuccessful, handleLoadError);
        } else {
            new URLLoaderApi().load(GLOBAL._baseURL + "load", loadVars, handleLoadSuccessful, handleLoadError);
        }
    }

    public static ProcessWmBases(param1: any[]): void {
        if (WMBASE._bases) {
            INFERNOAPI._wmBases = WMBASE._bases;
        }
        WMBASE.DescentData(param1);
    }

    public static RevertWmBases(): boolean {
        if (INFERNOAPI._wmBases) {
            WMBASE._bases = INFERNOAPI._wmBases;
            return true;
        }
        return false;
    }

    public static DescentDataReady(): void {
        INFERNOAPI.dispatchEventStatic(new Event(INFERNOAPI.EVENT_DESCENTLOADED));
    }

    public static addEventListenerStatic(param1: string, param2: Function, param3: boolean = false, param4: number = 0, param5: boolean = false): void {
        INFERNOAPI.getInstance().addEventListener(param1, param2 as any, param3, param4, param5);
    }

    public static dispatchEventStatic(param1: Event): boolean {
        return INFERNOAPI.getInstance().dispatchEvent(param1);
    }

    public static removeEventListenerStatic(param1: string, param2: Function, param3: boolean = false): void {
        INFERNOAPI.getInstance().removeEventListener(param1, param2 as any, param3);
    }

    public static hasEventListenerStatic(param1: string): boolean {
        return INFERNOAPI.getInstance().hasEventListener(param1);
    }

    public static willTriggerStatic(param1: string): boolean {
        return INFERNOAPI.getInstance().willTrigger(param1);
    }
}
