import { SecNum } from "./com/cc/utils/SecNum";
import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import MovieClip from "openfl/display/MovieClip";
import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";
import Rectangle from "openfl/geom/Rectangle";
import { BFOUNDATION } from "./BFOUNDATION";
import { MONSTERLABPOPUP } from "./MONSTERLABPOPUP";
import { popup_building } from "./popup_building";
import { popup_monster } from "./popup_monster";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getSOUNDS(): any { return require("./SOUNDS").SOUNDS; }
function getBASE(): any { return require("./BASE").BASE; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }
function getCREATURELOCKER(): any { return require("./CREATURELOCKER").CREATURELOCKER; }
function getCREEPS(): any { return require("./CREEPS").CREEPS; }
function getSTORE(): any { return require("./STORE").STORE; }
function getLOGGER(): any { return require("./LOGGER").LOGGER; }


export class MONSTERLAB extends BFOUNDATION {
    public static _open: boolean = false;
    public static _mcPopup: MONSTERLABPOPUP;
    public static _powerupProps: any = {};

    public _field: BitmapData;
    public _fieldBMP: Bitmap;
    public _frameNumber: number;
    public _animBitmap: BitmapData;
    public _upgradeLevel: number = 0;
    public _upgradeFinishTime: SecNum;
    public _streamUpgradeCache: string = "";

    constructor() {
        super();
        this._type = 116;
        this._footprint = [new Rectangle(0, 0, 100, 100)];
        this._gridCost = [[new Rectangle(0, 0, 100, 100), 10], [new Rectangle(10, 10, 80, 80), 200]];
        this.SetProps();
    }

    public static Hide(param1: MouseEvent = null): void {
        if (MONSTERLAB._open) {
            getGLOBAL().BlockerRemove();
            getSOUNDS().Play("close");
            getBASE().BuildingDeselect();
            MONSTERLAB._open = false;
            getGLOBAL()._layerWindows.removeChild(MONSTERLAB._mcPopup);
            MONSTERLAB._mcPopup = null;
        }
    }

    public static GetPuttyCost(param1: string, param2: number): number {
        if (MONSTERLAB._powerupProps) {
            if (MONSTERLAB._powerupProps[param1]) {
                return MONSTERLAB._powerupProps[param1].costs[param2 - 1][0];
            }
        }
        return 0;
    }

    public static GetTimeCost(param1: string, param2: number): number {
        if (MONSTERLAB._powerupProps) {
            if (MONSTERLAB._powerupProps[param1]) {
                return MONSTERLAB._powerupProps[param1].costs[param2 - 1][1];
            }
        }
        return 0;
    }

    public static GetShinyCost(param1: string, param2: number): number {
        const _loc3_: number = getSTORE().GetTimeCost(MONSTERLAB.GetTimeCost(param1, param2), false);
        const _loc4_: number = Math.ceil(Math.pow(Math.sqrt(MONSTERLAB.GetPuttyCost(param1, param2) / 2), 0.75));
        return _loc3_ + _loc4_;
    }

    override SetProps(): void {
        super.SetProps();
        MONSTERLAB._powerupProps = {
            "C3": {
                "name": "lab_boltname",
                "order": 1,
                "description": "lab_boltdesc",
                "ability": "Blink Range",
                "upgrade_description": "lab_boltdesc_u",
                "stream": ["lab_boltstream", "lab_boltstream_unlock", "lab_boltstream_upgrade"],
                "streampic": "lab_bolt.png",
                "costs": [[48000, 60 * 60 * 24], [72000, 60 * 60 * 24], [108000, 60 * 60 * 24]],
                "effect": [150, 300, 450]
            },
            "C4": {
                "name": "lab_finkname",
                "order": 2,
                "description": "lab_finkdesc",
                "ability": "Extra Target(s)",
                "upgrade_description": "lab_finkdesc_u",
                "stream": ["lab_finkstream", "lab_finkstream_unlock", "lab_finkstream_upgrade"],
                "streampic": "lab_fink5.png",
                "costs": [[96000, 60 * 60 * 30], [128000, 60 * 60 * 30], [144000, 60 * 60 * 30]],
                "effect": [1, 2, 3]
            },
            "C7": {
                "name": "lab_banditoname",
                "order": 3,
                "description": "lab_banditodesc",
                "ability": "Whirlwind",
                "upgrade_description": "lab_banditodesc_u",
                "stream": ["lab_banditostream", "lab_banditostream_unlock", "lab_banditostream_upgrade"],
                "streampic": "lab_bandito.png",
                "costs": [[1000000, 60 * 60 * 32], [1500000, 60 * 60 * 32], [2000000, 60 * 60 * 32]],
                "effect": [1, 1.5, 2]
            },
            "C8": {
                "name": "lab_fangname",
                "order": 4,
                "description": "lab_fangdesc",
                "ability": "Venom Damage",
                "upgrade_description": "lab_fangdesc_u",
                "stream": ["lab_fangstream", "lab_fangstream_unlock", "lab_fangstream_upgrade"],
                "streampic": "lab_fang5.png",
                "costs": [[2000000, 60 * 60 * 36], [3000000, 60 * 60 * 36], [4500000, 60 * 60 * 36]],
                "effect": [0.1, 0.2, 0.3]
            },
            "C5": {
                "name": "lab_eyeraname",
                "order": 5,
                "description": "lab_eyeradesc",
                "ability": "Airburst Bonus",
                "upgrade_description": "lab_eyeradesc_u",
                "stream": ["lab_eyerastream", "lab_eyerastream_unlock", "lab_eyerastream_upgrade"],
                "streampic": "lab_eyera5.png",
                "costs": [[3560000, 60 * 60 * 48], [4120000, 60 * 60 * 54], [5120000, 60 * 60 * 60]],
                "effect": [0.2, 0.3, 0.4]
            },
            "C9": {
                "name": "lab_brainname",
                "order": 6,
                "description": "lab_braindesc",
                "ability": "s Cloak Delay",
                "upgrade_description": "lab_braindesc_u",
                "stream": ["lab_brainstream", "lab_brainstream_unlock", "lab_brainstream_upgrade"],
                "streampic": "lab_brain.png",
                "costs": [[3000000, 60 * 60 * 48], [4500000, 60 * 60 * 48], [6000000, 60 * 60 * 48]],
                "effect": [0, 4, 8]
            },
            "C11": {
                "name": "lab_projectxname",
                "order": 7,
                "description": "lab_projectxdesc",
                "ability": "Acid Damage",
                "upgrade_description": "lab_projectxdesc_u",
                "stream": ["lab_projxstream", "lab_projxstream_unlock", "lab_projxstream_upgrade"],
                "streampic": "lab_projectx.png",
                "costs": [[8000000, 60 * 60 * 72], [12000000, 60 * 60 * 72], [18000000, 60 * 60 * 72]],
                "effect": [1, 2, 3]
            },
            "C12": {
                "name": "lab_davename",
                "order": 10,
                "description": "lab_davedesc",
                "ability": "Rocket Range",
                "upgrade_description": "lab_davedesc_u",
                "stream": ["lab_davestream", "lab_davestream_unlock", "lab_davestream_upgrade"],
                "streampic": "lab_dave.png",
                "costs": [[15000000, 60 * 60 * 144], [22500000, 60 * 60 * 144], [33750000, 60 * 60 * 144]],
                "effect": [140, 180, 220]
            },
            "C13": {
                "name": "lab_wormzername",
                "order": 8,
                "description": "lab_wormzerdesc",
                "ability": "Splash Damage",
                "upgrade_description": "lab_wormzerdesc_u",
                "stream": ["lab_wormstream", "lab_wormstream_unlock", "lab_wormstream_upgrade"],
                "streampic": "lab_wormzer.png",
                "costs": [[10000000, 60 * 60 * 96], [15000000, 60 * 60 * 96], [22500000, 60 * 60 * 96]],
                "effect": [1, 2, 3]
            },
            "C14": {
                "name": "lab_teratornname",
                "order": 9,
                "description": "lab_teratorndesc",
                "ability": "Fireball Bounces",
                "upgrade_description": "lab_teratorndesc_u",
                "stream": ["lab_terastream", "lab_terastream_unlock", "lab_terastream_upgrade"],
                "streampic": "lab_teratorn.png",
                "costs": [[12000000, 60 * 60 * 120], [18000000, 60 * 60 * 120], [27000000, 60 * 60 * 120]],
                "effect": [1, 2, 3]
            }
        };
    }

    override Click(param1: MouseEvent = null): void {
        if (Boolean(this._upgrading) && (!this._upgradeFinishTime || this._upgradeFinishTime.Get() == 0)) {
            this._upgrading = null;
        }
        super.Click(param1);
    }

    override Tick(param1: number): void {
        super.Tick(param1);
        if (Boolean(this._upgrading) && getGLOBAL().Timestamp() >= this._upgradeFinishTime.Get()) {
            this.FinishMonsterPowerup();
        }
        if (MONSTERLAB._open) {
            (MONSTERLAB._mcPopup as MONSTERLABPOPUP).Tick();
        }
    }

    override TickFast(param1: Event = null): void {
        super.TickFast(param1);
        if (this._upgrading && getGLOBAL()._render && this._countdownBuild.Get() + this._countdownUpgrade.Get() == 0) {
            if ((getGLOBAL().mode == getGLOBAL().e_BASE_MODE.BUILD || getGLOBAL().mode == "help" || getGLOBAL().mode == "view") && this._frameNumber % 3 == 0 && getCREEPS()._creepCount == 0) {
                this.AnimFrame(true);
            } else if (this._frameNumber % 10 == 0) {
                this.AnimFrame(true);
            }
        }
        ++this._frameNumber;
    }

    override Constructed(): void {
        let mc: MovieClip = null;
        super.Constructed();
        getGLOBAL()._bLab = this;
        
        if (getGLOBAL().mode == getGLOBAL().e_BASE_MODE.BUILD && getBASE().isMainYard) {
            const Brag = (): void => {
                getGLOBAL().CallJS("sendFeed", ["monsterlab-construct", getKEYS().Get("pop_labbuilt_streamtitle"), getKEYS().Get("pop_labbuilt_streambody"), "build-monsterlab.png"]);
                getPOPUPS().Next();
            };
            mc = new popup_building();
            (mc as any).tA.htmlText = "<b>" + getKEYS().Get("pop_labbuilt_title") + "</b>";
            (mc as any).tB.htmlText = getKEYS().Get("pop_labbuilt_body");
            (mc as any).bPost.SetupKey("btn_brag");
            (mc as any).bPost.addEventListener(MouseEvent.CLICK, Brag);
            (mc as any).bPost.Highlight = true;
            getPOPUPS().Push(mc, null, null, null, "build.v2.png");
        }
    }

    override Upgrade(): boolean {
        if (this._upgrading) {
            getGLOBAL().Message(getKEYS().Get("lab_err_cantupgrade"));
            return false;
        }
        return super.Upgrade();
    }

    override Recycle(): void {
        if (this._upgrading) {
            getGLOBAL().Message(getKEYS().Get("lab_err_cantrecycle"));
        } else {
            getGLOBAL()._bAcademy = null;
            super.Recycle();
        }
    }

    public Show(): void {
        if (!MONSTERLAB._open) {
            MONSTERLAB._open = true;
            getGLOBAL().BlockerAdd();
            MONSTERLAB._mcPopup = getGLOBAL()._layerWindows.addChild(new MONSTERLABPOPUP()) as MONSTERLABPOPUP;
            MONSTERLAB._mcPopup.Center();
            MONSTERLAB._mcPopup.ScaleUp();
        }
    }

    public CanPowerup(param1: string, param2: number): any {
        if (getGLOBAL().player.m_upgrades[param1] == null) {
            return { "error": true, "errorString": "Not Unlocked" };
        }
        if (Boolean(getGLOBAL().player.m_upgrades[param1]) && getGLOBAL().player.m_upgrades[param1].powerup == 3) {
            return { "error": true, "errorString": "Fully Powered Up" };
        }
        if (param2 > this._lvl.Get()) {
            return { "error": true, "errorString": "Upgrade Monster Lab" };
        }
        if (getCREATURELOCKER()._lockerData[param1] == null) {
            return { "error": true, "errorString": "Not Unlocked" };
        }
        if (getCREATURELOCKER()._lockerData[param1].t < 2) {
            return { "error": true, "errorString": "Not Unlocked" };
        }
        if (getGLOBAL().player.m_upgrades[param1].level < param2 + 1) {
            return { "error": true, "errorString": "Needs Training" };
        }
        if (!getBASE().Charge(3, MONSTERLAB._powerupProps[param1].costs[param2 - 1][0], true)) {
            return { "error": true, "errorString": getKEYS().Get("acad_err_putty") };
        }
        return { "error": false };
    }

    public StartMonsterPowerup(param1: string, param2: number): void {
        if (this.CanPowerup(param1, param2).error) {
            return;
        }
        getBASE().Charge(3, MONSTERLAB.GetPuttyCost(param1, param2));
        this._upgrading = param1;
        this._upgradeFinishTime = new SecNum(getGLOBAL().Timestamp() + MONSTERLAB.GetTimeCost(param1, param2));
        this._upgradeLevel = param2;
        getBASE().Save();
        getLOGGER().Stat([49, param1.substr(1), param2]);
    }

    public FinishMonsterPowerup(): void {
        let monsterName: string = null;
        let powerName: string = null;
        let popupMC: popup_monster = null;
        const wasUpgrading: string = this._upgrading;
        this._upgradeFinishTime = new SecNum(0);
        
        if (getGLOBAL().player && getGLOBAL().player.m_upgrades && getGLOBAL().player.m_upgrades[this._upgrading]) {
            getGLOBAL().player.m_upgrades[this._upgrading].powerup = this._upgradeLevel;
        }
        getLOGGER().Stat([50, this._upgrading.substr(1), this._upgradeLevel]);
        
        if (getGLOBAL().mode == getGLOBAL().e_BASE_MODE.BUILD) {
            const Post = (): void => {
                if (this._upgradeLevel == 1) {
                    getGLOBAL().CallJS("sendFeed", ["lab-powerup", getKEYS().Get(MONSTERLAB._powerupProps[this._streamUpgradeCache].stream[0]), getKEYS().Get(MONSTERLAB._powerupProps[this._streamUpgradeCache].stream[1], { "v1": powerName }), MONSTERLAB._powerupProps[this._streamUpgradeCache].streampic, 0]);
                } else {
                    getGLOBAL().CallJS("sendFeed", ["lab-powerup", getKEYS().Get(MONSTERLAB._powerupProps[this._streamUpgradeCache].stream[0]), getKEYS().Get(MONSTERLAB._powerupProps[this._streamUpgradeCache].stream[2], { "v1": this._upgradeLevel }), MONSTERLAB._powerupProps[this._streamUpgradeCache].streampic, 0]);
                }
                getPOPUPS().Next();
            };
            monsterName = getKEYS().Get(getCREATURELOCKER()._creatures[this._upgrading].name);
            powerName = getKEYS().Get(MONSTERLAB._powerupProps[this._upgrading].name);
            popupMC = new popup_monster();
            popupMC.tText.htmlText = "<b>" + getKEYS().Get("lab_powerup_complete", {
                "v1": powerName,
                "v2": this._upgradeLevel
            }) + "</b>";
            popupMC.bAction.SetupKey("btn_warnyourfriends");
            popupMC.bAction.addEventListener(MouseEvent.CLICK, Post);
            popupMC.bAction.Highlight = true;
            popupMC.bSpeedup.visible = false;
            getPOPUPS().Push(popupMC, null, null, null, "" + this._upgrading + "-LAB-150.png");
            this._streamUpgradeCache = this._upgrading;
        }
        this._upgrading = null;
        if (MONSTERLAB._open) {
            (MONSTERLAB._mcPopup as MONSTERLABPOPUP).Setup(wasUpgrading);
        }
        getBASE().Save();
    }

    public CancelMonsterPowerup(param1: MouseEvent): void {
        if (this._upgrading) {
            getGLOBAL().Message(getKEYS().Get("lab_confirmcancel", {
                "v1": getKEYS().Get(getCREATURELOCKER()._creatures[this._upgrading].name),
                "v2": getKEYS().Get(MONSTERLAB._powerupProps[this._upgrading].name)
            }), getKEYS().Get("lab_confirmcancel_btn"), this.CancelMonsterPowerupB.bind(this));
        }
    }

    public CancelMonsterPowerupB(): void {
        getPOPUPS().Next();
        getBASE().Charge(3, MONSTERLAB.GetPuttyCost(this._upgrading, this._upgradeLevel) * -1);
        const _loc1_: string = this._upgrading;
        this._upgrading = null;
        this._upgradeLevel = 0;
        this._upgradeFinishTime = new SecNum(0);
        MONSTERLAB._mcPopup.Setup(_loc1_);
        getBASE().Save();
    }

    public InstantMonsterPowerup(param1: string, param2: number): void {
        let powerName: string = null;
        let popupMC: popup_monster = null;
        const id: string = param1;
        const level: number = param2;
        const instantCost: number = MONSTERLAB.GetShinyCost(id, level);
        
        if (getBASE()._credits.Get() < instantCost) {
            getPOPUPS().DisplayGetShiny();
            return;
        }
        getGLOBAL().player.m_upgrades[id].powerup = level;
        this._upgradeLevel = level;
        getLOGGER().Stat([48, id.substr(1), level]);
        
        if (getGLOBAL().mode == getGLOBAL().e_BASE_MODE.BUILD) {
            const Post = (): void => {
                if (this._upgradeLevel == 1) {
                    getGLOBAL().CallJS("sendFeed", ["lab-powerup", getKEYS().Get(MONSTERLAB._powerupProps[this._streamUpgradeCache].stream[0]), getKEYS().Get(MONSTERLAB._powerupProps[this._streamUpgradeCache].stream[1], { "v1": powerName }), MONSTERLAB._powerupProps[this._streamUpgradeCache].streampic, 0]);
                } else {
                    getGLOBAL().CallJS("sendFeed", ["lab-powerup", getKEYS().Get(MONSTERLAB._powerupProps[this._streamUpgradeCache].stream[0]), getKEYS().Get(MONSTERLAB._powerupProps[this._streamUpgradeCache].stream[2], { "v1": this._upgradeLevel }), MONSTERLAB._powerupProps[this._streamUpgradeCache].streampic, 0]);
                }
                getPOPUPS().Next();
            };
            powerName = getKEYS().Get(MONSTERLAB._powerupProps[id].name);
            popupMC = new popup_monster();
            popupMC.tText.htmlText = "<b>" + getKEYS().Get("lab_powerup_complete", {
                "v1": powerName,
                "v2": level
            }) + "</b>";
            popupMC.bAction.SetupKey("btn_warnyourfriends");
            popupMC.bAction.addEventListener(MouseEvent.CLICK, Post);
            popupMC.bAction.Highlight = true;
            popupMC.bSpeedup.visible = false;
            getPOPUPS().Push(popupMC, null, null, null, "" + id + "-LAB-150.png");
            this._streamUpgradeCache = id;
        }
        if (this._upgrading) {
            this._upgrading = null;
        }
        getBASE().Purchase("IPU", instantCost, "monsterlab");
    }

    override Setup(param1: any): void {
        super.Setup(param1);
        if (param1.upg) {
            this._upgrading = param1.upg;
        }
        if (param1.upt) {
            this._upgradeFinishTime = new SecNum(param1.upt);
        }
        if (param1.upl) {
            this._upgradeLevel = param1.upl;
        }
        if (this._countdownBuild.Get() <= 0) {
            getGLOBAL()._bLab = this;
        }
    }

    override Export(): any {
        const _loc1_: any = super.Export();
        if (this._upgrading) {
            _loc1_.upg = this._upgrading;
        }
        if (Boolean(this._upgradeFinishTime) && this._upgradeFinishTime.Get() > 0) {
            _loc1_.upt = this._upgradeFinishTime.Get();
        }
        if (this._upgradeLevel) {
            _loc1_.upl = this._upgradeLevel;
        }
        return _loc1_;
    }
}
