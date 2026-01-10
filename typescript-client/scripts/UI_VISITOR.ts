import MovieClip from 'openfl/display/MovieClip';
import Event from 'openfl/events/Event';
import MouseEvent from 'openfl/events/MouseEvent';
import Rectangle from 'openfl/geom/Rectangle';
import { EnumYardType } from './com/monsters/enums/EnumYardType';
import { InstanceManager } from './com/monsters/managers/InstanceManager';
import { MapRoom3Cell } from './com/monsters/maproom3/MapRoom3Cell';
import { Maproom3AttackCostPopup } from './com/monsters/maproom3/popups/Maproom3AttackCostPopup';
import { MapRoom } from './com/monsters/maproom_advanced/MapRoom';
import { MapRoomCell } from './com/monsters/maproom_advanced/MapRoomCell';
import { MapRoomManager } from './com/monsters/maproom_manager/MapRoomManager';
import { button_buildings } from './button_buildings';
import { ResourceBar1 } from './ResourceBar1';
import { ResourceBar2 } from './ResourceBar2';
import { ResourceBar3 } from './ResourceBar3';
import { ResourceBar4 } from './ResourceBar4';
import { UI_VISITOR_CLIP } from './UI_VISITOR_CLIP';
import { BFOUNDATION } from './BFOUNDATION';
import { BUILDING11 } from './BUILDING11';
import { ATTACK } from './ATTACK';
import { BASE } from './BASE';
import { BUILDINGS } from './BUILDINGS';
import { GLOBAL } from './GLOBAL';
import { KEYS } from './KEYS';
import { LOGIN } from './LOGIN';
import { MAP } from './MAP';
import { MAPROOM_DESCENT } from './MAPROOM_DESCENT';
import { POPUPS } from './POPUPS';
import { JSON } from './JSON';

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
        if (GLOBAL.mode == GLOBAL.e_BASE_MODE.ATTACK || GLOBAL.mode == GLOBAL.e_BASE_MODE.WMATTACK) {
            this.mc.mcBG.width = 100;
            this.mc.bReturn.SetupKey("btn_endattack");
            this.mc.bAttack.visible = false;
        } else if (MapRoomManager.instance.isInMapRoom2or3 && !BASE.isInfernoMainYardOrOutpost) {
            this.mc.bReturn.SetupKey("btn_openmap");
            if ((GLOBAL.mode != GLOBAL.e_BASE_MODE.HELP || MapRoomManager.instance.isInMapRoom3) && !MapRoomManager.instance.viewOnly && GLOBAL._currentCell && MapRoomManager.instance.flingerInRange) {
                if (GLOBAL._currentCell.isDestroyed && GLOBAL._currentCell.baseType != 2) {
                    this.mc.bAttack.SetupKey("newmap_take_btn");
                } else {
                    this.mc.bAttack.SetupKey("map_attack_btn");
                }
                this.mc.bAttack.visible = true;
                if (MapRoomManager.instance.isInMapRoom3) {
                    this.mc.bAttack.addEventListener(MouseEvent.CLICK, this.AttackMR3.bind(this));
                } else {
                    this.mc.bAttack.addEventListener(MouseEvent.CLICK, this.Attack.bind(this));
                }
                if (GLOBAL._currentCell.isLocked || this.isLevelLimited || !ATTACK.hasCreaturesToAttackWith) {
                    this.mc.bAttack.Enabled = false;
                } else {
                    this.mc.bAttack.Enabled = true;
                }
            } else {
                this.mc.bAttack.visible = false;
                if (GLOBAL.mode != GLOBAL.e_BASE_MODE.HELP || MapRoomManager.instance.isInMapRoom3) {
                    this.mc.mcBG.width = 100;
                }
            }
        } else {
            if (GLOBAL.mode != GLOBAL.e_BASE_MODE.HELP || MapRoomManager.instance.isInMapRoom3) {
                this.mc.mcBG.width = 100;
            }
            this.mc.bReturn.SetupKey("btn_returnhome");
            this.mc.bAttack.visible = false;
        }
        this.mc.bReturn.addEventListener(MouseEvent.CLICK, this.ReturnCB.bind(this));
        this.mc.gotoAndStop(1);
        this.Update();
    }

    public static get mc(): MovieClip {
        return UI_VISITOR.s_mc;
    }

    public static Focus(building: BFOUNDATION): Function {
        return (param1: MouseEvent = null): void => {
            MAP.FocusTo(building._mc.x, building._mc.y, 0.6);
            BASE.BuildingSelect(building, true);
        };
    }

    public get isLevelLimited(): boolean {
        return BASE.loadObject["canattack"] == false;
    }

    public Taunt(param1: MouseEvent = null): void {
        BUILDINGS.Show();
    }

    public Gift(param1: MouseEvent = null): void {
        BUILDINGS.Show();
    }

    public ReturnCB(param1: MouseEvent): void {
        let _loc2_ = 0;
        if (GLOBAL._newBuilding) {
            GLOBAL._newBuilding.Cancel();
        }
        if (GLOBAL.mode == GLOBAL.e_BASE_MODE.ATTACK || GLOBAL.mode == GLOBAL.e_BASE_MODE.WMATTACK) {
            ATTACK.End();
        } else if (MapRoomManager.instance.isInMapRoom2or3 && GLOBAL._loadmode == GLOBAL.mode) {
            MapRoomManager.instance.SetupAndShow();
        } else if (BASE.isInfernoMainYardOrOutpost) {
            _loc2_ = MapRoomManager.instance.isInMapRoom3 ? EnumYardType.PLAYER : EnumYardType.MAIN_YARD;
            if (MAPROOM_DESCENT.InDescent) {
                BASE.LoadBase(null, 0, 0, GLOBAL.e_BASE_MODE.BUILD, false, _loc2_);
            } else {
                BASE.LoadBase(GLOBAL._infBaseURL, 0, 0, GLOBAL.e_BASE_MODE.IBUILD, false, EnumYardType.INFERNO_YARD);
            }
        } else {
            BASE.LoadBase(null, 0, 0, GLOBAL.e_BASE_MODE.BUILD, false, _loc2_);
        }
    }

    public AttackMR3(param1: MouseEvent): void {
        const _loc2_ = GLOBAL._currentCell as MapRoom3Cell;
        if (!_loc2_) {
            return;
        }
        if (!ATTACK.hasCreaturesToAttackWith) {
            GLOBAL.Message(KEYS.Get("msg_nocreaturesattack"));
            return;
        }
        if (_loc2_.isLocked) {
            GLOBAL.Message(KEYS.Get("mr3_base_locked_cannot_attack"));
            return;
        }
        if (this.isLevelLimited) {
            GLOBAL.Message(KEYS.Get("map_msg_leveltoolow"));
            return;
        }
        if (_loc2_.hasTruce) {
            GLOBAL.Message(KEYS.Get("newmap_truce"));
            return;
        }
        if (_loc2_.hasDamageProtection) {
            GLOBAL.Message(KEYS.Get("newmap_dp"));
            return;
        }
        if (_loc2_.isInAttackRange) {
            this.loadAttack();
        } else {
            if (!this.attackCostPopup) {
                this.attackCostPopup = new Maproom3AttackCostPopup(_loc2_);
                this.attackCostPopup.addEventListener(Maproom3AttackCostPopup.k_LOAD_ATTACK, this.clickedLoadAttack.bind(this));
            }
            POPUPS.Push(this.attackCostPopup.graphic);
        }
    }

    protected clickedLoadAttack(param1: Event): void {
        this.attackCostPopup.removeEventListener(Maproom3AttackCostPopup.k_LOAD_ATTACK, this.clickedLoadAttack.bind(this));
        POPUPS.Next();
        this.loadAttack(this.attackCostPopup.addtionalLoadParameters);
        this.attackCostPopup = null;
    }

    private loadAttack(param1: any = null): void {
        const _loc2_ = GLOBAL._currentCell as MapRoom3Cell;
        const _loc3_ = MapRoomManager.instance.CalculateCellId(_loc2_.cellX, _loc2_.cellY);
        BASE.LoadBase(null, 0, _loc2_.baseID, !_loc2_.userID ? GLOBAL.e_BASE_MODE.WMATTACK : GLOBAL.e_BASE_MODE.ATTACK, false, _loc2_.cellType, _loc3_, param1 ? ["attackcost", JSON.encode(param1)] : null);
    }

    public Attack(param1: MouseEvent): void {
        const _loc2_ = GLOBAL._currentCell as MapRoomCell;
        if (_loc2_ && _loc2_.isLocked) {
            if (_loc2_.online) {
                GLOBAL.Message(KEYS.Get("msg_cantattackoccupied"));
            } else {
                GLOBAL.Message(KEYS.Get("msg_cantattackbeingattacked"));
            }
        } else if (_loc2_) {
            if (_loc2_.isDestroyed) {
                MapRoom.showEnemyWait = true;
                MapRoomManager.instance.Show();
            } else if (!_loc2_.isProtected && !(_loc2_.truce && _loc2_.truce > GLOBAL.Timestamp())) {
                MapRoom.showAttackWait = true;
                MapRoomManager.instance.Show();
            } else if (_loc2_.isProtected) {
                GLOBAL.Message(KEYS.Get("newmap_dp"));
            } else if (_loc2_.truce && _loc2_.truce > GLOBAL.Timestamp()) {
                GLOBAL.Message(KEYS.Get("newmap_truce"));
            }
        }
    }

    public Update(): void {
        if (GLOBAL.mode == GLOBAL.e_BASE_MODE.ATTACK || GLOBAL.mode == GLOBAL.e_BASE_MODE.WMATTACK) {
            if (ATTACK._countdown < 0) {
                this.mc.bReturn.Highlight = true;
            }
        } else if (GLOBAL.mode == GLOBAL.e_BASE_MODE.HELP) {
            if (UI_VISITOR._helpButtons && this.mc.contains(UI_VISITOR._helpButtons)) {
                this.mc.removeChild(UI_VISITOR._helpButtons);
            }
            UI_VISITOR._helpButtons = this.mc.addChild(new MovieClip()) as MovieClip;
            UI_VISITOR._helpButtons.x = MapRoomManager.instance.isInMapRoom3 ? 310 : 210;
            UI_VISITOR._helpButtons.y = 5;
            let _loc1_ = 0;
            const _loc2_ = InstanceManager.getInstancesByClass(BFOUNDATION);
            for (const _loc3_ of _loc2_) {
                const building = _loc3_ as BFOUNDATION;
                if (building._countdownBuild.Get() + building._countdownUpgrade.Get() + building._countdownFortify.Get() > 0) {
                    let _loc4_ = false;
                    for (const _loc5_ of building._helpList) {
                        if (_loc5_ == LOGIN._playerID) {
                            _loc4_ = true;
                            break;
                        }
                    }
                    this.mc.gotoAndStop(2);
                    if (MapRoomManager.instance.isInMapRoom3) {
                        this.mc.getChildAt(2).x = 200;
                    }
                    const _loc6_ = new button_buildings();
                    _loc6_.gotoAndStop(building._type);
                    _loc6_.x = _loc1_ * 45;
                    if (!_loc4_) {
                        _loc6_.buttonMode = true;
                        _loc6_.addEventListener(MouseEvent.CLICK, UI_VISITOR.Focus(building));
                        _loc6_.mcTick.visible = false;
                    }
                    UI_VISITOR._helpButtons.addChild(_loc6_);
                    _loc1_++;
                }
            }
            if (_loc1_ > 0) {
                this.mc.mcBG.width = (MapRoomManager.instance.isInMapRoom3 ? 320 : 220) + _loc1_ * 45;
            } else {
                this.mc.mcBG.width = MapRoomManager.instance.isInMapRoom3 ? 210 : 100;
                this.mc.gotoAndStop(1);
            }
        }
        this.Resize();
    }

    public Resize(): void {
        if (!this.m_oldScreen || !GLOBAL._SCREEN.equals(this.m_oldScreen)) {
            GLOBAL.RefreshScreen();
            this.m_oldScreen = GLOBAL._SCREEN.clone();
        }
        this.mc.x = GLOBAL._SCREEN.x + GLOBAL._SCREEN.width - this.mc.mcBG.width - 10;
        if (GLOBAL._flags.viximo) {
            this.mc.y = GLOBAL._SCREEN.y + GLOBAL._SCREEN.height - (this.mc.height + 10);
        } else {
            this.mc.y = GLOBAL._SCREENHUD.y - (this.mc.mcBG.height + 10);
        }
        for (let _loc1_ = 4; _loc1_ > 0; _loc1_--) {
            const bar = this["m_resourceBar" + _loc1_];
            if (bar) {
                bar.x = GLOBAL._SCREEN.x + GLOBAL._SCREEN.width - 10 - bar.width * 0.5;
                bar.y = GLOBAL._SCREEN.y + _loc1_ * 40;
            }
        }
    }

    public checkMapRoomHealth(): void {
        const _loc2_ = InstanceManager.getInstancesByClass(BUILDING11);
        if (_loc2_.length === 0) {
            return;
        }
        const _loc1_ = _loc2_[0] as BUILDING11;
        if (_loc1_.health < _loc1_.maxHealth / 2) {
            this.mc.bReturn.SetupKey("btn_returnhome");
        }
    }
}
