import { EnumYardType } from './com/monsters/enums/EnumYardType';
import { PopupMigrate } from './com/monsters/maproom_advanced/PopupMigrate';
import { MapRoomManager } from './com/monsters/maproom_manager/MapRoomManager';
import { GLOBAL } from './GLOBAL';
import { BASE } from './BASE';
import { POPUPS } from './POPUPS';

class RequireData {
    public id: string;
    public displayFn: Function;
    public requireFn: Function;
    public startupOnly: boolean = false;

    constructor() {
    }
}

export class NewPopupSystem {
    public static readonly instance: NewPopupSystem = new NewPopupSystem();

    private _popupStates: any;
    private _actualIds: any;
    private _timeOfLastDialog: number = 0;
    private _dialogShownInSession: boolean = false;
    private _dialogShowing: boolean;
    private _requirements: RequireData[];

    constructor() {
    }

    public static get dialogShowing(): boolean {
        return NewPopupSystem.instance._dialogShowing;
    }

    public createPopupData(): any[] {
        return [{
            "id": "mr2_reminder2",
            "displayFn": (id: string): void => {
                PopupMigrate.Show(() => {
                    NewPopupSystem.instance.ConfirmDialog(id);
                });
            },
            "requirements": [{
                "yardType": EnumYardType.MAIN_YARD,
                "minTownHallLevel": 6,
                "maxMapRoomLevel": 1,
                "minTimeBetweenDisplays": 5 * 24 * 60 * 60,
                "requirementsFn": (id: string): boolean => {
                    return Boolean(GLOBAL._bMap);
                }
            }]
        }];
    }

    public ConfirmDialog(param1: string): void {
        if (!this._popupStates[param1]) {
            this._popupStates[param1] = { "count": 0 };
        }
        ++this._popupStates[param1].count;
        this._dialogShowing = false;
        POPUPS.Next();
    }

    public IgnoreDialog(param1: string): void {
        this._dialogShowing = false;
        POPUPS.Next();
    }

    public Setup(param1: any): void {
        this._popupStates = param1 ? param1.popupStates || {} : {};
        this._timeOfLastDialog = param1 ? param1.lastDialog || 0 : 0;
        this._requirements = [];
        this._dialogShowing = false;
        this._actualIds = {};
        const _loc2_ = this.createPopupData();

        for (let _loc3_ = 0; _loc3_ < _loc2_.length; _loc3_++) {
            const _loc4_ = _loc2_[_loc3_];
            this._actualIds[_loc4_.id] = true;
            if (!(this._popupStates[_loc4_.id] && this._popupStates[_loc4_.id].count > 0)) {
                for (const _loc5_ of _loc4_.requirements) {
                    const _loc6_ = new RequireData();
                    _loc6_.id = _loc4_.id;
                    _loc6_.displayFn = _loc4_.displayFn;
                    _loc6_.requireFn = this.coreRequirements.bind(this);
                    if (_loc4_.startupOnly != null) {
                        _loc6_.startupOnly = _loc4_.startupOnly;
                        delete _loc4_.startupOnly;
                    }
                    for (const _loc7_ in _loc5_) {
                        _loc6_.requireFn = this.getRequirementsFn(_loc7_, _loc5_[_loc7_], _loc6_.requireFn);
                    }
                    this._requirements.push(_loc6_);
                }
            }
        }
    }

    public getRequirementsFn(requireId: string, value: any, nextFn: Function): Function {
        switch (requireId) {
            case "minTimeBetweenDialogs":
                return (param1: string): boolean => {
                    return (value as number) <= GLOBAL.Timestamp() - this._timeOfLastDialog && Boolean(nextFn(param1));
                };
            case "minSessionTimeBetweenDialogs":
                return (param1: string): boolean => {
                    return (value as number) <= GLOBAL.Timestamp() - this._timeOfLastDialog && this._dialogShownInSession && Boolean(nextFn(param1));
                };
            case "yardType":
                return (param1: string): boolean => {
                    return BASE.yardType == value && Boolean(nextFn(param1));
                };
            case "maxMapRoomLevel":
                return (param1: string): boolean => {
                    return ((value as number) < 2 ? !MapRoomManager.instance.isInMapRoom2 : true) && Boolean(nextFn(param1));
                };
            case "minTownHallLevel":
                return (param1: string): boolean => {
                    return Boolean(GLOBAL.townHall) && GLOBAL.townHall._lvl.Get() >= (value as number) && Boolean(nextFn(param1));
                };
            case "minTimeBetweenDisplays":
                return (param1: string): boolean => {
                    return Boolean(this._popupStates[param1]) && (value as number) > GLOBAL.Timestamp() - this._popupStates[param1].shown && Boolean(nextFn(param1));
                };
            case "never":
                return (param1: string): boolean => {
                    return false;
                };
            case "requirementsFn":
                return (param1: string): boolean => {
                    return (value as Function)(param1) && Boolean(nextFn(param1));
                };
            default:
                throw new Error("Requirement id \"" + requireId + "\" not found");
        }
    }

    private coreRequirements(param1: string): boolean {
        if (POPUPS._open || GLOBAL.mode != GLOBAL.e_BASE_MODE.BUILD) {
            return false;
        }
        if (this._popupStates[param1] && this._popupStates[param1].count > 0) {
            return false;
        }
        return true;
    }

    public Export(): any {
        const _loc1_: any = {};
        for (const _loc2_ in this._actualIds) {
            if (this._popupStates[_loc2_]) {
                _loc1_[_loc2_] = {
                    "count": this._popupStates[_loc2_].count || 0,
                    "shown": this._popupStates[_loc2_].shown || null
                };
            }
        }
        return {
            "popupStates": _loc1_,
            "lastDialog": this._timeOfLastDialog
        };
    }

    public CheckAll(param1: boolean = false): boolean {
        const _loc2_: RequireData[] = [];
        for (let _loc3_ = 0; _loc3_ < this._requirements.length; _loc3_++) {
            const _loc4_ = this._requirements[_loc3_];
            if (_loc4_.requireFn(_loc3_) && (!param1 || !_loc4_.startupOnly)) {
                _loc2_.push(_loc4_);
            }
        }
        if (_loc2_.length > 0) {
            this._dialogShownInSession = true;
            this._dialogShowing = false;
            if (!this._popupStates[_loc2_[0].id]) {
                this._popupStates[_loc2_[0].id] = {};
            }
            this._popupStates[_loc2_[0].id].shown = GLOBAL.Timestamp();
            _loc2_[0].displayFn(_loc2_[0].id);
            return true;
        }
        return false;
    }
}
