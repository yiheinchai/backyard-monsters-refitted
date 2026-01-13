import MovieClip from 'openfl/display/MovieClip';
import Event from 'openfl/events/Event';
import MouseEvent from 'openfl/events/MouseEvent';
import Point from 'openfl/geom/Point';
import Rectangle from 'openfl/geom/Rectangle';
import { InstanceManager } from './com/monsters/managers/InstanceManager';
import { PLANNERPOPUP_CLIP } from './PLANNERPOPUP_CLIP';
import { plannerBuilding } from './plannerBuilding';
import { BFOUNDATION } from './BFOUNDATION';
import { GLOBAL } from './GLOBAL';
import { BASE } from './BASE';
import { KEYS } from './KEYS';
import { STORE } from './STORE';
import { PLANNER } from './PLANNER';

export class PLANNERPOPUP extends PLANNERPOPUP_CLIP {
    public _thumbnailsMC: MovieClip;
    public _buildingInfoMC: MovieClip;
    public _windowRect: Rectangle;
    public _dragPoint: Point;
    public _dragOffset: Point;
    public _dragging: boolean = false;
    public _dragged: boolean = false;
    public _buildings: MovieClip;
    public _ranges: MovieClip;
    public _zoom: number = 0.3;
    public _toggleRanges: boolean = false;
    private _guidePage: number = 1;

    constructor() {
        super();
        this._windowRect = new Rectangle(35, 65, 565, 425);
        this.tName.visible = false;
        this.mcNameBG.visible = false;
        this.tName.autoSize = "left";
        this._buildings = this.mcMap.addChild(new MovieClip()) as MovieClip;
        this._ranges = this.mcMap.addChild(new MovieClip()) as MovieClip;
        this._buildings.mouseEnabled = false;
        this._ranges.mouseEnabled = false;
        this._ranges.visible = false;
        this.Setup();
        this.title_txt.htmlText = KEYS.Get("planner_title");
    }

    public Setup(): void {
        this.mcMap.x = this._windowRect.x + this._windowRect.width / 2;
        this.mcMap.y = this._windowRect.y + this._windowRect.height / 2;
        this.addEventListener(MouseEvent.MOUSE_DOWN, this.DragStart.bind(this));
        this.addEventListener(MouseEvent.MOUSE_UP, this.DragStop.bind(this));
        this.mcMap.scaleX = this.mcMap.scaleY = this._zoom;
        const _loc3_ = InstanceManager.getInstancesByClass(BFOUNDATION);
        for (const _loc4_ of _loc3_) {
            this._buildings.addChild(new plannerBuilding(_loc4_ as BFOUNDATION, this._ranges));
        }
        this.bZoom1.SetupKey("planner_zoomout_btn");
        this.bZoom1.addEventListener(MouseEvent.CLICK, this.ToggleZoom.bind(this));
        this.bZoom1.Enabled = false;
        this.bZoom2.SetupKey("planner_zoomin_btn");
        this.bZoom2.addEventListener(MouseEvent.CLICK, this.ToggleZoom.bind(this));
        this.bRanges.SetupKey("planner_showranges_btn");
        this.bRanges.addEventListener(MouseEvent.CLICK, this.ToggleRanges.bind(this));
        this.bExpand.SetupKey("planner_expand_btn");
        if (BASE.isMainYardOrInfernoMainYard) {
            if (STORE._storeData.ENL && STORE._storeData.ENL.q == 6) {
                this.bExpand.Enabled = false;
            } else {
                this.bExpand.Enabled = true;
                this.bExpand.addEventListener(MouseEvent.CLICK, STORE.Show(1, 1, ["ENL"]));
            }
            this.bExpand.visible = true;
        } else {
            this.bExpand.visible = false;
        }
        let _loc5_ = 1;
        if (STORE._storeData.ENL) {
            _loc5_ = STORE._storeData.ENL.q + 1;
        }
        let _loc6_ = _loc5_ + 2;
        while (_loc6_ < 8) {
            this.mcMap["mc" + _loc6_].visible = false;
            _loc6_++;
        }
        _loc6_ = 1;
        while (_loc6_ < _loc5_) {
            this.mcMap["mc" + _loc6_].visible = false;
            _loc6_++;
        }
        if (_loc5_ < 7) {
            this.mcMap["mc" + (_loc5_ + 1)].alpha = 0.5;
        }
    }

    public Remove(): void {
        for (let _loc1_ = 0; _loc1_ < this._buildings.numChildren; _loc1_++) {
            (this._buildings.getChildAt(_loc1_) as plannerBuilding).Remove();
        }
    }

    public DragStart(param1: MouseEvent = null): void {
        this._dragging = true;
        this._dragged = false;
        this._dragOffset = new Point(this.mcMap.x - this.mouseX, this.mcMap.y - this.mouseY);
        this._dragPoint = new Point(this.mcMap.x, this.mcMap.y);
        this.addEventListener(Event.ENTER_FRAME, this.Drag.bind(this));
    }

    public Drag(param1: Event = null): void {
        if (Math.abs(this.mcMap.x - (this.mouseX + this._dragOffset.x)) > 10 || Math.abs(this.mcMap.y - (this.mouseY + this._dragOffset.y)) > 10) {
            this.mcMap.x = Math.floor((this.mouseX + this._dragOffset.x) / 10) * 10;
            this.mcMap.y = Math.floor((this.mouseY + this._dragOffset.y) / 10) * 10;
            this._dragged = true;
            this.Bounds();
        }
    }

    public Bounds(): void {
        if (GLOBAL._mapWidth * this._zoom > this._windowRect.width) {
            if (this.mcMap.x + GLOBAL._mapWidth * 1.2 * this._zoom / 2 < this._windowRect.width + this._windowRect.x) {
                this.mcMap.x = this._windowRect.width + this._windowRect.x - GLOBAL._mapWidth * 1.2 * this._zoom / 2;
            }
            if (this.mcMap.y + GLOBAL._mapHeight * 1.2 * this._zoom / 2 < this._windowRect.height + this._windowRect.y) {
                this.mcMap.y = this._windowRect.height + this._windowRect.y - GLOBAL._mapHeight * 1.2 * this._zoom / 2;
            }
            if (this.mcMap.x - GLOBAL._mapWidth * 1.2 * this._zoom / 2 > this._windowRect.x) {
                this.mcMap.x = this._windowRect.x + GLOBAL._mapWidth * 1.2 * this._zoom / 2;
            }
            if (this.mcMap.y - GLOBAL._mapHeight * 1.2 * this._zoom / 2 > this._windowRect.y) {
                this.mcMap.y = this._windowRect.y + GLOBAL._mapHeight * 1.2 * this._zoom / 2;
            }
        } else {
            this.mcMap.x = this._windowRect.x + this._windowRect.width / 2;
            this.mcMap.y = this._windowRect.y + this._windowRect.height / 2;
        }
    }

    public DragStop(param1: MouseEvent = null): void {
        this._dragging = false;
        this.removeEventListener(Event.ENTER_FRAME, this.Drag.bind(this));
    }

    public ToggleRanges(param1: MouseEvent = null): void {
        if (this._toggleRanges) {
            this._toggleRanges = false;
            this.bRanges.SetupKey("planner_showranges_btn");
        } else {
            this._toggleRanges = true;
            this.bRanges.SetupKey("planner_hideranges_btn");
        }
        this._ranges.visible = this._toggleRanges;
    }

    public ToggleZoom(param1: MouseEvent = null): void {
        if (param1.target.labelKey == "planner_zoomout_btn") {
            if (this._zoom == 0.75) {
                this._zoom = 0.3;
            }
            if (this._zoom == 1.2) {
                this._zoom = 0.75;
            }
        } else {
            if (this._zoom == 0.75) {
                this._zoom = 1.2;
            }
            if (this._zoom == 0.3) {
                this._zoom = 0.75;
            }
        }
        if (this._zoom == 1.2) {
            this.bZoom2.Enabled = false;
        } else {
            this.bZoom2.Enabled = true;
        }
        if (this._zoom == 0.3) {
            this.bZoom1.Enabled = false;
        } else {
            this.bZoom1.Enabled = true;
        }
        this.mcMap.scaleX = this.mcMap.scaleY = this._zoom;
        this.Bounds();
    }

    private Help(param1: MouseEvent): void {
        const _loc2_ = 6;
        this._guidePage += 1;
        if (this._guidePage > _loc2_) {
            this._guidePage = 1;
        }
        this.gotoAndStop(this._guidePage);
        if (this._guidePage > 1) {
            this.txtGuide.htmlText = KEYS.Get("planner_tut_" + (this._guidePage - 1));
            if (this._guidePage == 2) {
                this.bContinue.addEventListener(MouseEvent.CLICK, this.Help.bind(this));
                this.bContinue.SetupKey("btn_continue");
            }
        }
    }

    public Hide(param1: MouseEvent = null): void {
        PLANNER.Hide();
    }

    public Resize(): void {
        this.x = 0;
        this.y = 0;
    }
}
