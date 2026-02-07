import MovieClip from 'openfl/display/MovieClip';
import { POPUPSETTINGS } from './POPUPSETTINGS';

// Lazy imports to break circular dependency chains
function getBASE(): any { return require("./BASE").BASE; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }


/**
 * PLEASEWAIT - Loading/Processing Dialog
 * Displays a waiting message while processing occurs
 */
export class PLEASEWAIT extends MovieClip {
    public static _mc: any = null;
    public static _mcCount: number = 0;
    public static _mcTips: MovieClip | null = null;
    public static lastTipTime: number = 0;
    public static processDuration: number = 0;
    public static processThreshold: number = 60 * 60 * 12;
    public static tipsAvailable: number = 33;
    public static tipIndex: number = 0;
    public static tipDelay: number = 6;
    public static tips: string[] = [];
    public static tipsInited: boolean = false;
    public static tipsLocalKey: string = "tips_hint";

    constructor() {
        super();
    }

    public static Show(message: string): void {
        if (!PLEASEWAIT._mc) {
            PLEASEWAIT._mc = getGLOBAL()._layerTop.addChild(new (GLOBAL as any).PLEASEWAITMC());
            PLEASEWAIT._mc.tMessage.htmlText = "<b>" + message + "</b>";
            PLEASEWAIT._mc.mcFrame.Setup(false);
            POPUPSETTINGS.AlignToCenter(PLEASEWAIT._mc);
        }
    }

    public static Update(message: string = "Processing..."): void {
        if (PLEASEWAIT._mc) {
            PLEASEWAIT._mc.tMessage.htmlText = "<b>" + message + "</b>";
            PLEASEWAIT.AddTips();
        }
    }

    public static Hide(): void {
        try {
            if (PLEASEWAIT._mc) {
                getGLOBAL()._layerTop.removeChild(PLEASEWAIT._mc);
                PLEASEWAIT._mc.mcFrame = null;
                PLEASEWAIT._mc = null;
            }
        } catch (e) {
            // Ignore errors
        }
    }

    public static MessageChange(...args: any[]): void {
        PLEASEWAIT._mc.tMessage.text = args[0];
    }

    public static AddTips(): void {
        if (getGLOBAL()._giveTips && getKEYS()._setup && PLEASEWAIT.HasTips()) {
            if (getBASE()._catchupTime && getBASE()._catchupTime >= PLEASEWAIT.processThreshold && PLEASEWAIT.lastTipTime === 0 && 
                getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD && getBASE().isMainYard && getGLOBAL()._whatsnewid === getGLOBAL()._lastWhatsNew) {
                if (getGLOBAL().StatGet("tipno")) {
                    PLEASEWAIT.tipIndex = getGLOBAL().StatGet("tipno");
                }
                if (PLEASEWAIT.tipIndex < PLEASEWAIT.tips.length) {
                    PLEASEWAIT.ShowTips(PLEASEWAIT.tips[PLEASEWAIT.tipIndex]);
                }
                getGLOBAL().StatSet("tipno", PLEASEWAIT.tipIndex + 1);
            }
        }
    }

    public static HasTips(): boolean {
        if (PLEASEWAIT.tipsInited) return true;
        
        PLEASEWAIT.tips = [];
        let allLoaded: boolean = true;
        for (let i = 1; i <= PLEASEWAIT.tipsAvailable; i++) {
            const key: string = PLEASEWAIT.tipsLocalKey + i;
            const tip: string = getKEYS().Get(key);
            if (tip === "") allLoaded = false;
            PLEASEWAIT.tips.push(tip);
        }
        if (allLoaded) PLEASEWAIT.tipsInited = true;
        return allLoaded;
    }

    public static ShowTips(tip: string): void {
        getGLOBAL()._proTip = new (GLOBAL as any).PROTIP_CLIP();
        getGLOBAL()._proTip.tTitle.htmlText = getKEYS().Get("tips_title");
        getGLOBAL()._proTip.tDesc.htmlText = "<b>" + tip + "</b>";
        getGLOBAL()._proTip.x = 390;
        getGLOBAL()._proTip.y = 240;
        getPOPUPS().Push(getGLOBAL()._proTip, null, null, null, null, true, "tip");
        getPOPUPS().Show("tip");
        PLEASEWAIT.lastTipTime = 1;
    }

    public static HideTips(): void {
        // Empty implementation
    }
}
