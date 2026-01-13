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
import { CREATURELOCKER } from './CREATURELOCKER';
import { CREATURES } from './CREATURES';
import { GLOBAL } from './GLOBAL';
import { BASE } from './BASE';
import { KEYS } from './KEYS';
import { STORE } from './STORE';
import { POPUPS } from './POPUPS';
import { POPUPSETTINGS } from './POPUPSETTINGS';
import { QUESTS } from './QUESTS';
import { LOGGER } from './LOGGER';

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
        for (const _loc2_ in CREATURELOCKER._creatures) {
            _loc1_++;
        }
        this._maxPages = 4;
        this.List();

        let _loc3_ = false;
        if (CREATURELOCKER._unlocking != null) {
            _loc3_ = CREATURELOCKER._unlocking.substring(0, 2) == "IC";
        }
        if (CREATURELOCKER._unlocking != null) {
            CREATURELOCKER._page = CREATURELOCKER._creatures[CREATURELOCKER._unlocking].page;
            this.ShowB(CREATURELOCKER._unlocking);
        } else {
            const _loc4_ = CREATURELOCKER._popupCreatureID;
            const _loc5_ = CREATURELOCKER._page;
            CREATURELOCKER._page = CREATURELOCKER._creatures[CREATURELOCKER._popupCreatureID].page;
            this.ShowB(CREATURELOCKER._popupCreatureID);
        }
        this.title_txt.htmlText = KEYS.Get(GLOBAL._bLocker._buildingProps.name);
        this.prod_label_txt.htmlText = KEYS.Get("cloc_prodstats_label");
        this.speed_txt.htmlText = "<b>" + KEYS.Get("mon_att_speed") + "</b>";
        this.health_txt.htmlText = "<b>" + KEYS.Get("mon_att_health") + "</b>";
        this.damage_txt.htmlText = "<b>" + KEYS.Get("mon_att_damage") + "</b>";
        this.goo_txt.htmlText = "<b>" + KEYS.Get("moni_att_cost") + "</b>";
        this.housing_txt.htmlText = "<b>" + KEYS.Get("mon_att_housing") + "</b>";
        this.time_txt.htmlText = "<b>" + KEYS.Get("mon_att_time") + "</b>";
    }

    public PagePrevious(param1: MouseEvent): void {
        if (CREATURELOCKER._page > this._minPages) {
            --CREATURELOCKER._page;
        }
        this.List();
    }

    public PageNext(param1: MouseEvent): void {
        if (CREATURELOCKER._page < this._maxPages) {
            ++CREATURELOCKER._page;
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
        if (CREATURELOCKER._page > this._minPages) {
            this.enableButton(this.bPrevious);
        } else {
            this.disableButton(this.bPrevious);
        }
        if (CREATURELOCKER._page < this._maxPages) {
            this.enableButton(this.bNext);
        } else {
            this.disableButton(this.bNext);
        }
        this._tempCreatureList = [];
        for (const _loc1_ in CREATURELOCKER.GetAppropriateCreatures()) {
            const _loc4_ = CREATURELOCKER._creatures[_loc1_];
            if (!_loc4_.blocked && _loc4_.page == CREATURELOCKER._page) {
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
            const _loc5_ = CREATURELOCKER._lockerData[_loc1_];
            const _loc6_ = this._mcList.addChild(new CreatureLockerItem()) as CreatureLockerItem;
            _loc6_.y = _loc2_;
            _loc2_ += 40;
            let _loc7_ = "<b>" + KEYS.Get(_loc4_.name) + "</b>";
            if (_loc5_) {
                if (_loc5_.t == 1) {
                    _loc7_ += "<br>" + GLOBAL.ToTime(_loc5_.e - GLOBAL.Timestamp());
                } else {
                    _loc7_ += "<br><font color=\"#333333\">" + KEYS.Get("mon_unlocked") + "</font>";
                }
            } else {
                _loc7_ += "<br><font color=\"#CC0000\">" + KEYS.Get("mon_locked") + "</font>";
            }
            _loc6_.tLabel.htmlText = _loc7_;
            _loc6_.addEventListener(MouseEvent.MOUSE_DOWN, this.Show(_loc1_) as (arg0: unknown) => void);
            _loc6_.buttonMode = true;
            _loc6_.mouseChildren = false;
            _loc6_.mouseEnabled = true;
            if (CREATURELOCKER._unlocking == _loc1_) {
                _loc6_.gotoAndStop(2);
            } else {
                _loc6_.gotoAndStop(1);
            }
            _loc6_.mcTick.visible = false;
            if (_loc5_) {
                if (_loc5_.t == 1) {
                    _loc6_.mcBar.width = 156 / (_loc5_.e - _loc5_.s) * (GLOBAL.Timestamp() - _loc5_.s);
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
            creatureID = CREATURELOCKER.getFirstCreatureID();
        }
        CREATURELOCKER._popupCreatureID = this._creatureID;
        this.List();
        const data = CREATURELOCKER._creatures[this._creatureID];
        this.tDescription.htmlText = "<b>" + KEYS.Get(data.name) + "</b><br>" + KEYS.Get(data.description);

        let str = "";
        if (CREATURELOCKER._unlocking != null) {
            str = KEYS.Get("mon_infounlocking");
        } else if (CREATURELOCKER._lockerData[this._creatureID] && CREATURELOCKER._lockerData[this._creatureID].t == 2) {
            str = KEYS.Get(BASE.isInfernoMainYardOrOutpost ? "inf_mon_infounlocked" : "mon_infounlocked");
        } else {
            str = KEYS.Get("mon_infotounlock", { "v1": GLOBAL.ToTime(data.time) });
            if (BASE._resources.r3.Get() < data.resource) {
                str += "<font color=\"#CC0000\">";
            }
            str += "<b>" + KEYS.Get(GLOBAL._resourceNames[2]) + "</b>: " + GLOBAL.FormatNumber(data.resource) + "<br>";
            if (BASE._resources.r3.Get() < data.resource) {
                str += "</font>";
            }
            if (GLOBAL._bLocker._lvl.Get() < data.level) {
                str += "<font color=\"#CC0000\">";
            }
            str += KEYS.Get(BASE.isInfernoMainYardOrOutpost ? "mon_strongboxlevelrequired" : "mon_infolockerlevelrequired", { "v1": data.level });
            if (GLOBAL._bLocker._lvl.Get() < data.level) {
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
        for (const c in CREATURELOCKER.GetAppropriateCreatures()) {
            if (CREATURES.GetProperty(c, "speed") > maxSpeed) {
                maxSpeed = CREATURES.GetProperty(c, "speed");
            }
            if (CREATURES.GetProperty(c, "health") > maxHealth) {
                maxHealth = CREATURES.GetProperty(c, "health");
            }
            if (CREATURES.GetProperty(c, "damage") > maxDamage) {
                maxDamage = CREATURES.GetProperty(c, "damage");
            }
            if (CREATURES.GetProperty(c, "cTime") > maxTime) {
                maxTime = CREATURES.GetProperty(c, "cTime");
            }
            if (CREATURES.GetProperty(c, "cResource") > maxResource) {
                maxResource = CREATURES.GetProperty(c, "cResource");
            }
            if (CREATURES.GetProperty(c, "cStorage") > maxStorage) {
                maxStorage = CREATURES.GetProperty(c, "cStorage");
            }
        }
        TweenLite.to(this.bSpeed.mcBar, 0.4, {
            "width": 100 / maxSpeed * CREATURES.GetProperty(this._creatureID, "speed"),
            "ease": Circ.easeInOut,
            "delay": 0
        });
        TweenLite.to(this.bHealth.mcBar, 0.4, {
            "width": 100 / maxHealth * CREATURES.GetProperty(this._creatureID, "health"),
            "ease": Circ.easeInOut,
            "delay": 0.05
        });
        TweenLite.to(this.bDamage.mcBar, 0.4, {
            "width": 100 / maxDamage * CREATURES.GetProperty(this._creatureID, "damage"),
            "ease": Circ.easeInOut,
            "delay": 0.1
        });
        TweenLite.to(this.bResource.mcBar, 0.4, {
            "width": 100 / maxResource * CREATURES.GetProperty(this._creatureID, "cResource"),
            "ease": Circ.easeInOut,
            "delay": 0.15
        });
        TweenLite.to(this.bStorage.mcBar, 0.4, {
            "width": 100 / maxStorage * CREATURES.GetProperty(this._creatureID, "cStorage"),
            "ease": Circ.easeInOut,
            "delay": 0.2
        });
        TweenLite.to(this.bTime.mcBar, 0.4, {
            "width": 100 / maxTime * CREATURES.GetProperty(this._creatureID, "cTime"),
            "ease": Circ.easeInOut,
            "delay": 0.25
        });
        this.tSpeed.htmlText = KEYS.Get("mon_statsspeed", { "v1": CREATURES.GetProperty(this._creatureID, "speed") });
        this.tHealth.htmlText = CREATURES.GetProperty(this._creatureID, "health").toString();
        const dam = CREATURES.GetProperty(this._creatureID, "damage");
        if (dam > 0) {
            this.tDamage.htmlText = dam.toString();
        } else {
            this.tDamage.htmlText = -dam + " (" + KEYS.Get("str_heal") + ")";
        }
        this.tResource.htmlText = CREATURES.GetProperty(this._creatureID, "cResource") + " " + KEYS.Get(GLOBAL._resourceNames[3]);
        this.tStorage.htmlText = KEYS.Get("mon_statsstorage", { "v1": CREATURES.GetProperty(this._creatureID, "cStorage") });
        this.tTime.htmlText = GLOBAL.ToTime(CREATURES.GetProperty(this._creatureID, "cTime"), true);

        if (CREATURELOCKER._lockerData[this._creatureID]) {
            if (CREATURELOCKER._lockerData[this._creatureID].t == 2) {
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
            const putty = CREATURELOCKER._creatures[this._creatureID].resource;
            const time = CREATURELOCKER._creatures[this._creatureID].time;
            const timeCost = STORE.GetTimeCost(time);
            const resourcesCost = Math.ceil(Math.pow(Math.sqrt(putty / 2), 0.75));
            this._instantUnlockCost = timeCost + resourcesCost;
            this.bInstant.Setup(KEYS.Get("btn_unlockinstantly", { "v1": this._instantUnlockCost }));
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
        if (CREATURELOCKER.Start(this._creatureID)) {
            this.Update();
        }
    }

    public Stop(param1: MouseEvent): void {
        GLOBAL.Message(KEYS.Get("mon_confirmcancel", { "v1": KEYS.Get(CREATURELOCKER._creatures[CREATURELOCKER._unlocking].name) }), KEYS.Get("btn_yes"), CREATURELOCKER.Cancel);
    }

    public Speedup(param1: MouseEvent): void {
        STORE.SpeedUp("SP4");
    }

    public Update(): void {
        this.ShowB(this._creatureID);
        this.Tick();
    }

    public Tick(): void {
        this.List();
    }

    public InstantUnlock(e: MouseEvent): void {
        if (BASE._credits.Get() < this._instantUnlockCost) {
            POPUPS.DisplayGetShiny();
            return;
        }
        if (GLOBAL._bLocker._lvl.Get() < CREATURELOCKER._creatures[this._creatureID].level) {
            GLOBAL.Message(KEYS.Get("mon_upgradelocker", {
                "v1": KEYS.Get(GLOBAL._bLocker._buildingProps.name),
                "v2": CREATURELOCKER._creatures[this._creatureID].level
            }));
            return;
        }
        if (CREATURELOCKER._unlocking && CREATURELOCKER._lockerData[CREATURELOCKER._unlocking] && CREATURELOCKER._lockerData[CREATURELOCKER._unlocking] == this._creatureID) {
            delete CREATURELOCKER._lockerData[CREATURELOCKER._unlocking].s;
            delete CREATURELOCKER._lockerData[CREATURELOCKER._unlocking].e;
        }
        const creature = CREATURELOCKER._creatures[this._creatureID];
        let img: string;
        if (!BASE.isInfernoMainYardOrOutpost) {
            img = "quests/monster" + this._creatureID.substr(1) + ".v2.png";
        } else {
            img = "quests/monsterinferno" + this._creatureID.substr(2) + ".png";
        }
        if (creature.stream.length > 1) {
            img = String(creature.stream[2]);
        }
        CREATURELOCKER._lockerData[this._creatureID] = { "t": 2 };
        GLOBAL.player.m_upgrades[this._creatureID] = { "level": 1 };
        if (!BASE.isInfernoMainYardOrOutpost) {
            LOGGER.Stat([46, parseInt(this._creatureID.substr(1))]);
        } else {
            LOGGER.Stat([46, parseInt(this._creatureID.substr(2))]);
        }
        if (GLOBAL.mode == GLOBAL.e_BASE_MODE.BUILD) {
            const StreamPost = (st: string, sd: string, im: string): Function => {
                return (param1: MouseEvent = null): void => {
                    GLOBAL.CallJS("sendFeed", ["unlock-end", st, sd, im, 0]);
                    POPUPS.Next();
                };
            };
            const mc = new popup_monster();
            mc.bSpeedup.SetupKey("btn_warnyourfriends");
            if (!creature.stream[0]) {
                mc.bSpeedup.visible = false;
            }
            let _body = "";
            if (creature.stream[1]) {
                _body = KEYS.Get(creature.stream[1]);
            }
            mc.bSpeedup.addEventListener(MouseEvent.CLICK, StreamPost(KEYS.Get(creature.stream[0]), _body, img) as (arg0: unknown) => void);
            mc.bSpeedup.Highlight = true;
            mc.bAction.visible = false;
            if (CREATURELOCKER._creatures) {
                const hatcheryName = GLOBAL._bHatchery ? String(GLOBAL._bHatchery._buildingProps.name) : String(GLOBAL._buildingProps[12].name);
                mc.tText.htmlText = KEYS.Get("pop_unlock_complete", {
                    "v1": KEYS.Get(CREATURELOCKER._creatures[this._creatureID].name),
                    "v2": KEYS.Get(hatcheryName)
                });
            }
            const image = this._creatureID + "-150.png";
            POPUPS.Push(mc, null, null, null, image);
        }
        CREATURELOCKER._unlocking = null;
        QUESTS.Check();
        BASE.Purchase("IUN", this._instantUnlockCost, "creaturelocker");
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
            this.txtGuide.htmlText = KEYS.Get("loc_tut_" + (this._guidePage - 1));
            if (this._guidePage == 2) {
                this.bContinue.addEventListener(MouseEvent.CLICK, this.Help.bind(this));
                this.bContinue.SetupKey("btn_continue");
            }
        }
    }

    public Hide(param1: MouseEvent = null): void {
        CREATURELOCKER.Hide(param1);
    }

    public Center(): void {
        POPUPSETTINGS.AlignToCenter(this);
    }

    public ScaleUp(): void {
        POPUPSETTINGS.ScaleUp(this);
    }
}
