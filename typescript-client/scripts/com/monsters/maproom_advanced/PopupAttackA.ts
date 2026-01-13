import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import Loader from "openfl/display/Loader";
import MovieClip from "openfl/display/MovieClip";
import Event from "openfl/events/Event";
import IOErrorEvent from "openfl/events/IOErrorEvent";
import MouseEvent from "openfl/events/MouseEvent";
import URLRequest from "openfl/net/URLRequest";

import { SecNum } from "../../cc/utils/SecNum";
import { ALLIANCES } from "../alliances/ALLIANCES";
import { AllyInfo } from "../alliances/AllyInfo";
import { ImageCache } from "../display/ImageCache";
import { ScrollSet } from "../display/ScrollSet";
import { ResourceBombs } from "../effects/ResourceBombs";
import { EnumYardType } from "../enums/EnumYardType";
import { MapRoomManager } from "../maproom_manager/MapRoomManager";
import { ChampionBase } from "../monsters/champions/ChampionBase";
import { SiegeWeapons } from "../siege/SiegeWeapons";
import { SiegeWeapon } from "../siege/weapons/SiegeWeapon";
import { CellData } from "./CellData";
import { MapRoom } from "./MapRoom";
import { MapRoomCell } from "./MapRoomCell";
import { PopupAttackA_CLIP } from "../../../PopupAttackA_CLIP";
import { PopupInfoMonster } from "./PopupInfoMonster";

import { ATTACK } from "../../../ATTACK";
import { BASE } from "../../../BASE";
import { bubblepopup3 } from "../../../bubblepopup3";
import { CATAPULTITEM } from "../../../CATAPULTITEM";
import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";
import { LOGGER } from "../../../LOGGER";
import { POPUPS } from "../../../POPUPS";
import { POWERUPS } from "../../../POWERUPS";

/**
 * PopupAttackA - attack popup for map room.
 */
export class PopupAttackA extends PopupAttackA_CLIP {
    private _cell: MapRoomCell | null = null;
    private _mcResources: MovieClip | null = null;
    private _attackResources: Record<string, any> = {};
    private _monstersInRange: boolean = false;
    private _cellsInRange: Array<CellData> = [];
    private _enabled: boolean = false;
    private _profilePic: Loader | null = null;
    private _profileBmp: Bitmap | null = null;
    private _protectedInRange: boolean = false;
    private _scroller: ScrollSet | null = null;

    constructor() {
        super();
        this.mMonsters.mask = this.mMonstersMask;
        this._scroller = new ScrollSet();
        this._scroller.isHiddenWhileUnnecessary = true;
        this._scroller.AutoHideEnabled = false;
        this._scroller.width = this.scroll.width;
        this._scroller.x = this.scroll.x;
        this._scroller.y = this.scroll.y;
        this.addChild(this._scroller);
        this._scroller.Init(this.mMonsters, this.mMonstersMask, 0, this.scroll.y, this.scroll.height);
        this.bAttack.SetupKey("map_attack_btn");
        this.bAttack.addEventListener(MouseEvent.CLICK, this.Attack.bind(this));
        this.bAttack.enabled = false;
        this.bAttack.buttonMode = true;
        this.bCancel.SetupKey("btn_cancel");
        this.bCancel.addEventListener(MouseEvent.CLICK, this.Hide.bind(this));
        this.bCancel.buttonMode = true;
        this.tCatapult.htmlText = "<b>" + KEYS.Get("newmap_catapultrange") + "</b>";
        this.tMonsters.htmlText = "<b>" + KEYS.Get("newmap_monstersrange") + "</b>";
    }

    public Hide(event: MouseEvent | null = null): void {
        let profilePics = this.mcProfilePic.mcBG.numChildren;
        while (profilePics--) {
            this.mcProfilePic.mcBG.removeChildAt(profilePics);
        }
        MapRoom._mc.HideAttack();
    }

    public Setup(cell: MapRoomCell): void {
        this._cell = cell;
        if (this._cell._base === 3) {
            this.tAttackText.htmlText = "<b>" + KEYS.Get("newmap_att1", { "v1": this._cell._name }) + "</b>";
        } else if (this._cell._base === 2) {
            this.tAttackText.htmlText = "<b>" + KEYS.Get("newmap_att2", { "v1": this._cell._name }) + "</b>";
        } else if (this._cell._base === 1) {
            this.tAttackText.htmlText = "<b>" + KEYS.Get("newmap_att3", { "v1": this._cell._name }) + "</b>";
        } else {
            LOGGER.Log("err", "Cell at (" + this._cell.X + "," + this._cell.Y + ") has invalid base type " + this._cell._base + " when being attacked");
            this.tAttackText.htmlText = "<b>Attack</b>";
        }
        this._enabled = false;
        this.bAttack.Enabled = false;
        this.ProfilePic();
        if (this._cell._alliance) {
            this.AlliancePic(AllyInfo._picURLs.sizeM, this.mcAlliancePic.mcImage, this.mcAlliancePic.mcBG, true);
        } else {
            this.mcAlliancePic.visible = false;
        }
        this.Update();
    }

    public Cleanup(): void {
        this.bAttack.removeEventListener(MouseEvent.CLICK, this.Attack.bind(this));
        this.bCancel.removeEventListener(MouseEvent.CLICK, this.Hide.bind(this));
        this._cellsInRange = [];
    }

    private Attack(event: MouseEvent | null): void {
        if (!this._enabled) {
            return;
        }
        MapRoom._mc.HideAttack();
        if (!this._cell!._protected && !(this._cell!._truce && this._cell!._truce > GLOBAL.Timestamp()) && this._monstersInRange) {
            if (this._protectedInRange) {
                GLOBAL.Message(KEYS.Get("newmap_attack"), KEYS.Get("confirm_btn"), this.DoAttack.bind(this));
                return;
            }
            GLOBAL._attackerMapResources = this._attackResources;
            GLOBAL._attackerCellsInRange = this._cellsInRange;
            MapRoomManager.instance.Hide();
            MapRoom.ClearCells();
            GLOBAL._currentCell = this._cell;
            if (this._cell!._base === 1) {
                BASE.LoadBase(null, 0, this._cell!._baseID, "wmattack", false, EnumYardType.MAIN_YARD);
            } else {
                const baseType = this._cell!._base === 3 ? EnumYardType.OUTPOST : EnumYardType.MAIN_YARD;
                BASE.LoadBase(null, 0, this._cell!._baseID, GLOBAL.e_BASE_MODE.ATTACK, false, baseType);
            }
        } else if (this._cell!._protected) {
            if (!MapRoom._open) {
                POPUPS.Next();
            }
            GLOBAL.Message(KEYS.Get("newmap_dp"));
        } else if (Boolean(this._cell!._truce) && this._cell!._truce > GLOBAL.Timestamp()) {
            if (!MapRoom._open) {
                POPUPS.Next();
            }
            GLOBAL.Message(KEYS.Get("newmap_truce"));
        } else if (!MapRoom._flingerInRange) {
            if (!MapRoom._open) {
                POPUPS.Next();
            }
            GLOBAL.Message(KEYS.Get("newmap_range"));
        } else {
            if (!MapRoom._open) {
                POPUPS.Next();
            }
            GLOBAL.Message(KEYS.Get("newmap_nomonsters"));
        }
    }

    public DoAttack(): void {
        this._protectedInRange = false;
        this.Attack(null);
    }

    public Update(): boolean {
        let powerUpBonus = 0;
        if (POWERUPS.CheckPowers(POWERUPS.ALLIANCE_DECLAREWAR, "NORMAL")) {
            powerUpBonus = POWERUPS.Apply(POWERUPS.ALLIANCE_DECLAREWAR, [0]);
        }
        if (MapRoom._open) {
            this._cellsInRange = MapRoom._mc.GetCellsInRange(this._cell!.X, this._cell!.Y, 10 + powerUpBonus);
            for (const cellData of this._cellsInRange) {
                const mapRoomCell = cellData.cell as MapRoomCell;
                if (Boolean(mapRoomCell) && !mapRoomCell._processed) {
                    return false;
                }
            }
        } else {
            this._cellsInRange = GLOBAL._attackerCellsInRange;
        }
        if (!this._enabled) {
            this._monstersInRange = false;
            this._protectedInRange = false;
            MapRoom._flingerInRange = false;
            this._attackResources = {
                "r1": GLOBAL._resources.r1.Get(),
                "r2": GLOBAL._resources.r2.Get(),
                "r3": GLOBAL._resources.r3.Get(),
                "catapult": new SecNum(0),
                "flinger": new SecNum(0)
            };
            let mapRoomCell: MapRoomCell | null = null;
            if (!MapRoomManager.instance.isInMapRoom3) {
                ATTACK._curCreaturesAvailable = [];
                for (const cellData of this._cellsInRange) {
                    mapRoomCell = cellData["cell"] as MapRoomCell;
                    const cellRange = cellData["range"] as number;
                    if (Boolean(mapRoomCell) && Boolean(mapRoomCell._mine)) {
                        if (mapRoomCell._flingerRange.Get() + powerUpBonus >= cellRange) {
                            for (const monsterType in mapRoomCell._monsters) {
                                const monsterQuantity = mapRoomCell._monsters[monsterType].Get();
                                this._monstersInRange = true;
                                if (monsterQuantity > 0 && Boolean(mapRoomCell._protected)) {
                                    this._protectedInRange = true;
                                }
                                if (ATTACK._curCreaturesAvailable[monsterType]) {
                                    ATTACK._curCreaturesAvailable[monsterType] += monsterQuantity;
                                } else {
                                    ATTACK._curCreaturesAvailable[monsterType] = monsterQuantity;
                                }
                            }
                            MapRoom._flingerInRange = true;
                        }
                        if (mapRoomCell._flingerRange.Get() >= this._attackResources.flinger.Get()) {
                            this._attackResources.flinger.Set(mapRoomCell._flingerLevel.Get());
                        }
                    }
                }
            } else {
                this._monstersInRange = true;
                if (mapRoomCell && mapRoomCell._flingerRange.Get() >= this._attackResources.flinger.Get()) {
                    this._attackResources.flinger.Set(mapRoomCell._flingerLevel.Get());
                }
            }
            if (MapRoom._flingerInRange) {
                if (GLOBAL._playerCatapultLevel) {
                    this._attackResources.catapult.Set(GLOBAL._playerCatapultLevel.Get());
                }
                for (let guardianIndex = 0; guardianIndex < GLOBAL._playerGuardianData.length; guardianIndex++) {
                    if (GLOBAL._playerGuardianData[guardianIndex] && GLOBAL._playerGuardianData[guardianIndex].hp.Get() > 0 && GLOBAL._playerGuardianData[guardianIndex].status === ChampionBase.k_CHAMPION_STATUS_NORMAL) {
                        this._monstersInRange = true;
                    }
                }
            }
            while (this.mMonsters.numChildren) {
                this.mMonsters.removeChildAt(0);
            }
            if (this._monstersInRange) {
                let xPos = 0;
                let yPos = 0;
                let isNormalChampion = false;
                for (let guardianDataIndex = 0; guardianDataIndex < GLOBAL._playerGuardianData.length; guardianDataIndex++) {
                    const guardianData = GLOBAL._playerGuardianData[guardianDataIndex];
                    if (guardianData && guardianData.hp.Get() > 0 && guardianData.status === ChampionBase.k_CHAMPION_STATUS_NORMAL && (!isNormalChampion || guardianData.t === 5)) {
                        if (guardianData.t !== 5) {
                            isNormalChampion = true;
                        }
                        const attackingMonsterInfo = new PopupInfoMonster();
                        attackingMonsterInfo.Setup(xPos * 125, yPos * 30, "G" + GLOBAL._playerGuardianData[guardianDataIndex].t + "_L" + GLOBAL._playerGuardianData[guardianDataIndex].l.Get(), 1);
                        this.mMonsters.addChild(attackingMonsterInfo);
                        xPos += 1;
                        if (xPos === 3) {
                            xPos = 0;
                            yPos += 1;
                        }
                    } else if (guardianData && guardianData.hp.Get() > 0 && guardianData.status === ChampionBase.k_CHAMPION_STATUS_NORMAL && isNormalChampion && guardianData.t !== 5) {
                        LOGGER.Log("log", "User has capacity to initialize combat with more than one normal champ.");
                    }
                }
                if (!MapRoomManager.instance.isInMapRoom3) {
                    for (const creepType in ATTACK._curCreaturesAvailable) {
                        const popupInfoMonster = new PopupInfoMonster();
                        popupInfoMonster.Setup(xPos * 125, yPos * 30, creepType, ATTACK._curCreaturesAvailable[creepType]);
                        xPos += 1;
                        this.mMonsters.addChild(popupInfoMonster);
                        if (xPos === 3) {
                            xPos = 0;
                            yPos += 1;
                        }
                    }
                } else {
                    const attackingPlayerMonsterCount = GLOBAL.attackingPlayer.monsterList.length;
                    for (let i = 0; i < attackingPlayerMonsterCount; i++) {
                        const healthyCreepCount = GLOBAL.attackingPlayer.monsterList[i].numHealthyHousedCreeps;
                        if (healthyCreepCount) {
                            const popupInfoMonster = new PopupInfoMonster();
                            popupInfoMonster.Setup(xPos * 125, yPos * 30, GLOBAL.attackingPlayer.monsterList[i].m_creatureID, healthyCreepCount);
                            xPos += 1;
                            this.mMonsters.addChild(popupInfoMonster);
                            if (xPos === 3) {
                                xPos = 0;
                                yPos += 1;
                            }
                        }
                    }
                }
                this.addChild(this.mMonsters);
            }
            let pebbleBombLevel = -1;
            let puttyBombLevel = -1;
            let maxBombLevel = -1;
            if (Boolean(this._mcResources) && Boolean(this._mcResources!.parent)) {
                this._mcResources!.parent.removeChild(this._mcResources!);
                this._mcResources = null;
            }
            this._mcResources = new MovieClip();
            this._mcResources.x = -175;
            this._mcResources.y = -75;
            if (this._attackResources.catapult.Get() >= 1) {
                for (let twigBombLevel = 0; twigBombLevel < 3; twigBombLevel++) {
                    if (this._attackResources.r1 < ResourceBombs._bombs["tw" + twigBombLevel].cost) {
                        break;
                    }
                    pebbleBombLevel = twigBombLevel;
                }
            }
            if (this._attackResources.catapult.Get() >= 2) {
                for (let twigBombLevel = 0; twigBombLevel < 4; twigBombLevel++) {
                    if (this._attackResources.r2 < ResourceBombs._bombs["pb" + twigBombLevel].cost) {
                        break;
                    }
                    puttyBombLevel = twigBombLevel;
                }
            }
            if (this._attackResources.catapult.Get() >= 3) {
                for (let twigBombLevel = 0; twigBombLevel < 4; twigBombLevel++) {
                    if (this._attackResources.r3 < ResourceBombs._bombs["pu" + twigBombLevel].cost) {
                        break;
                    }
                    maxBombLevel = twigBombLevel;
                }
            }
            let catapultItem = new CATAPULTITEM();
            if (pebbleBombLevel >= 0) {
                catapultItem.Setup("tw" + pebbleBombLevel, true, true);
            } else {
                catapultItem.Setup("tw0", true, false);
            }
            catapultItem.x = 0;
            catapultItem.y = 0;
            this._mcResources.addChild(catapultItem);
            catapultItem = new CATAPULTITEM();
            if (puttyBombLevel >= 0) {
                catapultItem.Setup("pb" + puttyBombLevel, true, true);
            } else {
                catapultItem.Setup("pb0", true, false);
            }
            catapultItem.x = 65;
            catapultItem.y = 0;
            this._mcResources.addChild(catapultItem);
            catapultItem = new CATAPULTITEM();
            if (maxBombLevel >= 0) {
                catapultItem.Setup("pu" + maxBombLevel, true, true);
            } else {
                catapultItem.Setup("pu0", true, false);
            }
            catapultItem.x = 130;
            catapultItem.y = 0;
            this._mcResources.addChild(catapultItem);
            const siegeWeapon = SiegeWeapons.availableWeapon;
            if (Boolean(siegeWeapon) && MapRoom._flingerInRange) {
                catapultItem = new CATAPULTITEM();
                catapultItem._props = siegeWeapon;
                catapultItem._bombid = siegeWeapon.weaponID;
                catapultItem._txtMC._tA.htmlText = "<b>" + siegeWeapon.name + "</b>";
                catapultItem._image = new MovieClip();
                catapultItem.addChild(catapultItem._image);
                catapultItem._popup = new bubblepopup3();
                catapultItem._popup.x = 44;
                catapultItem._popup.y = 29;
                catapultItem.addChild(catapultItem._popup);
                catapultItem._popX = catapultItem._popup.x;
                catapultItem._popY = catapultItem._popup.y;
                catapultItem.Enabled = true;
                catapultItem.Hide();
                catapultItem.setChildIndex(catapultItem._image, 1);
                catapultItem.setChildIndex(catapultItem._txtMC, 2);
                catapultItem.setChildIndex(catapultItem._popup, 3);
                ImageCache.GetImageWithCallBack(siegeWeapon.image, this.onSiegeIconComplete.bind(this), true, 1, "", [catapultItem._image]);
                catapultItem.mouseEnabled = false;
                catapultItem.x = 195;
                catapultItem.y = 0;
                this._mcResources.addChild(catapultItem);
            }
            this.addChild(this._mcResources);
            this.bAttack.Enabled = true;
            this._enabled = true;
        }
        if (this._scroller) {
            this._scroller.Update();
        }
        return this._enabled;
    }

    private onSiegeIconComplete(path: string, bitmapData: BitmapData, params: Array<any> | null = null): void {
        let container: MovieClip | null = null;
        if (params && params[0]) {
            container = params[0];
            while (container!.numChildren > 0) {
                container!.removeChildAt(0);
            }
        }
        const bmp = new Bitmap(bitmapData);
        bmp.height = 60;
        bmp.width = 60;
        if (container) {
            container.addChild(bmp);
        }
    }

    private ProfilePic(): void {
        const onImageLoad = (event: Event): void => {
            if (this._profilePic) {
                this._profilePic.height = 50;
                this._profilePic.width = 50;
            }
        };
        const imageComplete = (path: string, bitmapData: BitmapData): void => {
            this._profileBmp = new Bitmap(bitmapData);
            this.mcProfilePic.mcBG.addChild(this._profileBmp);
        };
        const LoadImageError = (event: IOErrorEvent): void => {
        };
        if (!this._cell!._facebookID && this._cell!._base !== 1 && !this._cell!._pic_square) {
            return;
        }
        if (this._cell!._base > 1) {
            this._profilePic = new Loader();
            this._profilePic.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, LoadImageError, false, 0, true);
            this._profilePic.contentLoaderInfo.addEventListener(Event.COMPLETE, onImageLoad);
            if (Boolean(!GLOBAL._flags.viximo) && Boolean(this._cell!._pic_square)) {
                this._profilePic.load(new URLRequest(this._cell!._pic_square));
            } else {
                this._profilePic.load(new URLRequest("http://graph.facebook.com/" + this._cell!._facebookID + "/picture"));
            }
            this.mcProfilePic.mcBG.addChild(this._profilePic);
        } else {
            switch (this._cell!._name) {
                case "Dreadnought":
                case "Dreadnaut":
                    ImageCache.GetImageWithCallBack("monsters/tribe_dreadnaut_50.v2.jpg", imageComplete);
                    break;
                case "Kozu":
                    ImageCache.GetImageWithCallBack("monsters/tribe_kozu_50.v2.jpg", imageComplete);
                    break;
                case "Legionnaire":
                    ImageCache.GetImageWithCallBack("monsters/tribe_legionnaire_50.v2.jpg", imageComplete);
                    break;
                case "Abunakki":
                    ImageCache.GetImageWithCallBack("monsters/tribe_abunakki_50.v2.jpg", imageComplete);
                    break;
            }
        }
    }

    private AlliancePic(size: string, container: MovieClip, containerBG: MovieClip | null = null, showRel: boolean = false): void {
        const AllianceIconLoaded = (path: string, bitmapData: BitmapData, params: Array<any> | null = null): void => {
            const bmp = new Bitmap(bitmapData);
            if (params && params[0]) {
                params[0].addChild(bmp);
                params[0].setChildIndex(bmp, 0);
                if (params[0].parent) {
                    params[0].parent.visible = true;
                }
            }
        };
        if (!this._cell!._facebookID || this._cell!._base <= 1) {
            this.mcAlliancePic.visible = false;
            return;
        }
        if (this._cell!._base > 1 && Boolean(this._cell!._alliance)) {
            let k = this.mcAlliancePic.mcImage.numChildren;
            while (k--) {
                this.mcAlliancePic.mcImage.removeChildAt(k);
            }
            this.mcAlliancePic.visible = true;
            const allyinfo = this._cell!._alliance;
            allyinfo.AlliancePic(size, container, containerBG, true);
        } else {
            this.mcAlliancePic.visible = false;
        }
    }
}
