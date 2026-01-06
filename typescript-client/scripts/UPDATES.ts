import { MovieClip } from 'openfl/display/MovieClip';
import { Event } from 'openfl/events/Event';
import { IOErrorEvent } from 'openfl/events/IOErrorEvent';
import { MouseEvent } from 'openfl/events/MouseEvent';
import { Point } from 'openfl/geom/Point';
import { TextFieldAutoSize } from 'openfl/text/TextFieldAutoSize';
import { BYMConfig } from './com/monsters/configs/BYMConfig';
import { InventoryManager } from './com/monsters/inventory/InventoryManager';
import { InstanceManager } from './com/monsters/managers/InstanceManager';
import { ChampionBase } from './com/monsters/monsters/champions/ChampionBase';
import { Reward } from './com/monsters/rewarding/Reward';
import { RewardHandler } from './com/monsters/rewarding/RewardHandler';
import { popup_helped } from './popup_helped';
import { frame } from './frame';
import { BFOUNDATION } from './BFOUNDATION';
import { CHAMPIONCHAMBER } from './CHAMPIONCHAMBER';
import { CHAMPIONCAGE } from './CHAMPIONCAGE';
import { CREATURES } from './CREATURES';
import { GLOBAL } from './GLOBAL';
import { BASE } from './BASE';
import { GRID } from './GRID';
import { KEYS } from './KEYS';
import { LOGIN } from './LOGIN';
import { LOGGER } from './LOGGER';
import { MAP } from './MAP';
import { POPUPS } from './POPUPS';
import { TUTORIAL } from './TUTORIAL';
import { URLLoaderApi } from './URLLoaderApi';
import { JSON } from './JSON';

export class UPDATES {
    public static _updates: any[];
    public static _myUpdates: any[];
    public static _lastUpdateID: number;
    public static _catchupList: any[];
    public static _actions: any[];

    constructor() {
    }

    public static Setup(): void {
        UPDATES._updates = [];
        UPDATES._myUpdates = [];
        UPDATES._catchupList = [];
        UPDATES._actions = [];
        UPDATES._lastUpdateID = 0;
    }

    public static addAction(param1: Function, param2: string): void {
        UPDATES._actions[param2] = param1;
    }

    public static Process(param1: any[]): void {
        if (!GLOBAL._save) {
            return;
        }
        if (param1) {
            for (const _loc2_ of param1) {
                if (_loc2_.data) {
                    if (_loc2_.id > UPDATES._lastUpdateID) {
                        UPDATES._lastUpdateID = _loc2_.id;
                    }
                    const _loc3_ = JSON.decode(_loc2_.data);
                    for (const _loc4_ of _loc3_) {
                        UPDATES._updates.push({
                            "fbid": _loc2_.fbid,
                            "name": _loc2_.name,
                            "data": _loc4_
                        });
                    }
                }
            }
        }
    }

    public static Check(): void {
        if (!GLOBAL._save) {
            return;
        }
        const _loc1_ = GLOBAL.Timestamp();
        for (let _loc2_ = 0; _loc2_ < UPDATES._updates.length; _loc2_++) {
            const _loc3_ = UPDATES._updates[_loc2_].data;
            if (_loc3_[0] <= _loc1_) {
                if (UPDATES.Action(UPDATES._updates[_loc2_])) {
                    UPDATES._updates.splice(_loc2_, 1);
                    _loc2_--;
                }
            }
        }
        if (UPDATES._catchupList.length > 0 && !GLOBAL._catchup) {
            UPDATES.Catchup();
        }
    }

    public static Action(update: any): boolean {
        let building: BFOUNDATION = null;
        let time: number = 0;
        let length: number = 0;

        const freezeChamp = (): void => {
            if (CREATURES._guardian) {
                CREATURES._guardian.modifyHealth(CREATURES._guardian.maxHealth);
                CREATURES._guardian.export();
                CREATURES._guardian.changeModeFreeze();
                let _loc1_ = 0;
                for (let _loc2_ = 0; _loc2_ < BASE._guardianData.length; _loc2_++) {
                    if (BASE._guardianData[_loc2_].t == CREATURES._guardian._type) {
                        _loc1_ = _loc2_;
                    }
                }
                BASE._guardianData[_loc1_].ft -= GLOBAL.Timestamp();
                (GLOBAL._bChamber as CHAMPIONCHAMBER)._frozen.push(BASE._guardianData[_loc1_]);
                BASE._guardianData[_loc1_].status = ChampionBase.k_CHAMPION_STATUS_FROZEN;
                BASE._guardianData[_loc1_].log += "," + ChampionBase.k_CHAMPION_STATUS_FROZEN.toString();
                if (GLOBAL.mode == GLOBAL.e_BASE_MODE.BUILD) {
                    const _loc2_ = GLOBAL.getPlayerGuardianIndex(CREATURES._guardian._type);
                    if (_loc2_ != -1) {
                        GLOBAL._playerGuardianData[_loc2_].status = ChampionBase.k_CHAMPION_STATUS_FROZEN;
                        GLOBAL._playerGuardianData[_loc2_].log += "," + ChampionBase.k_CHAMPION_STATUS_FROZEN.toString();
                        GLOBAL._playerGuardianData[_loc2_].ft -= GLOBAL.Timestamp();
                    }
                }
                CREATURES._guardian = null;
            }
        };

        const thawChamp = (param1: number): void => {
            for (let _loc2_ = 0; _loc2_ < (GLOBAL._bChamber as CHAMPIONCHAMBER)._frozen.length; _loc2_++) {
                if ((GLOBAL._bChamber as CHAMPIONCHAMBER)._frozen[_loc2_].t == param1) {
                    const _loc3_ = new Point(GLOBAL._bChamber.x, GLOBAL._bChamber.y + 80);
                    const _loc4_ = (GLOBAL._bChamber as CHAMPIONCHAMBER)._frozen[_loc2_].l.Get();
                    const _loc5_ = GRID.FromISO(GLOBAL._bCage.x, GLOBAL._bCage.y + 20);
                    // Champion respawn logic
                    const _loc6_: any[] = [];
                    for (let _loc7_ = 0; _loc7_ < (GLOBAL._bChamber as CHAMPIONCHAMBER)._frozen.length; _loc7_++) {
                        if (_loc2_ != _loc7_) {
                            _loc6_.push((GLOBAL._bChamber as CHAMPIONCHAMBER)._frozen[_loc7_]);
                        }
                    }
                    (GLOBAL._bChamber as CHAMPIONCHAMBER)._frozen = _loc6_;
                    break;
                }
            }
        };

        if (!GLOBAL._save) {
            return false;
        }
        if (BASE.isInfernoMainYardOrOutpost) {
            return false;
        }
        if (update.data[1] == RewardHandler.k_UPDATE_ADD || update.data[1] == RewardHandler.k_UPDATE_REMOVE || update.data[1] === RewardHandler.k_UPDATE_VALUE) {
            RewardHandler.instance.processUpdate(update);
        }
        if (update.data[1] == "BU") {
            building = UPDATES.GetBuilding(update.data[2]);
            if (building) {
                building.UpgradeB();
            }
        }
        if (update.data[1] == "BUC") {
            building = UPDATES.GetBuilding(update.data[2]);
            if (building) {
                building.UpgradeCancelC();
            }
        }
        if (update.data[1] == "BF") {
            building = UPDATES.GetBuilding(update.data[2]);
            if (building) {
                building.FortifyB();
            }
        }
        if (update.data[1] == "BFC") {
            building = UPDATES.GetBuilding(update.data[2]);
            if (building) {
                building.FortifyCancelC();
            }
        }
        if (update.data[1] == "BMU") {
            length = update.data.length;
            if (GLOBAL.player.monsterList.length) {
                for (let i = 2; i < length; i++) {
                    const monsterdata = update.data[i];
                    if (GLOBAL.player.monsterListByID(monsterdata.creatureID) && GLOBAL.player.monsterListByID(monsterdata.creatureID).numCreeps > 0) {
                        GLOBAL.player.monsterListByID(monsterdata.creatureID).add(-monsterdata.count, null, true);
                    } else if (monsterdata.count < 0) {
                        GLOBAL.player.monsterListByID(monsterdata.creatureID).setNum(-monsterdata.count);
                    }
                }
            }
        }
        if (update.data[1] == "BH") {
            building = UPDATES.GetBuilding(update.data[2]);
            if (building) {
                building._helpList.push(update.data[3]);
            }
            if (building) {
                time = building.HelpB();
            }
            if (time > 0 && GLOBAL.mode == GLOBAL.e_BASE_MODE.BUILD) {
                UPDATES._catchupList.push([GLOBAL.e_BASE_MODE.BUILD, update.fbid, update.name, GLOBAL._buildingProps[building._type - 1].name, time]);
            }
        }
        if (update.data[1] == "BP") {
            if (GLOBAL.mode != GLOBAL.e_BASE_MODE.BUILD) {
                building = BASE.addBuildingC(update.data[2]);
                building.Setup(update.data[3]);
            }
        }
        if (update.data[1] == "DBU") {
            BASE._damagedBaseWarnTime = update.data[0];
        }
        if (update.data[1] == "BT") {
            building = UPDATES.GetBuilding(update.data[2]);
            if (building) building._threadid = update.data[3];
            if (building) building._subject = update.data[4];
            if (building) building._senderid = update.data[5];
            if (building) building._senderName = update.data[6];
            if (building) building._senderPic = update.data[7];
        }
        if (update.data[1] == "BE") {
            BASE._resources.r1.Add(-update.data[3]);
            BASE._hpResources.r1 -= update.data[3];
            BASE._resources.r2.Add(-update.data[4]);
            BASE._hpResources.r2 -= update.data[4];
            BASE._resources.r3.Add(-update.data[5]);
            BASE._hpResources.r3 -= update.data[5];
            BASE._resources.r4.Add(-update.data[6]);
            BASE._hpResources.r4 -= update.data[6];
            BASE._credits.Add(-update.data[7]);
            BASE._hpCredits -= update.data[7];
        }
        if (update.data[1] == "BS") {
            const numBuildings = update.data[3];
            for (let i = 0; i < numBuildings; i++) {
                InventoryManager.buildingStorageAdd(update.data[2]);
            }
        }
        if (update.data[1] == "CMR") {
            if (BASE.isInfernoMainYardOrOutpost) {
                LOGGER.Log("log", "ABORTING Champion Refund because user is in Inferno", true);
                return false;
            }
            const refundType = update.data[2];
            const refundLevel = update.data[3];
            const refundFeeds = update.data[4];
            const refundAbility = update.data.length > 5 ? update.data[5] : 0;
            const refundBuff = 0;
            const refundID = "G" + refundType;
            const refundName = CHAMPIONCAGE.GetGuardianProperty(refundID, refundLevel, "name");
            const refundHealth = CHAMPIONCAGE.GetGuardianProperty(refundID, refundLevel, "health");
            const refundFeedtime = GLOBAL.Timestamp();
            if (CREATURES._guardian && CREATURES._guardian.graphic.parent == MAP._BUILDINGTOPS && !BYMConfig.instance.RENDERER_ON) {
                MAP._BUILDINGTOPS.removeChild(CREATURES._guardian.graphic);
            }
            if (CREATURES._guardian && CREATURES._guardian._creatureID == refundID) {
                CREATURES._guardian.clear();
            } else if (GLOBAL._bChamber) {
                if (CREATURES._guardian && CREATURES._guardian._creatureID != refundID) {
                    freezeChamp();
                }
                if (CHAMPIONCHAMBER.HasFrozen(refundType)) {
                    thawChamp(refundType);
                }
            }
            if (CREATURES._guardian) {
                CREATURES._guardian.modifyHealth(-Number.MIN_VALUE);
                CREATURES._guardian.tick(1);
                CREATURES.removeGuardianType(CREATURES._guardian._type);
            }
            if (GLOBAL._bCage) {
                if (refundLevel > 0) {
                    GLOBAL._bCage.SpawnGuardian(refundLevel, refundFeeds, refundFeedtime, refundType, refundHealth, refundName, refundBuff, refundAbility);
                }
                BASE.Save();
            }
        }
        return true;
    }

    public static Catchup(): void {
        if (!GLOBAL._save) {
            return;
        }
        if (BASE.isInfernoMainYardOrOutpost) {
            return;
        }
        if (UPDATES._catchupList.length > 0) {
            const _loc3_: any[] = [];
            const _loc4_: any[] = [];
            const _loc8_ = new popup_helped();
            _loc8_.tB.autoSize = TextFieldAutoSize.LEFT;
            let _loc7_ = 0;
            for (let _loc1_ = 0; _loc1_ < UPDATES._catchupList.length; _loc1_++) {
                let _loc6_ = false;
                for (let _loc2_ = 0; _loc2_ < _loc3_.length; _loc2_++) {
                    if (_loc3_[_loc2_][1] == UPDATES._catchupList[_loc1_][2]) {
                        _loc6_ = true;
                    }
                }
                if (!_loc6_) {
                    _loc3_.push([UPDATES._catchupList[_loc1_][1], UPDATES._catchupList[_loc1_][2]]);
                }
                _loc6_ = false;
                for (let _loc2_ = 0; _loc2_ < _loc4_.length; _loc2_++) {
                    if (_loc4_[_loc2_][1] == UPDATES._catchupList[_loc1_][3]) {
                        _loc6_ = true;
                    }
                }
                if (!_loc6_) {
                    _loc4_.push([0, UPDATES._catchupList[_loc1_][3]]);
                }
                _loc7_ += UPDATES._catchupList[_loc1_][4];
            }
            let _loc9_ = KEYS.Get("pop_helped_1a");
            if (!GLOBAL._catchup) {
                if (_loc3_.length == 1) {
                    _loc9_ = " " + KEYS.Get("pop_helped_1b") + " ";
                }
                if (_loc3_.length > 1) {
                    _loc9_ = " " + KEYS.Get("pop_helped_1c") + " ";
                }
            }
            if (_loc3_.length == 1) {
                _loc8_.tA.htmlText = "<font size=\"14\"><b>" + KEYS.Get("pop_helped_title", { "v1": _loc3_[0][1] }) + "</b></font>";
                let _loc5_: string;
                if (_loc4_.length > 1) {
                    _loc5_ = _loc3_[0][1] + _loc9_ + KEYS.Get("pop_helped_2a", { "v1": GLOBAL.Array2StringB(_loc4_) });
                } else {
                    _loc5_ = _loc3_[0][1] + _loc9_ + KEYS.Get("pop_helped_2b", { "v1": GLOBAL.Array2StringB(_loc4_) });
                }
                _loc5_ += ", <b>" + KEYS.Get("pop_helped_3a", { "v1": GLOBAL.ToTime(_loc7_, false, false) }) + "</b>";
                _loc8_.tB.htmlText = _loc5_;
                _loc8_.bPost.Setup(KEYS.Get("pop_helped_saythanks_btn", { "v1": _loc3_[0][1] }));
                _loc8_.bPost.addEventListener(MouseEvent.CLICK, UPDATES.GiveThanks(_loc3_[0][0], KEYS.Get("pop_helped_streamtitle"), KEYS.Get("pop_helped_pl_streambody", { "v1": _loc3_[0][1] }), "quests/build.v2.png"));
                _loc8_.bPost.Highlight = true;
            } else {
                _loc8_.tA.htmlText = "<font size=\"14\"><b>" + KEYS.Get("pop_helped_title_pl") + "</b></font>";
                _loc8_.tB.htmlText = KEYS.Get("pop_helped_pl_1a", {
                    "v1": GLOBAL.Array2StringB(_loc3_),
                    "v2": _loc9_,
                    "v3": GLOBAL.Array2StringB(_loc4_),
                    "v4": GLOBAL.ToTime(_loc7_, false, false)
                });
                _loc8_.bPost.SetupKey("pop_saythanks_btn");
                _loc8_.bPost.addEventListener(MouseEvent.CLICK, UPDATES.GiveThanks(0, KEYS.Get("pop_helped_streamtitle"), KEYS.Get("pop_helped_pl_streambody", { "v1": GLOBAL.Array2StringB(_loc3_) }), "quests/build.v2.png"));
                _loc8_.bPost.Highlight = true;
            }
            _loc8_.bPost.y = _loc8_.tB.height - 15;
            _loc8_.mcFrame.height = _loc8_.bPost.y + 110;
            (_loc8_.mcFrame as frame).Setup();
            POPUPS.Push(_loc8_, null, null, "", "build.v2.png");
            UPDATES._catchupList = [];
        }
    }

    public static GiveThanks(fbid: number, messageA: string, messageB: string, image: string): Function {
        return (param1: MouseEvent): void => {
            GLOBAL.CallJS("sendFeed", ["thanks", messageA, messageB, image, fbid]);
            POPUPS.Next();
        };
    }

    public static Create(param1: any[], param2: number = 0): void {
        if (BASE.isInfernoMainYardOrOutpost) {
            return;
        }
        let _loc3_ = BASE._loadedBaseID;
        if (param2) {
            _loc3_ = param2;
        }
        UPDATES.CreateB(param1, _loc3_, UPDATES._lastUpdateID);
    }

    public static CreateB(update: any[], id: number, lastupdate: number): void {
        const handleLoadSuccessful = (param1: any): void => {
            if (param1.error == 0) {
                UPDATES.Process(param1.updates);
            } else {
                LOGGER.Log("err", "UPDATES.Create: " + JSON.encode(param1));
                GLOBAL.ErrorMessage("UPDATES.Create");
            }
        };
        const handleLoadError = (param1: IOErrorEvent): void => {
            LOGGER.Log("err", "UPDATES.Create HTTP");
        };
        if (!GLOBAL._save) {
            return;
        }
        if (BASE.isInfernoMainYardOrOutpost) {
            return;
        }
        if (!GLOBAL._openBase && TUTORIAL._stage < 200) {
            return;
        }
        if (GLOBAL.mode == GLOBAL.e_BASE_MODE.BUILD && GLOBAL._friendCount == 0) {
            return;
        }
        update.splice(0, 0, GLOBAL.Timestamp());
        let url = GLOBAL._baseURL;
        if (GLOBAL._baseURL2) {
            url = GLOBAL._baseURL2;
        }
        let isHelping = false;
        if (GLOBAL.mode == GLOBAL.e_BASE_MODE.HELP || GLOBAL.mode == GLOBAL.e_BASE_MODE.IHELP) {
            isHelping = true;
        }
        const loadVars = [["baseid", id], ["data", JSON.encode([update])], ["lastupdate", lastupdate], ["help", isHelping]];
        new URLLoaderApi().load(url + "saveupdate", loadVars, handleLoadSuccessful, handleLoadError);
    }

    public static GetBuilding(param1: number): BFOUNDATION {
        const _loc2_ = InstanceManager.getInstancesByClass(BFOUNDATION);
        for (const _loc3_ of _loc2_) {
            if ((_loc3_ as BFOUNDATION)._id == param1) {
                return _loc3_ as BFOUNDATION;
            }
        }
        return null;
    }
}
