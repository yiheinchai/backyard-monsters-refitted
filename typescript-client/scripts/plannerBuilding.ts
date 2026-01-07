import { Event } from "openfl/events/Event";
import { MouseEvent } from "openfl/events/MouseEvent";
import { DropShadowFilter } from "openfl/filters/DropShadowFilter";
import { Point } from "openfl/geom/Point";

import { BASE } from "./BASE";
import { BFOUNDATION } from "./BFOUNDATION";
import { GRID } from "./GRID";
import { KEYS } from "./KEYS";
import { PLANNER } from "./PLANNER";
import { plannerBuilding_CLIP } from "./plannerBuilding_CLIP";
import { plannerRange } from "./plannerRange";

export class plannerBuilding extends plannerBuilding_CLIP {
    public _building: BFOUNDATION;
    public _dragging: boolean;
    public _dragPoint: Point;
    public _oldPoint: Point;
    public _rangeCircle: plannerRange;
    public _clickAge: number;

    constructor(param1: BFOUNDATION, param2: any) {
        let _loc3_: Point = null;
        super();

        this.mouseEnabled = false;
        this._building = param1;
        this.mcSquare.width = this._building._footprint[0].width;
        this.mcSquare.height = this._building._footprint[0].height;

        _loc3_ = GRID.FromISO(this._building._mc.x, this._building._mc.y);
        this.x = _loc3_.x;
        this.y = _loc3_.y;

        this.mcSquare.mcBlocked.visible = false;
        this.mcLocked.visible = false;
        this.mcLocked.x = this.mcSquare.width / 2;
        this.mcLocked.y = this.mcSquare.height / 2;
        this.mcLocked.mouseEnabled = false;
        this.mcSquare.mcOver.visible = false;

        if (this._building._class != "mushroom" && this._building._class != "immovable") {
            if (this._building._countdownBuild.Get() + this._building._countdownUpgrade.Get() + this._building._countdownFortify.Get() == 0) {
                this.mcSquare.addEventListener(MouseEvent.CLICK, this.Click.bind(this));
                this.mcSquare.buttonMode = true;
            } else {
                this.mcLocked.visible = true;
            }
        }

        this.mcSquare.addEventListener(MouseEvent.ROLL_OVER, this.InfoShow.bind(this));
        this.mcSquare.addEventListener(MouseEvent.ROLL_OUT, this.InfoHide.bind(this));

        if (this._building._type == 17) {
            this.mcSquare.gotoAndStop(200 + this._building._lvl.Get());
        } else {
            this.mcSquare.gotoAndStop(this._building._type);
        }

        if (this._building._class == "tower") {
            this._rangeCircle = param2.addChild(new plannerRange()) as plannerRange;
            this._rangeCircle.x = this.x + this.mcSquare.width / 2;
            this._rangeCircle.y = this.y + this.mcSquare.height / 2;
            this._rangeCircle.width = this._rangeCircle.height = this._building._range * 2;
            this._rangeCircle.mouseEnabled = false;
        }
    }

    public Remove(): void {
        this.removeEventListener(Event.ENTER_FRAME, this.Drag.bind(this));
        this.mcSquare.removeEventListener(MouseEvent.CLICK, this.Click.bind(this));
        this.mcSquare.removeEventListener(MouseEvent.ROLL_OVER, this.InfoShow.bind(this));
        this.mcSquare.removeEventListener(MouseEvent.ROLL_OUT, this.InfoHide.bind(this));
    }

    public Click(param1: MouseEvent = null): void {
        let _loc2_: number = 0;
        let _loc3_: number = 0;

        if (!PLANNER._mc._dragged) {
            if (!PLANNER._selected) {
                PLANNER._selected = true;
                this._dragging = true;
                this.mcSquare.mcOver.visible = false;
                this._dragPoint = new Point(this.x - (PLANNER._mc.mouseX - PLANNER._mc.mcMap.x) / PLANNER._mc.mcMap.scaleX, this.y - (PLANNER._mc.mouseY - PLANNER._mc.mcMap.y) / PLANNER._mc.mcMap.scaleY);
                this._oldPoint = new Point(this.x, this.y);
                this._clickAge = 0;
                this.mcSquare.removeEventListener(MouseEvent.CLICK, this.Click.bind(this));
                PLANNER._mc.addEventListener(MouseEvent.CLICK, this.ClickB.bind(this));
                this.addEventListener(Event.ENTER_FRAME, this.Drag.bind(this));

                _loc2_ = 0;
                _loc3_ = 0;
                while (_loc3_ < PLANNER._mc._buildings.numChildren) {
                    if (PLANNER._mc._buildings.getChildAt(_loc3_) != this) {
                        PLANNER._mc._buildings.setChildIndex(PLANNER._mc._buildings.getChildAt(_loc3_), _loc2_);
                        _loc2_++;
                    }
                    _loc3_++;
                }
                PLANNER._mc._buildings.setChildIndex(this, _loc2_);
                this.ShadowAdd();
                this._building.StartMove();
            }
        }
    }

    public ClickB(param1: MouseEvent = null): void {
        let _loc2_: Point = null;

        if (!PLANNER._mc._dragged && this._clickAge > 0) {
            PLANNER._selected = false;
            this._dragging = false;
            this.removeEventListener(Event.ENTER_FRAME, this.Drag.bind(this));
            PLANNER._mc.removeEventListener(MouseEvent.CLICK, this.ClickB.bind(this));
            this.mcSquare.addEventListener(MouseEvent.CLICK, this.Click.bind(this));
            this.mcSquare.mcBlocked.visible = false;
            this._building.StopMoveB();
            _loc2_ = GRID.FromISO(this._building._mc.x, this._building._mc.y);
            this.x = _loc2_.x;
            this.y = _loc2_.y;
            this.ShadowRemove();
        }
    }

    public Drag(param1: Event): void {
        let _loc2_: Point = null;

        if (PLANNER._open) {
            if (!this._building._moving) {
                PLANNER._selected = false;
                this._dragging = false;
                this.removeEventListener(Event.ENTER_FRAME, this.Drag.bind(this));
                PLANNER._mc.removeEventListener(MouseEvent.CLICK, this.ClickB.bind(this));
                this.mcSquare.addEventListener(MouseEvent.CLICK, this.Click.bind(this));
                this.mcSquare.mcBlocked.visible = false;
                this._building.StopMoveB();
                _loc2_ = GRID.FromISO(this._building._mc.x, this._building._mc.y);
                this.x = _loc2_.x;
                this.y = _loc2_.y;
                this.ShadowRemove();
            } else {
                ++this._clickAge;
                this.x = Math.floor(((PLANNER._mc.mouseX - PLANNER._mc.mcMap.x) / PLANNER._mc.mcMap.scaleX + this._dragPoint.x) / 5) * 5;
                this.y = Math.floor(((PLANNER._mc.mouseY - PLANNER._mc.mcMap.y) / PLANNER._mc.mcMap.scaleY + this._dragPoint.y) / 5) * 5;
                _loc2_ = GRID.ToISO(this.x, this.y, 0);
                this._building._mc.x = _loc2_.x;
                this._building._mc.y = _loc2_.y;
                this._building._mcBase.x = this._building._mc.x;
                this._building._mcBase.y = this._building._mc.y;

                if (this._building._mcFootprint) {
                    this._building._mcFootprint.x = this._building._mc.x;
                    this._building._mcFootprint.y = this._building._mc.y;
                }

                if (this._building._class == "tower") {
                    this._rangeCircle.x = this.x + this.mcSquare.width / 2;
                    this._rangeCircle.y = this.y + this.mcSquare.height / 2;
                }

                if (BASE.BuildBlockers(this._building) != "") {
                    this.mcSquare.mcBlocked.visible = true;
                } else {
                    this.mcSquare.mcBlocked.visible = false;
                }
            }
        }
    }

    public InfoShow(param1: MouseEvent): void {
        let _loc2_: string = null;

        if (this._building._class == "decoration" || this._building._class == "mushroom" || this._building._class == "immovable") {
            _loc2_ = "<b>" + KEYS.Get(this._building._buildingProps.name) + "</b>";
        } else {
            this.mcSquare.mcOver.visible = true;
            _loc2_ = "<b>";

            if (this._building._lvl.Get() > 0 && this._building._class != "mushroom" && this._building._class != "immovable") {
                _loc2_ += KEYS.Get("planner_bdglevel", {
                    "v1": this._building._lvl.Get(),
                    "v2": KEYS.Get(this._building._buildingProps.name)
                }) + "</b>";
            }

            if (this._building._countdownBuild.Get() > 0) {
                _loc2_ += " " + KEYS.Get("planner_bdgbuilding");
            }
            if (this._building._countdownUpgrade.Get() > 0) {
                _loc2_ += " " + KEYS.Get("planner_bdgupgrading");
            }
            if (this._building._countdownFortify.Get() > 0) {
                _loc2_ += " " + KEYS.Get("planner_bdgfortifying");
            }
        }

        PLANNER._mc.tName.htmlText = _loc2_;
        PLANNER._mc.mcNameBG.width = PLANNER._mc.tName.width + 10;
        PLANNER._mc.tName.visible = true;
        PLANNER._mc.mcNameBG.visible = true;
    }

    public InfoHide(param1: MouseEvent): void {
        this.mcSquare.mcOver.visible = false;
        PLANNER._mc.tName.visible = false;
        PLANNER._mc.mcNameBG.visible = false;
    }

    public ShadowAdd(): void {
        const _loc1_: DropShadowFilter = new DropShadowFilter();
        _loc1_.distance = 5;
        _loc1_.angle = 45;
        _loc1_.color = 0;
        _loc1_.alpha = 0.5;
        _loc1_.blurX = 3;
        _loc1_.blurY = 3;
        _loc1_.strength = 1;
        _loc1_.quality = 15;
        this.mcSquare.filters = [_loc1_];
    }

    public ShadowRemove(): void {
        this.mcSquare.filters = [];
    }
}
