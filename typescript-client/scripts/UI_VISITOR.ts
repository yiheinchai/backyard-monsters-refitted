import MovieClip from 'openfl/display/MovieClip';
import Event from 'openfl/events/Event';
import MouseEvent from 'openfl/events/MouseEvent';
import Rectangle from 'openfl/geom/Rectangle';
import { EnumYardType } from './com/monsters/enums/EnumYardType';
import { MapRoom3Cell } from './com/monsters/maproom3/MapRoom3Cell';
import { Maproom3AttackCostPopup } from './com/monsters/maproom3/popups/Maproom3AttackCostPopup';
import { MapRoom } from './com/monsters/maproom_advanced/MapRoom';
import { MapRoomCell } from './com/monsters/maproom_advanced/MapRoomCell';
import { button_buildings } from './button_buildings';
import { ResourceBar1 } from './ResourceBar1';
import { ResourceBar2 } from './ResourceBar2';
import { ResourceBar3 } from './ResourceBar3';
import { ResourceBar4 } from './ResourceBar4';
import { UI_VISITOR_CLIP } from './UI_VISITOR_CLIP';
import { MAPROOM_DESCENT } from './MAPROOM_DESCENT';
import { JSON } from './JSON';

// Lazy imports to break circular dependency chains
function getInstanceManager(): any { return require("./com/monsters/managers/InstanceManager").InstanceManager; }
function getMapRoomManager(): any { return require("./com/monsters/maproom_manager/MapRoomManager").MapRoomManager; }
function getBFOUNDATION(): any { return require("./BFOUNDATION").BFOUNDATION; }
function getBUILDING11(): any { return require("./BUILDING11").BUILDING11; }
function getATTACK(): any { return require("./ATTACK").ATTACK; }
function getBASE(): any { return require("./BASE").BASE; }
function getBUILDINGS(): any { return require("./BUILDINGS").BUILDINGS; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getLOGIN(): any { return require("./LOGIN").LOGIN; }
function getMAP(): any { return require("./MAP").MAP; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }


export class UI_VISITOR extends UI_VISITOR_CLIP {
    public static _helpButtons: MovieClip;
    private static s_mc: MovieClip;

    protected m_resourceBar1: ResourceBar1;
    protected m_resourceBar2: ResourceBar2;
    protected m_resourceBar3: ResourceBar3;
    protected m_resourceBar4: ResourceBar4;
    protected m_oldScreen: Rectangle;
    private attackCostPopup: Maproom3AttackCostPopup;

    constructor() {
        super();
        UI_VISITOR.s_mc = this.mc;
        if (getGLOBAL().mode == getGLOBAL().e_BASE_MODE.ATTACK || getGLOBAL().mode == getGLOBAL().e_BASE_MODE.WMATTACK) {
            (this.mc as any).mcBG.width = 100;
            (this.mc as any).bReturn.SetupKey("btn_endattack");
            (this.mc as any).bAttack.visible = false;
        } else if (getMapRoomManager().instance.isInMapRoom2or3 && !getBASE().isInfernoMainYardOrOutpost) {
            (this.mc as any).bReturn.SetupKey("btn_openmap");
            if ((getGLOBAL().mode != getGLOBAL().e_BASE_MODE.HELP || getMapRoomManager().instance.isInMapRoom3) && !getMapRoomManager().instance.viewOnly && getGLOBAL()._currentCell && getMapRoomManager().instance.flingerInRange) {
                if (getGLOBAL()._currentCell.isDestroyed && getGLOBAL()._currentCell.baseType != 2) {
                    (this.mc as any).bAttack.SetupKey("newmap_take_btn");
                } else {
                    (this.mc as any).bAttack.SetupKey("map_attack_btn");
                }
                (this.mc as any).bAttack.visible = true;
                if (getMapRoomManager().instance.isInMapRoom3) {
                    (this.mc as any).bAttack.addEventListener(MouseEvent.CLICK, this.AttackMR3.bind(this));
                } else {
                    (this.mc as any).bAttack.addEventListener(MouseEvent.CLICK, this.Attack.bind(this));
                }
                if (getGLOBAL()._currentCell.isLocked || this.isLevelLimited || !getATTACK().hasCreaturesToAttackWith) {
                    (this.mc as any).bAttack.Enabled = false;
                } else {
                    (this.mc as any).bAttack.Enabled = true;
                }
            } else {
                (this.mc as any).bAttack.visible = false;
                if (getGLOBAL().mode != getGLOBAL().e_BASE_MODE.HELP || getMapRoomManager().instance.isInMapRoom3) {
                    (this.mc as any).mcBG.width = 100;
                }
            }
        } else {
            if (getGLOBAL().mode != getGLOBAL().e_BASE_MODE.HELP || getMapRoomManager().instance.isInMapRoom3) {
                (this.mc as any).mcBG.width = 100;
            }
            (this.mc as any).bReturn.SetupKey("btn_returnhome");
            (this.mc as any).bAttack.visible = false;
        }
        (this.mc as any).bReturn.addEventListener(MouseEvent.CLICK, this.ReturnCB.bind(this));
        this.mc.gotoAndStop(1);
        this.Update();
    }

    public static get mc(): MovieClip {
        return UI_VISITOR.s_mc;
    }

    public static Focus(building: BFOUNDATION): (event?: MouseEvent) => void {
        return (param1: MouseEvent = null): void => {
            getMAP().FocusTo(building._mc.x, building._mc.y, 0.6);
            getBASE().BuildingSelect(building, true);
        };
    }

    public get isLevelLimited(): boolean {
        return getBASE().loadObject["canattack"] == false;
    }

    public Taunt(param1: MouseEvent = null): void {
        getBUILDINGS().Show();
    }

    public Gift(param1: MouseEvent = null): void {
        getBUILDINGS().Show();
    }

    public ReturnCB(param1: MouseEvent): void {
        let _loc2_ = 0;
        if (getGLOBAL()._newBuilding) {
            getGLOBAL()._newBuilding.Cancel();
        }
        if (getGLOBAL().mode == getGLOBAL().e_BASE_MODE.ATTACK || getGLOBAL().mode == getGLOBAL().e_BASE_MODE.WMATTACK) {
            getATTACK().End();
        } else if (getMapRoomManager().instance.isInMapRoom2or3 && getGLOBAL()._loadmode == getGLOBAL().mode) {
            getMapRoomManager().instance.SetupAndShow();
        } else if (getBASE().isInfernoMainYardOrOutpost) {
            _loc2_ = getMapRoomManager().instance.isInMapRoom3 ? EnumYardType.PLAYER : EnumYardType.MAIN_YARD;
            if (MAPROOM_DESCENT.InDescent) {
                getBASE().LoadBase(null, 0, 0, getGLOBAL().e_BASE_MODE.BUILD, false, _loc2_);
            } else {
                getBASE().LoadBase(getGLOBAL()._infBaseURL, 0, 0, getGLOBAL().e_BASE_MODE.IBUILD, false, EnumYardType.INFERNO_YARD);
            }
        } else {
            getBASE().LoadBase(null, 0, 0, getGLOBAL().e_BASE_MODE.BUILD, false, _loc2_);
        }
    }

    public AttackMR3(param1: MouseEvent): void {
        const _loc2_ = getGLOBAL()._currentCell as MapRoom3Cell;
        if (!_loc2_) {
            return;
        }
        if (!getATTACK().hasCreaturesToAttackWith) {
            getGLOBAL().Message(getKEYS().Get("msg_nocreaturesattack"));
            return;
        }
        if (_loc2_.isLocked) {
            getGLOBAL().Message(getKEYS().Get("mr3_base_locked_cannot_attack"));
            return;
        }
        if (this.isLevelLimited) {
            getGLOBAL().Message(getKEYS().Get("map_msg_leveltoolow"));
            return;
        }
        if (_loc2_.hasTruce) {
            getGLOBAL().Message(getKEYS().Get("newmap_truce"));
            return;
        }
        if (_loc2_.hasDamageProtection) {
            getGLOBAL().Message(getKEYS().Get("newmap_dp"));
            return;
        }
        if (_loc2_.isInAttackRange) {
            this.loadAttack();
        } else {
            if (!this.attackCostPopup) {
                this.attackCostPopup = new Maproom3AttackCostPopup(_loc2_);
                this.attackCostPopup.addEventListener(Maproom3AttackCostPopup.k_LOAD_ATTACK, this.clickedLoadAttack.bind(this));
            }
            getPOPUPS().Push(this.attackCostPopup.graphic);
        }
    }

    protected clickedLoadAttack(param1: Event): void {
        this.attackCostPopup.removeEventListener(Maproom3AttackCostPopup.k_LOAD_ATTACK, this.clickedLoadAttack.bind(this));
        getPOPUPS().Next();
        this.loadAttack(this.attackCostPopup.addtionalLoadParameters);
        this.attackCostPopup = null;
    }

    private loadAttack(param1: any = null): void {
        const _loc2_ = getGLOBAL()._currentCell as MapRoom3Cell;
        const _loc3_ = getMapRoomManager().instance.CalculateCellId(_loc2_.cellX, _loc2_.cellY);
        getBASE().LoadBase(null, 0, _loc2_.baseID, !_loc2_.userID ? getGLOBAL().e_BASE_MODE.WMATTACK : getGLOBAL().e_BASE_MODE.ATTACK, false, _loc2_.cellType, _loc3_, param1 ? ["attackcost", JSON.encode(param1)] : null);
    }

    public Attack(param1: MouseEvent): void {
        const _loc2_ = getGLOBAL()._currentCell as MapRoomCell;
        if (_loc2_ && _loc2_.isLocked) {
            if (_loc2_.online) {
                getGLOBAL().Message(getKEYS().Get("msg_cantattackoccupied"));
            } else {
                getGLOBAL().Message(getKEYS().Get("msg_cantattackbeingattacked"));
            }
        } else if (_loc2_) {
            if (_loc2_.isDestroyed) {
                MapRoom.showEnemyWait = true;
                getMapRoomManager().instance.Show();
            } else if (!_loc2_.isProtected && !(_loc2_.truce && _loc2_.truce > getGLOBAL().Timestamp())) {
                MapRoom.showAttackWait = true;
                getMapRoomManager().instance.Show();
            } else if (_loc2_.isProtected) {
                getGLOBAL().Message(getKEYS().Get("newmap_dp"));
            } else if (_loc2_.truce && _loc2_.truce > getGLOBAL().Timestamp()) {
                getGLOBAL().Message(getKEYS().Get("newmap_truce"));
            }
        }
    }

    public Update(): void {
        if (getGLOBAL().mode == getGLOBAL().e_BASE_MODE.ATTACK || getGLOBAL().mode == getGLOBAL().e_BASE_MODE.WMATTACK) {
            if (getATTACK()._countdown < 0) {
                (this.mc as any).bReturn.Highlight = true;
            }
        } else if (getGLOBAL().mode == getGLOBAL().e_BASE_MODE.HELP) {
            if (UI_VISITOR._helpButtons && this.mc.contains(UI_VISITOR._helpButtons)) {
                this.mc.removeChild(UI_VISITOR._helpButtons);
            }
            UI_VISITOR._helpButtons = this.mc.addChild(new MovieClip()) as MovieClip;
            UI_VISITOR._helpButtons.x = getMapRoomManager().instance.isInMapRoom3 ? 310 : 210;
            UI_VISITOR._helpButtons.y = 5;
            let _loc1_ = 0;
            const _loc2_ = getInstanceManager().getInstancesByClass(getBFOUNDATION());
            for (const _loc3_ of _loc2_) {
                const building = _loc3_ as BFOUNDATION;
                if (building._countdownBuild.Get() + building._countdownUpgrade.Get() + building._countdownFortify.Get() > 0) {
                    let _loc4_ = false;
                    for (const _loc5_ of building._helpList) {
                        if (_loc5_ == getLOGIN()._playerID) {
                            _loc4_ = true;
                            break;
                        }
                    }
                    this.mc.gotoAndStop(2);
                    if (getMapRoomManager().instance.isInMapRoom3) {
                        this.mc.getChildAt(2).x = 200;
                    }
                    const _loc6_ = new button_buildings();
                    _loc6_.gotoAndStop(building._type);
                    _loc6_.x = _loc1_ * 45;
                    if (!_loc4_) {
                        _loc6_.buttonMode = true;
                        _loc6_.addEventListener(MouseEvent.CLICK, UI_VISITOR.Focus(building));
                        (_loc6_ as any).mcTick.visible = false;
                    }
                    UI_VISITOR._helpButtons.addChild(_loc6_);
                    _loc1_++;
                }
            }
            if (_loc1_ > 0) {
                (this.mc as any).mcBG.width = (getMapRoomManager().instance.isInMapRoom3 ? 320 : 220) + _loc1_ * 45;
            } else {
                (this.mc as any).mcBG.width = getMapRoomManager().instance.isInMapRoom3 ? 210 : 100;
                this.mc.gotoAndStop(1);
            }
        }
        this.Resize();
    }

    public Resize(): void {
        if (!this.m_oldScreen || !getGLOBAL()._SCREEN.equals(this.m_oldScreen)) {
            getGLOBAL().RefreshScreen();
            this.m_oldScreen = getGLOBAL()._SCREEN.clone();
        }
        this.mc.x = getGLOBAL()._SCREEN.x + getGLOBAL()._SCREEN.width - (this.mc as any).mcBG.width - 10;
        if (getGLOBAL()._flags.viximo) {
            this.mc.y = getGLOBAL()._SCREEN.y + getGLOBAL()._SCREEN.height - (this.mc.height + 10);
        } else {
            this.mc.y = getGLOBAL()._SCREENHUD.y - ((this.mc as any).mcBG.height + 10);
        }
        for (let _loc1_ = 4; _loc1_ > 0; _loc1_--) {
            const bar = (this as any)["m_resourceBar" + _loc1_];
            if (bar) {
                bar.x = getGLOBAL()._SCREEN.x + getGLOBAL()._SCREEN.width - 10 - bar.width * 0.5;
                bar.y = getGLOBAL()._SCREEN.y + _loc1_ * 40;
            }
        }
    }

    public checkMapRoomHealth(): void {
        const _loc2_ = getInstanceManager().getInstancesByClass(getBUILDING11());
        if (_loc2_.length === 0) {
            return;
        }
        const _loc1_ = _loc2_[0] as BUILDING11;
        if (_loc1_.health < _loc1_.maxHealth / 2) {
            (this.mc as any).bReturn.SetupKey("btn_returnhome");
        }
    }
}
