import { InventoryManager } from './com/monsters/inventory/InventoryManager';
import { InstanceManager } from './com/monsters/managers/InstanceManager';
import MovieClip from 'openfl/display/MovieClip';
import MouseEvent from 'openfl/events/MouseEvent';
import { BASE } from './BASE';
import { BFOUNDATION } from './BFOUNDATION';
import { BUILDINGBUTTON } from './BUILDINGBUTTON';
import { BUILDINGBUTTONSOON } from './BUILDINGBUTTONSOON';
import { BUILDINGOPTIONSPOPUP } from './BUILDINGOPTIONSPOPUP';
import { BUILDINGS } from './BUILDINGS';
import { BUILDINGSPOPUP_CLIP } from './BUILDINGSPOPUP_CLIP';
import { Button } from './Button';
import { Button_CLIP } from './Button_CLIP';
import { GLOBAL } from './GLOBAL';
import { KEYS } from './KEYS';
import { POPUPSETTINGS } from './POPUPSETTINGS';
import { SOUNDS } from './SOUNDS';
import { TUTORIAL } from './TUTORIAL';

/**
 * BUILDINGSPOPUP - Buildings Popup
 * Handles the popup for selecting and placing buildings
 * Converted from ActionScript to TypeScript
 */
export class BUILDINGSPOPUP extends BUILDINGSPOPUP_CLIP {
    public _subButtonsMC: MovieClip | null = null;
    public _thumbnailsMC: MovieClip | null = null;
    public _buildingInfoMC: BUILDINGOPTIONSPOPUP | null = null;
    public _pageCount: number = 0;
    public _excluded: any[] = [];
    public _subButtons: any[] = [];

    constructor() {
        super();
        this._subButtonsMC = null;
        this._thumbnailsMC = null;
        this._buildingInfoMC = null;
        this._pageCount = 0;
        this.mcNew.visible = GLOBAL._newThings;
        this.b1.SetupKey("btn_resources");
        this.b2.SetupKey("btn_buildings");
        this.b3.SetupKey("btn_defensive");
        this.b4.SetupKey("btn_decorations");
        this.b1.addEventListener(MouseEvent.CLICK, this.Switch(1, 1, 0));
        this.b2.addEventListener(MouseEvent.CLICK, this.Switch(2, 1, 0));
        this.b3.addEventListener(MouseEvent.CLICK, this.Switch(3, 1, 0));
        this.b4.addEventListener(MouseEvent.CLICK, this.Switch(4, 0, 0));
        this.bPrevious.addEventListener(MouseEvent.CLICK, this.Previous.bind(this));
        this.bPrevious.buttonMode = true;
        this.bNext.addEventListener(MouseEvent.CLICK, this.Next.bind(this));
        this.bNext.buttonMode = true;
        if (!GLOBAL.townHall) {
            this.SwitchB(2, 1, 0);
        } else {
            this.SwitchB(BUILDINGS._menuA, BUILDINGS._menuB, BUILDINGS._page);
        }
        if (BASE.isMainYard) {
            if (!GLOBAL._flags.radio) {
                GLOBAL._buildingProps[112].block = true;
                GLOBAL._buildingProps[11].order = 2;
            }
        }
    }

    public Switch(param1: number, param2: number, param3: number): Function {
        const a: number = param1;
        const b: number = param2;
        const p: number = param3;
        return (param1: MouseEvent): void => {
            if ((param1.target as any).Enabled) {
                SOUNDS.Play("click1");
                this.SwitchB(a, b, p);
            }
        };
    }

    public Exclude(param1: any[]): void {
        let _loc3_: number = 0;
        let _loc2_: number = 0;
        while (_loc2_ < param1.length) {
            if (param1[_loc2_] instanceof Array) {
                if (this._subButtons) {
                    if (param1[_loc2_].length === this._subButtons.length) {
                        _loc3_ = 0;
                        while (_loc3_ < param1[_loc2_].length) {
                            this._subButtons[param1[_loc2_][_loc3_]].Enabled = false;
                            _loc2_++;
                        }
                    }
                }
            } else {
                (this as any)["b" + param1[_loc2_]].Enabled = false;
            }
            _loc2_++;
        }
        this._excluded = param1;
    }

    public SwitchB(param1: number, param2: number, param3: number): void {
        let _loc5_: number = 0;
        let _loc6_: number = 0;
        let _loc8_: number = 0;
        let _loc10_: any = null;
        let _loc11_: BUILDINGBUTTON | null = null;
        BUILDINGS._menuA = param1;
        BUILDINGS._menuB = param2;
        BUILDINGS._page = param3;
        let _loc4_: number = 1;
        while (_loc4_ < 5) {
            (this as any)["b" + _loc4_].Highlight = false;
            _loc4_++;
        }
        (this as any)["b" + param1].Highlight = true;
        if (param1 === 4) {
            this.SubMenu([KEYS.Get("btn_evil"), KEYS.Get("btn_plants"), KEYS.Get("btn_good"), KEYS.Get("btn_flags"), KEYS.Get("btn_premium")]);
        } else {
            this.SubMenu([]);
        }
        if (this._thumbnailsMC) {
            this.removeChild(this._thumbnailsMC);
        }
        this._thumbnailsMC = this.addChild(new MovieClip()) as MovieClip;
        this._thumbnailsMC.x = 60;
        this._thumbnailsMC.y = 115 + 25;
        const _loc7_: any[] = GLOBAL._buildingProps.concat();
        if (TUTORIAL.hasFinished) {
            this.SortBuildings(_loc7_);
        } else {
            _loc7_.sort((a: any, b: any) => a.order - b.order);
        }
        param2 = 0;
        while (param2 < _loc7_.length) {
            _loc10_ = _loc7_[param2];

            if (BASE.isInfernoMainYardOrOutpost && Number(_loc10_.id) === 135) {
                param2++;
                continue;
            }

            if (Number(_loc10_.group) === param1 && (_loc10_.subgroup == null || Number(_loc10_.subgroup) === BUILDINGS._menuB) && (!_loc10_.block || InventoryManager.buildingStorageCount(Number(_loc10_.id)))) {
                if (_loc8_ >= 10 * BUILDINGS._page && _loc8_ < 10 + 10 * BUILDINGS._page) {
                    _loc11_ = this._thumbnailsMC.addChild(new BUILDINGBUTTON()) as BUILDINGBUTTON;
                    _loc11_.x = _loc5_ * 130;
                    _loc11_.y = _loc6_ * 170;
                    _loc11_.Setup(Number(_loc10_.id));
                    _loc5_++;
                    if (_loc5_ === 5) {
                        _loc5_ = 0;
                        _loc6_++;
                    }
                    if (_loc6_ === 2) {
                        _loc6_ = 0;
                    }
                }
                _loc8_++;
            }
            param2++;
        }
        const _loc9_: BUILDINGBUTTONSOON = new BUILDINGBUTTONSOON();
        _loc9_.t.htmlText = KEYS.Get("building_coming_soon");
        if (_loc8_ === 0) {
            this._thumbnailsMC.addChild(_loc9_);
        }
        this._pageCount = Math.ceil(_loc8_ / 10);
        if (BUILDINGS._page > 0) {
            this.bPrevious.Trigger(true);
        } else {
            this.bPrevious.Trigger(false);
        }
        if (BUILDINGS._page < this._pageCount - 1 && TUTORIAL._stage >= 200) {
            this.bNext.Trigger(true);
        } else {
            this.bNext.Trigger(false);
        }
    }

    public SortBuildings(param1: any[]): void {
        let _loc3_: any = null;
        let _loc5_: any = null;
        let _loc6_: number = 0;
        let _loc7_: number = 0;
        let _loc8_: number = 0;
        let _loc9_: BFOUNDATION | null = null;
        let _loc10_: number = 0;
        let _loc11_: number = 0;
        let _loc12_: string = "";
        const _loc2_: any[] = InstanceManager.getInstancesByClass(BFOUNDATION);
        let _loc4_: number = 0;
        while (_loc4_ < param1.length) {
            _loc5_ = param1[_loc4_];
            if (_loc5_.group === BUILDINGS._menuA && (_loc5_.subgroup == null || _loc5_.subgroup === BUILDINGS._menuB) && (!_loc5_.block || InventoryManager.buildingStorageCount(_loc5_.id))) {
                _loc3_ = GLOBAL._buildingProps[_loc5_.id - 1];
                if (_loc3_.type !== "decoration") {
                    _loc6_ = GLOBAL.GetBuildingTownHallLevel(_loc3_);
                    _loc7_ = _loc6_ < _loc3_.quantity.length ? Number(_loc3_.quantity[_loc6_]) : Number(_loc3_.quantity[_loc3_.quantity.length - 1]);
                    _loc8_ = 0;
                    _loc3_.buildStatus = 1;
                    for (const instance of _loc2_) {
                        _loc9_ = instance as BFOUNDATION;
                        if (_loc9_._type === _loc5_.id) {
                            _loc8_++;
                        }
                    }
                    if (_loc8_ <= 0 && Boolean(_loc3_.upgradeImgData)) {
                        _loc11_ = Number.MAX_VALUE;
                        for (_loc12_ in _loc3_.upgradeImgData) {
                            if (!isNaN(Number(_loc12_))) {
                                _loc11_ = Math.min(_loc11_, Number(_loc12_));
                            }
                        }
                        if (_loc11_ !== Number.MAX_VALUE && _loc3_.upgradeImgData[_loc11_].silhouette_img && !BASE.HasRequirements(_loc3_.costs[0]) && !_loc3_.rewarded) {
                            _loc3_.buildStatus = 2;
                        }
                    } else if (_loc8_ >= _loc7_) {
                        _loc3_.buildStatus = 3;
                    }
                    _loc10_ = Math.max(..._loc3_.quantity);
                    if (_loc8_ >= _loc10_ && _loc10_ > 0) {
                        _loc3_.buildStatus = 4;
                    }
                }
            }
            _loc4_++;
        }
        param1.sort((a: any, b: any) => {
            if (a.buildStatus !== b.buildStatus) {
                return a.buildStatus - b.buildStatus;
            }
            return a.order - b.order;
        });
    }

    public SubMenu(param1: any[]): void {
        let _loc4_: Button | null = null;
        if (this._subButtonsMC) {
            this.removeChild(this._subButtonsMC);
        }
        this._subButtonsMC = this.addChild(new MovieClip()) as MovieClip;
        const _loc2_: any[] = [];
        let _loc3_: number = 0;
        while (_loc3_ < param1.length) {
            _loc4_ = this._subButtonsMC.addChild(new Button_CLIP()) as Button_CLIP;
            _loc4_.x = _loc3_ * 110;
            _loc4_.width = 105;
            _loc4_.Setup(param1[_loc3_]);
            _loc2_.push(_loc4_);
            _loc4_.addEventListener(MouseEvent.CLICK, this.Switch(BUILDINGS._menuA, _loc3_, 0));
            if (_loc3_ === BUILDINGS._menuB) {
                _loc4_.Highlight = true;
            }
            _loc3_++;
        }
        this._subButtonsMC.x = 380 - this._subButtonsMC.width / 2;
        this._subButtonsMC.y = 75 + 25;
    }

    public ShowInfo(param1: number): void {
        BUILDINGS._buildingID = param1;
        if (this._buildingInfoMC) {
            this._buildingInfoMC.parent!.removeChild(this._buildingInfoMC);
        }
        GLOBAL.BlockerAdd();
        this._buildingInfoMC = GLOBAL._layerWindows.addChild(new BUILDINGOPTIONSPOPUP("build", param1)) as BUILDINGOPTIONSPOPUP;
        this._buildingInfoMC.x = GLOBAL._SCREENCENTER.x;
        this._buildingInfoMC.y = GLOBAL._SCREENCENTER.y;
    }

    public HideInfo(): void {
        if (this._buildingInfoMC) {
            GLOBAL.BlockerRemove();
            SOUNDS.Play("close");
            this._buildingInfoMC.parent!.removeChild(this._buildingInfoMC);
            this._buildingInfoMC = null;
        }
    }

    public Hide(param1: MouseEvent | null = null): void {
        BUILDINGS.Hide();
    }

    public Previous(param1: MouseEvent | null = null): void {
        if (BUILDINGS._page > 0) {
            BUILDINGS._page--;
            this.SwitchB(BUILDINGS._menuA, BUILDINGS._menuB, BUILDINGS._page);
            SOUNDS.Play("click1");
        }
    }

    public Next(param1: MouseEvent | null = null): void {
        if (BUILDINGS._page < this._pageCount - 1) {
            BUILDINGS._page++;
            this.SwitchB(BUILDINGS._menuA, BUILDINGS._menuB, BUILDINGS._page);
            SOUNDS.Play("click1");
        }
    }

    public Center(): void {
        POPUPSETTINGS.AlignToUpperLeft(this);
    }

    public ScaleUp(): void {
        POPUPSETTINGS.ScaleUp(this);
    }
}
