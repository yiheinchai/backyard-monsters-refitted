
import EventDispatcher from 'openfl/events/EventDispatcher';
import Event from 'openfl/events/Event';
import URLLoader from 'openfl/net/URLLoader';
import URLRequest from 'openfl/net/URLRequest';
import URLVariables from 'openfl/net/URLVariables';
import { StartTimer, Timestamp } from './GLOBAL'; // Assuming helper access or direct GLOBAL access
import { GLOBAL } from './GLOBAL';
import { WMBASE } from './WMBASE'; // Stub needed
import { MAPROOM_DESCENT } from './MAPROOM_DESCENT';
import { BASE } from './BASE';
import { LOGGER } from './LOGGER';
import { PLEASEWAIT } from './PLEASEWAIT';
import { KEYS } from './KEYS';
import { SecNum } from './com/cc/utils/SecNum'; // Stub needed

interface InfernoLoadData {
    error?: number;
    wmstatus?: any[];
    resources?: any;
    [key: string]: any;
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
    
    private static _instance: INFERNOAPI;
    
    public static const EVENT_DESCENTLOADED: string = "descentDataProcessed";

    constructor() {
        super();
        INFERNOAPI._instance = this;
    }

    public static getInstance(): INFERNOAPI {
        if (!INFERNOAPI._instance) {
            INFERNOAPI._instance = new INFERNOAPI();
        }
        return INFERNOAPI._instance;
    }

    public static Cleanup(): void {
        INFERNOAPI._infernoLoadData = {};
        INFERNOAPI._descentLoadData = {};
    }

    public static LoadInfernoData(urlVal: string | null = null, userid: number = 0, baseid: number = 0, mode: string = "idescent", createinfernobase: boolean = false): void {
        let tmpMode: string;
        let loadVars: URLVariables = new URLVariables();
        
        let handleLoadSuccessful = (e: Event): void => {
             let loader: URLLoader = e.target as URLLoader;
             let param1: any = {};
             try {
                 param1 = JSON.parse(loader.data);
             } catch(err) {
                 console.error("INFERNOAPI JSON Parse Error", err);
                 return;
             }
             
             if (param1.error == 0) {
                 /* 
                 if (!INFERNOAPI._loadedSomething && ExternalInterface.available) {
                      ExternalInterface.call("cc.recordStats", "baseend");
                      INFERNOAPI._loadedSomething = true;
                 }
                 */
                 if (INFERNOAPI._loadType == "idescent") {
                      INFERNOAPI._descentLoadData = param1;
                      if (param1.wmstatus) {
                           INFERNOAPI._wmBasesDescent = param1.wmstatus;
                           INFERNOAPI.ProcessWmBases(INFERNOAPI._wmBasesDescent);
                           INFERNOAPI.DescentDataReady();
                      }
                      // ... processing resources ...
                      if(param1.resources) {
                          INFERNOAPI._descentLootData = param1.resources;
                          // SecNum logic stubbed/simplified
                          MAPROOM_DESCENT._loot = MAPROOM_DESCENT._loot || {};
                          MAPROOM_DESCENT._loot.r1 = new SecNum(parseInt(INFERNOAPI._descentLootData.r1 || 0));
                          MAPROOM_DESCENT._loot.r2 = new SecNum(parseInt(INFERNOAPI._descentLootData.r2 || 0));
                          MAPROOM_DESCENT._loot.r3 = new SecNum(parseInt(INFERNOAPI._descentLootData.r3 || 0));
                          MAPROOM_DESCENT._loot.r4 = new SecNum(parseInt(INFERNOAPI._descentLootData.r4 || 0));
                      } else {
                          INFERNOAPI._descentLootData = {};
                           // ... set to 0 ...
                      }

                 } else if (BASE.isInfernoMainYardOrOutpost) {
                      INFERNOAPI._infernoLoadData = param1;
                 }
                 GLOBAL.WaitHide();
             }
             INFERNOAPI._loading = false;
        };

        let handleLoadError = (e: any): void => {
             if (GLOBAL._reloadonerror) {
                 GLOBAL.CallJS("reloadPage");
             } else {
                 LOGGER.Log("err", "INFERNOAPI.Load HTTP");
                 PLEASEWAIT.Hide();
                 GLOBAL.ErrorMessage("INFERNO.Load HTTP");
             }
             INFERNOAPI._loading = false;
        };

        INFERNOAPI._loading = true;
        INFERNOAPI._baseID = baseid;
        PLEASEWAIT.Hide();
        INFERNOAPI.Cleanup();
        PLEASEWAIT.Show(KEYS.Get("msg_loading"));
        tmpMode = GLOBAL.mode;
        INFERNOAPI._loadType = mode;
        
        loadVars.userid = userid > 0 ? userid : "";
        loadVars.baseid = INFERNOAPI._baseID;
        loadVars.type = INFERNOAPI._loadType;
        
        let reqUrl: string = "";
        if (urlVal) {
             reqUrl = urlVal + "load";
        } else if (BASE.isInfernoMainYardOrOutpost) {
             reqUrl = GLOBAL._infBaseURL + "load";
        } else {
             reqUrl = GLOBAL._baseURL + "load";
        }
        
        let request: URLRequest = new URLRequest(reqUrl);
        request.data = loadVars;
        
        let loader: URLLoader = new URLLoader();
        loader.addEventListener(Event.COMPLETE, handleLoadSuccessful);
        loader.addEventListener('ioError', handleLoadError);
        loader.load(request);
    }
    
    public static ProcessWmBases(param1: any[]): void {
        if (WMBASE._bases) {
            INFERNOAPI._wmBases = WMBASE._bases;
        }
        WMBASE.DescentData(param1);
    }
    
    public static DescentDataReady(): void {
        INFERNOAPI.getInstance().dispatchEvent(new Event(INFERNOAPI.EVENT_DESCENTLOADED));
    }
    
    // Static EventDispatcher proxy methods
    public static addEventListener(type: string, listener: Function, useCapture: boolean = false, priority: number = 0, useWeakReference: boolean = false): void {
        INFERNOAPI.getInstance().addEventListener(type, listener as any, useCapture, priority, useWeakReference);
    }
    
    public static dispatchEvent(event: Event): boolean {
        return INFERNOAPI.getInstance().dispatchEvent(event);
    }
    
    public static removeEventListener(type: string, listener: Function, useCapture: boolean = false): void {
        INFERNOAPI.getInstance().removeEventListener(type, listener as any, useCapture);
    }
    
    public static hasEventListener(type: string): boolean {
        return INFERNOAPI.getInstance().hasEventListener(type);
    }
    
    public static willTrigger(type: string): boolean {
        return INFERNOAPI.getInstance().willTrigger(type);
    }

}
