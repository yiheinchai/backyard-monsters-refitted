import Bitmap from 'openfl/display/Bitmap';
import BitmapData from 'openfl/display/BitmapData';
import DisplayObject from 'openfl/display/DisplayObject';
import MovieClip from 'openfl/display/MovieClip';
import MouseEvent from 'openfl/events/MouseEvent';
import { TweenLite } from 'gs/TweenLite';
import { Circ } from 'gs/easing/Circ';
import { ImageCache } from './com/monsters/display/ImageCache';
import { CREATURELOCKERPOPUP_CLIP } from './CREATURELOCKERPOPUP_CLIP';
import { CreatureLockerItem } from './CreatureLockerItem';
import { popup_monster } from './popup_monster';
import { POPUPSETTINGS } from './POPUPSETTINGS';

// Lazy imports to break circular dependency chains
function getCREATURELOCKER(): any { return require("./CREATURELOCKER").CREATURELOCKER; }
function getCREATURES(): any { return require("./CREATURES").CREATURES; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getBASE(): any { return require("./BASE").BASE; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getSTORE(): any { return require("./STORE").STORE; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }
function getQUESTS(): any { return require("./QUESTS").QUESTS; }
function getLOGGER(): any { return require("./LOGGER").LOGGER; }


export class CREATURELOCKERPOPUP extends CREATURELOCKERPOPUP_CLIP {
    private static readonly _CREATURES_PER_PAGE: number = 4;

    private _minPages: number = 1;
    private _maxPages: number = 4;
    public _mcList: MovieClip;
    public _tempCreatureList: any[];
    public _creatureID: string;
    public _portraitImage: DisplayObject;
    public _instantUnlockCost: number;
    private _guidePage: number = 1;

    constructor() {
        super();
        this.bPrevious.SetupKey("btn_previous");
        this.bPrevious.addEventListener(MouseEvent.CLICK, this.PagePrevious.bind(this));
        this.bNext.SetupKey("btn_next");
        this.bNext.addEventListener(MouseEvent.CLICK, this.PageNext.bind(this));
        this.bInstant.addEventListener(MouseEvent.CLICK, this.InstantUnlock.bind(this));

        let _loc1_ = 0;
        for (const _loc2_ in getCREATURELOCKER()._creatures) {
            _loc1_++;
        }
        this._maxPages = 4;
        this.List();

        let _loc3_ = false;
        if (getCREATURELOCKER()._unlocking != null) {
            _loc3_ = getCREATURELOCKER()._unlocking.substring(0, 2) == "IC";
        }
        if (getCREATURELOCKER()._unlocking != null) {
            getCREATURELOCKER()._page = getCREATURELOCKER()._creatures[getCREATURELOCKER()._unlocking].page;
            this.ShowB(getCREATURELOCKER()._unlocking);
        } else {
            const _loc4_ = getCREATURELOCKER()._popupCreatureID;
            const _loc5_ = getCREATURELOCKER()._page;
            getCREATURELOCKER()._page = getCREATURELOCKER()._creatures[getCREATURELOCKER()._popupCreatureID].page;
            this.ShowB(getCREATURELOCKER()._popupCreatureID);
        }
        this.title_txt.htmlText = getKEYS().Get(getGLOBAL()._bLocker._buildingProps.name);
        this.prod_label_txt.htmlText = getKEYS().Get("cloc_prodstats_label");
        this.speed_txt.htmlText = "<b>" + getKEYS().Get("mon_att_speed") + "</b>";
        this.health_txt.htmlText = "<b>" + getKEYS().Get("mon_att_health") + "</b>";
        this.damage_txt.htmlText = "<b>" + getKEYS().Get("mon_att_damage") + "</b>";
        this.goo_txt.htmlText = "<b>" + getKEYS().Get("moni_att_cost") + "</b>";
        this.housing_txt.htmlText = "<b>" + getKEYS().Get("mon_att_housing") + "</b>";
        this.time_txt.htmlText = "<b>" + getKEYS().Get("mon_att_time") + "</b>";
    }

    public PagePrevious(param1: MouseEvent): void {
        if (getCREATURELOCKER()._page > this._minPages) {
            --getCREATURELOCKER()._page;
        }
        this.List();
    }

    public PageNext(param1: MouseEvent): void {
        if (getCREATURELOCKER()._page < this._maxPages) {
            ++getCREATURELOCKER()._page;
        }
        this.List();
    }

    private disableButton(param1: MovieClip): void {
        (param1 as any).Enabled = false;
        (param1 as any).Highlight = false;
    }

    private enableButton(param1: MovieClip): void {
        (param1 as any).Enabled = true;
    }

    public List(): void {
        if (getCREATURELOCKER()._page > this._minPages) {
            this.enableButton(this.bPrevious);
        } else {
            this.disableButton(this.bPrevious);
        }
        if (getCREATURELOCKER()._page < this._maxPages) {
            this.enableButton(this.bNext);
        } else {
            this.disableButton(this.bNext);
        }
        this._tempCreatureList = [];
        for (const _loc1_ in getCREATURELOCKER().GetAppropriateCreatures()) {
            const _loc4_ = getCREATURELOCKER()._creatures[_loc1_];
            if (!_loc4_.blocked && _loc4_.page == getCREATURELOCKER()._page) {
                _loc4_.id = _loc1_;
                this._tempCreatureList.push(_loc4_);
            }
        }
        this._tempCreatureList.sort((a: any, b: any) => a.order - b.order);
        if (this._mcList) {
            this.mcList.removeChild(this._mcList);
        }
        this._mcList = this.mcList.addChild(new MovieClip()) as MovieClip;
        this._mcList.x = 10;
        this._mcList.y = 10;
        let _loc2_ = 0;
        for (let _loc3_ = 0; _loc3_ < this._tempCreatureList.length; _loc3_++) {
            const _loc4_ = this._tempCreatureList[_loc3_];
            const _loc1_ = String(_loc4_.id);
            const _loc5_ = getCREATURELOCKER()._lockerData[_loc1_];
            const _loc6_ = this._mcList.addChild(new CreatureLockerItem()) as CreatureLockerItem;
            _loc6_.y = _loc2_;
            _loc2_ += 40;
            let _loc7_ = "<b>" + getKEYS().Get(_loc4_.name) + "</b>";
            if (_loc5_) {
                if (_loc5_.t == 1) {
                    _loc7_ += "<br>" + getGLOBAL().ToTime(_loc5_.e - getGLOBAL().Timestamp());
                } else {
                    _loc7_ += "<br><font color=\"#333333\">" + getKEYS().Get("mon_unlocked") + "</font>";
                }
            } else {
                _loc7_ += "<br><font color=\"#CC0000\">" + getKEYS().Get("mon_locked") + "</font>";
            }
            _loc6_.tLabel.htmlText = _loc7_;
            _loc6_.addEventListener(MouseEvent.MOUSE_DOWN, this.Show(_loc1_) as (arg0: unknown) => void);
            _loc6_.buttonMode = true;
            _loc6_.mouseChildren = false;
            _loc6_.mouseEnabled = true;
            if (getCREATURELOCKER()._unlocking == _loc1_) {
                _loc6_.gotoAndStop(2);
            } else {
                _loc6_.gotoAndStop(1);
            }
            _loc6_.mcTick.visible = false;
            if (_loc5_) {
                if (_loc5_.t == 1) {
                    _loc6_.mcBar.width = 156 / (_loc5_.e - _loc5_.s) * (getGLOBAL().Timestamp() - _loc5_.s);
                } else if (_loc5_.t == 2) {
                    _loc6_.mcTick.visible = true;
                    _loc6_.mcBar.visible = false;
                }
            } else {
                _loc6_.mcBar.width = 0;
            }
        }
    }

    public Show(creatureID: string): Function {
        return (param1: MouseEvent = null): void => {
            this.ShowB(creatureID);
        };
    }

    public ShowB(creatureID: string): void {
        const UpdatePortrait = (param1: string, param2: BitmapData): void => {
            this._portraitImage = this.mcImage.addChild(new Bitmap(param2));
        };

        this._creatureID = creatureID;
        if (!creatureID) {
            creatureID = getCREATURELOCKER().getFirstCreatureID();
        }
        getCREATURELOCKER()._popupCreatureID = this._creatureID;
        this.List();
        const data = getCREATURELOCKER()._creatures[this._creatureID];
        this.tDescription.htmlText = "<b>" + getKEYS().Get(data.name) + "</b><br>" + getKEYS().Get(data.description);

        let str = "";
        if (getCREATURELOCKER()._unlocking != null) {
            str = getKEYS().Get("mon_infounlocking");
        } else if (getCREATURELOCKER()._lockerData[this._creatureID] && getCREATURELOCKER()._lockerData[this._creatureID].t == 2) {
            str = getKEYS().Get(getBASE().isInfernoMainYardOrOutpost ? "inf_mon_infounlocked" : "mon_infounlocked");
        } else {
            str = getKEYS().Get("mon_infotounlock", { "v1": getGLOBAL().ToTime(data.time) });
            if (getBASE()._resources.r3.Get() < data.resource) {
                str += "<font color=\"#CC0000\">";
            }
            str += "<b>" + getKEYS().Get(getGLOBAL()._resourceNames[2]) + "</b>: " + getGLOBAL().FormatNumber(data.resource) + "<br>";
            if (getBASE()._resources.r3.Get() < data.resource) {
                str += "</font>";
            }
            if (getGLOBAL()._bLocker._lvl.Get() < data.level) {
                str += "<font color=\"#CC0000\">";
            }
            str += getKEYS().Get(getBASE().isInfernoMainYardOrOutpost ? "mon_strongboxlevelrequired" : "mon_infolockerlevelrequired", { "v1": data.level });
            if (getGLOBAL()._bLocker._lvl.Get() < data.level) {
                str += "</font>";
            }
        }
        this.tCosts.htmlText = str;

        let maxSpeed = 0;
        let maxHealth = 0;
        let maxDamage = 0;
        let maxTime = 0;
        let maxResource = 0;
        let maxStorage = 0;
        for (const c in getCREATURELOCKER().GetAppropriateCreatures()) {
            if (getCREATURES().GetProperty(c, "speed") > maxSpeed) {
                maxSpeed = getCREATURES().GetProperty(c, "speed");
            }
            if (getCREATURES().GetProperty(c, "health") > maxHealth) {
                maxHealth = getCREATURES().GetProperty(c, "health");
            }
            if (getCREATURES().GetProperty(c, "damage") > maxDamage) {
                maxDamage = getCREATURES().GetProperty(c, "damage");
            }
            if (getCREATURES().GetProperty(c, "cTime") > maxTime) {
                maxTime = getCREATURES().GetProperty(c, "cTime");
            }
            if (getCREATURES().GetProperty(c, "cResource") > maxResource) {
                maxResource = getCREATURES().GetProperty(c, "cResource");
            }
            if (getCREATURES().GetProperty(c, "cStorage") > maxStorage) {
                maxStorage = getCREATURES().GetProperty(c, "cStorage");
            }
        }
        TweenLite.to(this.bSpeed.mcBar, 0.4, {
            "width": 100 / maxSpeed * getCREATURES().GetProperty(this._creatureID, "speed"),
            "ease": Circ.easeInOut,
            "delay": 0
        });
        TweenLite.to(this.bHealth.mcBar, 0.4, {
            "width": 100 / maxHealth * getCREATURES().GetProperty(this._creatureID, "health"),
            "ease": Circ.easeInOut,
            "delay": 0.05
        });
        TweenLite.to(this.bDamage.mcBar, 0.4, {
            "width": 100 / maxDamage * getCREATURES().GetProperty(this._creatureID, "damage"),
            "ease": Circ.easeInOut,
            "delay": 0.1
        });
        TweenLite.to(this.bResource.mcBar, 0.4, {
            "width": 100 / maxResource * getCREATURES().GetProperty(this._creatureID, "cResource"),
            "ease": Circ.easeInOut,
            "delay": 0.15
        });
        TweenLite.to(this.bStorage.mcBar, 0.4, {
            "width": 100 / maxStorage * getCREATURES().GetProperty(this._creatureID, "cStorage"),
            "ease": Circ.easeInOut,
            "delay": 0.2
        });
        TweenLite.to(this.bTime.mcBar, 0.4, {
            "width": 100 / maxTime * getCREATURES().GetProperty(this._creatureID, "cTime"),
            "ease": Circ.easeInOut,
            "delay": 0.25
        });
        this.tSpeed.htmlText = getKEYS().Get("mon_statsspeed", { "v1": getCREATURES().GetProperty(this._creatureID, "speed") });
        this.tHealth.htmlText = getCREATURES().GetProperty(this._creatureID, "health").toString();
        const dam = getCREATURES().GetProperty(this._creatureID, "damage");
        if (dam > 0) {
            this.tDamage.htmlText = dam.toString();
        } else {
            this.tDamage.htmlText = -dam + " (" + getKEYS().Get("str_heal") + ")";
        }
        this.tResource.htmlText = getCREATURES().GetProperty(this._creatureID, "cResource") + " " + getKEYS().Get(getGLOBAL()._resourceNames[3]);
        this.tStorage.htmlText = getKEYS().Get("mon_statsstorage", { "v1": getCREATURES().GetProperty(this._creatureID, "cStorage") });
        this.tTime.htmlText = getGLOBAL().ToTime(getCREATURES().GetProperty(this._creatureID, "cTime"), true);

        if (getCREATURELOCKER()._lockerData[this._creatureID]) {
            if (getCREATURELOCKER()._lockerData[this._creatureID].t == 2) {
                this.mcButtons.gotoAndStop(1);
                (this.mcButtons as any).bStart.SetupKey("mon_unlocked");
                (this.mcButtons as any).bStart.Enabled = false;
                (this.mcButtons as any).bStart.Highlight = false;
                this.bInstant.visible = false;
            } else {
                this.mcButtons.gotoAndStop(2);
                (this.mcButtons as any).bStop.SetupKey("btn_cancel");
                (this.mcButtons as any).bStop.addEventListener(MouseEvent.CLICK, this.Stop.bind(this));
                (this.mcButtons as any).bSpeedup.SetupKey("btn_speedup");
                (this.mcButtons as any).bSpeedup.addEventListener(MouseEvent.CLICK, this.Speedup.bind(this));
                (this.mcButtons as any).bSpeedup.Highlight = true;
                this.bInstant.visible = false;
            }
        } else {
            this.mcButtons.gotoAndStop(1);
            (this.mcButtons as any).bStart.SetupKey("btn_startunlocking");
            (this.mcButtons as any).bStart.Enabled = true;
            (this.mcButtons as any).bStart.Highlight = true;
            (this.mcButtons as any).bStart.addEventListener(MouseEvent.CLICK, this.Start.bind(this));
            const putty = getCREATURELOCKER()._creatures[this._creatureID].resource;
            const time = getCREATURELOCKER()._creatures[this._creatureID].time;
            const timeCost = getSTORE().GetTimeCost(time);
            const resourcesCost = Math.ceil(Math.pow(Math.sqrt(putty / 2), 0.75));
            this._instantUnlockCost = timeCost + resourcesCost;
            this.bInstant.Setup(getKEYS().Get("btn_unlockinstantly", { "v1": this._instantUnlockCost }));
            this.bInstant.visible = true;
            this.bInstant.Enabled = true;
            this.bInstant.Highlight = true;
        }
        if (this._portraitImage && this._portraitImage.parent) {
            this._portraitImage.parent.removeChild(this._portraitImage);
        }
        ImageCache.GetImageWithCallBack("monsters/" + this._creatureID + "-portrait.jpg", UpdatePortrait, true, 1);
    }

    public Start(param1: MouseEvent): void {
        if (getCREATURELOCKER().Start(this._creatureID)) {
            this.Update();
        }
    }

    public Stop(param1: MouseEvent): void {
        getGLOBAL().Message(getKEYS().Get("mon_confirmcancel", { "v1": getKEYS().Get(getCREATURELOCKER()._creatures[getCREATURELOCKER()._unlocking].name) }), getKEYS().Get("btn_yes"), getCREATURELOCKER().Cancel);
    }

    public Speedup(param1: MouseEvent): void {
        getSTORE().SpeedUp("SP4");
    }

    public Update(): void {
        this.ShowB(this._creatureID);
        this.Tick();
    }

    public Tick(): void {
        this.List();
    }

    public InstantUnlock(e: MouseEvent): void {
        if (getBASE()._credits.Get() < this._instantUnlockCost) {
            getPOPUPS().DisplayGetShiny();
            return;
        }
        if (getGLOBAL()._bLocker._lvl.Get() < getCREATURELOCKER()._creatures[this._creatureID].level) {
            getGLOBAL().Message(getKEYS().Get("mon_upgradelocker", {
                "v1": getKEYS().Get(getGLOBAL()._bLocker._buildingProps.name),
                "v2": getCREATURELOCKER()._creatures[this._creatureID].level
            }));
            return;
        }
        if (getCREATURELOCKER()._unlocking && getCREATURELOCKER()._lockerData[getCREATURELOCKER()._unlocking] && getCREATURELOCKER()._lockerData[getCREATURELOCKER()._unlocking] == this._creatureID) {
            delete getCREATURELOCKER()._lockerData[getCREATURELOCKER()._unlocking].s;
            delete getCREATURELOCKER()._lockerData[getCREATURELOCKER()._unlocking].e;
        }
        const creature = getCREATURELOCKER()._creatures[this._creatureID];
        let img: string;
        if (!getBASE().isInfernoMainYardOrOutpost) {
            img = "quests/monster" + this._creatureID.substr(1) + ".v2.png";
        } else {
            img = "quests/monsterinferno" + this._creatureID.substr(2) + ".png";
        }
        if (creature.stream.length > 1) {
            img = String(creature.stream[2]);
        }
        getCREATURELOCKER()._lockerData[this._creatureID] = { "t": 2 };
        getGLOBAL().player.m_upgrades[this._creatureID] = { "level": 1 };
        if (!getBASE().isInfernoMainYardOrOutpost) {
            getLOGGER().Stat([46, parseInt(this._creatureID.substr(1))]);
        } else {
            getLOGGER().Stat([46, parseInt(this._creatureID.substr(2))]);
        }
        if (getGLOBAL().mode == getGLOBAL().e_BASE_MODE.BUILD) {
            const StreamPost = (st: string, sd: string, im: string): Function => {
                return (param1: MouseEvent = null): void => {
                    getGLOBAL().CallJS("sendFeed", ["unlock-end", st, sd, im, 0]);
                    getPOPUPS().Next();
                };
            };
            const mc = new popup_monster();
            mc.bSpeedup.SetupKey("btn_warnyourfriends");
            if (!creature.stream[0]) {
                mc.bSpeedup.visible = false;
            }
            let _body = "";
            if (creature.stream[1]) {
                _body = getKEYS().Get(creature.stream[1]);
            }
            mc.bSpeedup.addEventListener(MouseEvent.CLICK, StreamPost(getKEYS().Get(creature.stream[0]), _body, img) as (arg0: unknown) => void);
            mc.bSpeedup.Highlight = true;
            mc.bAction.visible = false;
            if (getCREATURELOCKER()._creatures) {
                const hatcheryName = getGLOBAL()._bHatchery ? String(getGLOBAL()._bHatchery._buildingProps.name) : String(getGLOBAL()._buildingProps[12].name);
                mc.tText.htmlText = getKEYS().Get("pop_unlock_complete", {
                    "v1": getKEYS().Get(getCREATURELOCKER()._creatures[this._creatureID].name),
                    "v2": getKEYS().Get(hatcheryName)
                });
            }
            const image = this._creatureID + "-150.png";
            getPOPUPS().Push(mc, null, null, null, image);
        }
        getCREATURELOCKER()._unlocking = null;
        getQUESTS().Check();
        getBASE().Purchase("IUN", this._instantUnlockCost, "creaturelocker");
        this.Update();
    }

    public Help(param1: MouseEvent = null): void {
        const _loc2_ = 2;
        this._guidePage += 1;
        if (this._guidePage > _loc2_) {
            this._guidePage = 1;
        }
        this.gotoAndStop(this._guidePage);
        if (this._guidePage > 1) {
            this.txtGuide.htmlText = getKEYS().Get("loc_tut_" + (this._guidePage - 1));
            if (this._guidePage == 2) {
                this.bContinue.addEventListener(MouseEvent.CLICK, this.Help.bind(this));
                this.bContinue.SetupKey("btn_continue");
            }
        }
    }

    public Hide(param1: MouseEvent = null): void {
        getCREATURELOCKER().Hide(param1);
    }

    public Center(): void {
        POPUPSETTINGS.AlignToCenter(this);
    }

    public ScaleUp(): void {
        POPUPSETTINGS.ScaleUp(this);
    }
}
