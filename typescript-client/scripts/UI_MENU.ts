import BitmapData from 'openfl/display/BitmapData';
import MovieClip from 'openfl/display/MovieClip';
import Sprite from 'openfl/display/Sprite';
import Rectangle from 'openfl/geom/Rectangle';
import { ScaleBitmap } from './org/bytearray/display/ScaleBitmap';
import { ImageCache } from './com/monsters/display/ImageCache';
import { UI_BOTTOM } from './com/monsters/ui/UI_BOTTOM';
import { StoneButton } from './StoneButton';

// Lazy imports to break circular dependency chains
function getMapRoomManager(): any { return require("./com/monsters/maproom_manager/MapRoomManager").MapRoomManager; }
function getBASE(): any { return require("./BASE").BASE; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }


export class UI_MENU extends Sprite {
    public woodmargin: number = 10;
    public wood: ScaleBitmap;
    public bBuild: StoneButton;
    public bQuests: StoneButton;
    public bStore: StoneButton;
    public bMap: StoneButton;
    public bKits: StoneButton;
    public buttonspacing: number = 3;
    public _loaded: boolean = false;
    public _sorted: boolean = false;
    public wood_mc: MovieClip;

    constructor() {
        super();
        this.bBuild = new StoneButton();
        this.bQuests = new StoneButton();
        this.bStore = new StoneButton();
        this.bMap = new StoneButton();
        if (getBASE().isOutpostMapRoom2Only) {
            this.bKits = new StoneButton();
        }
    }

    public Setup(): void {
        const cbf1 = (): void => {
            const cbf2 = (param1: string, param2: BitmapData): void => {
                this.wood = new ScaleBitmap(param2.clone());
                this.wood.scale9Grid = new Rectangle(15, 15, 10, 10);
                this.addChild(this.wood);
                this.addChild(this.bBuild);
                if (getMapRoomManager().instance.isInMapRoom3 && !getBASE().isMainYardOrInfernoMainYard) {
                    this.bBuild.Enabled = false;
                }
                if (getGLOBAL()._loadmode == getGLOBAL().mode) {
                    this.addChild(this.bQuests);
                }
                this.addChild(this.bStore);
                this.addChild(this.bMap);
                if (getBASE().isOutpostMapRoom2Only) {
                    this.addChild(this.bKits);
                }
                this.sortAll();
                this._loaded = true;
                UI_BOTTOM.Resize();
                UI_BOTTOM.Update();
            };
            this.bBuild.SetupKey("ui_topbuildings", 12);
            if (getGLOBAL()._loadmode == getGLOBAL().mode) {
                this.bQuests.SetupKey("ui_topquests", 12);
            }
            this.bStore.SetupKey("ui_topstore", 12);
            this.bMap.SetupKey("ui_topmap", 12);
            if (getBASE().isOutpostMapRoom2Only) {
                this.bKits.SetupKey("btn_kits", 12);
            }
            if (getGLOBAL().InfernoMode()) {
                ImageCache.GetImageWithCallBack("ui/stonemenu2.png", cbf2);
            } else {
                ImageCache.GetImageWithCallBack("ui/wood1.png", cbf2);
            }
        };
        if (getGLOBAL().InfernoMode()) {
            ImageCache.GetImageGroupWithCallBack("bottom_ui_inferno", ["ui/lava1.png", "ui/lava2.png", "ui/lava3.png", "ui/stonemenu2.png"], cbf1, true, 1);
        } else {
            ImageCache.GetImageGroupWithCallBack("bottom_ui", ["ui/wood1.png", "ui/stone1.png", "ui/stone2.png", "ui/stone3.png"], cbf1, true, 1);
        }
    }

    public sortAll(): boolean {
        let _loc1_: StoneButton[];
        let _loc2_: StoneButton = null;
        if (getBASE().isOutpostMapRoom2Only) {
            _loc1_ = [this.bKits, this.bBuild, this.bQuests, this.bStore, this.bMap];
        } else if (getGLOBAL().mode != getGLOBAL()._loadmode) {
            _loc1_ = [this.bBuild, this.bStore, this.bMap];
        } else {
            _loc1_ = [this.bBuild, this.bQuests, this.bStore, this.bMap];
        }
        for (const _loc3_ of _loc1_) {
            if (_loc3_._bm == null) {
                return false;
            }
            if (!_loc2_) {
                _loc3_.x = this.woodmargin;
            } else {
                _loc3_.x = _loc2_.x + _loc2_.getButtonWidth() + this.buttonspacing;
            }
            _loc3_.y = this.wood.height * 0.5 - _loc3_.getButtonHeight() * 0.5;
            _loc2_ = _loc3_;
        }
        const _loc4_ = this.bMap.x + this.bMap.width + this.woodmargin;
        this.wood.setSize(_loc4_, this.wood.height);
        this._sorted = true;
        return true;
    }

    public Resize(): void {
        if (this._loaded) {
            this.x = Math.floor(getGLOBAL()._SCREEN.x + getGLOBAL()._SCREEN.width - (this.wood.width + 10));
            this.y = Math.floor(getGLOBAL()._SCREEN.y + getGLOBAL()._SCREEN.height - this.wood.height - 10);
            if (UI_BOTTOM._missions && UI_BOTTOM._missions.frame) {
                this.y = Math.floor(UI_BOTTOM._missions.y + UI_BOTTOM._missions.frame.y - this.wood.height);
            }
        }
    }
}
