import Bitmap from 'openfl/display/Bitmap';
import BitmapData from 'openfl/display/BitmapData';
import MovieClip from 'openfl/display/MovieClip';
import Sprite from 'openfl/display/Sprite';
import MouseEvent from 'openfl/events/MouseEvent';
import { ImageCache } from './com/monsters/display/ImageCache';
import { ScrollSetH } from './com/monsters/display/ScrollSetH';
import { ChampionBase } from './com/monsters/monsters/champions/ChampionBase';
import { GUARDIANSELECTPOPUP_CLIP } from './GUARDIANSELECTPOPUP_CLIP';
import { guardianselect_selectportrait_CLIP } from './guardianselect_selectportrait_CLIP';
import { Button } from './Button';
import { POPUPSETTINGS } from './POPUPSETTINGS';

// Lazy imports to break circular dependency chains
function getCHAMPIONCAGE(): any { return require("./CHAMPIONCAGE").CHAMPIONCAGE; }
function getCHAMPIONCHAMBER(): any { return require("./CHAMPIONCHAMBER").CHAMPIONCHAMBER; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getBASE(): any { return require("./BASE").BASE; }
function getLOGGER(): any { return require("./LOGGER").LOGGER; }


/**
 * CHAMPIONSELECTPOPUP - Popup for selecting which champion to raise
 * Converted from ActionScript to TypeScript
 */
export class CHAMPIONSELECTPOPUP extends GUARDIANSELECTPOPUP_CLIP {
    private _guardCage: CHAMPIONCAGE;

    constructor() {
        super();
        this._guardCage = getGLOBAL()._bCage as CHAMPIONCAGE;
        this.tTitle.htmlText = getKEYS().Get("popup_championselecttitle");
        this.createScrollBar(this.createSlots());
    }

    private createScrollBar(param1: Sprite): void {
        let _loc2_: ScrollSetH;
        param1.mask = this.mcMask;
        _loc2_ = new ScrollSetH(param1, this.mcMask);
        _loc2_.x = param1.x;
        _loc2_.y = param1.y + param1.height;
        this.addChild(_loc2_);
    }

    private createSlots(): Sprite {
        let _loc1_: Sprite;
        let _loc3_: number = 0;
        let _loc5_: guardianselect_selectportrait_CLIP;
        let _loc6_: any;
        let _loc7_: Button;
        _loc1_ = new Sprite();
        _loc1_.x = this.mcMask.x;
        _loc1_.y = this.mcMask.y;
        this.addChild(_loc1_);
        const _loc2_: number = 10;
        let _loc4_: number = Number(getCHAMPIONCAGE()._guardians.length);
        while (_loc4_ > 0) {
            if (getCHAMPIONCAGE().CanTrainGuardian(_loc4_)) {
                _loc5_ = new guardianselect_selectportrait_CLIP();
                _loc6_ = getCHAMPIONCAGE()._guardians["G" + _loc4_];
                _loc5_.tGuard_label.htmlText = "<b>" + getKEYS().Get(_loc6_.title) + "<b>";
                _loc5_.tGuard_desc.htmlText = "<b>" + getKEYS().Get(_loc6_.description) + "<b>";
                _loc5_.name = _loc4_.toString();
                _loc7_ = _loc5_.bAction;
                _loc7_.Setup(getKEYS().Get("btn_raisechampion", {"v1": _loc6_.name}), false, 0, 0);
                ImageCache.GetImageWithCallBack(_loc6_.selectGraphic, this.onImageLoad.bind(this), true, 4, "", [_loc5_.mcImage]);
                _loc7_.addEventListener(MouseEvent.CLICK, this.clickedRaise.bind(this));
                _loc5_.x = _loc3_;
                _loc1_.addChild(_loc5_);
                _loc3_ += _loc5_.width + _loc2_;
            }
            _loc4_--;
        }
        return _loc1_;
    }

    private onImageLoad(param1: string, param2: BitmapData, param3: any[] | null = null): void {
        if (param3) {
            (param3[0] as MovieClip).addChild(new Bitmap(param2));
        }
    }

    private clickedRaise(param1: MouseEvent): void {
        const _loc2_: string = String((param1.currentTarget as any).parent.name);
        const _loc3_: number = Number(_loc2_.substr(_loc2_.length - 1));
        this.RaiseGuard(_loc3_);
    }

    private RaiseGuard(param1: number): void {
        let _loc2_: string = "";
        let _loc3_: number = 0;
        if (getGLOBAL().mode == getGLOBAL().e_BASE_MODE.BUILD && getBASE().isMainYard) {
            _loc2_ = "G" + param1;
            if (getCHAMPIONCHAMBER().HasFrozen(param1)) {
                getGLOBAL().Message(getKEYS().Get("championchamber_alreadyfrozen", {"v1": getCHAMPIONCAGE()._guardians[_loc2_].name}));
                return;
            }
            _loc3_ = getBASE().getGuardianIndex(param1);
            if (_loc3_ >= 0) {
                getBASE()._guardianData[_loc3_].status = ChampionBase.k_CHAMPION_STATUS_NORMAL;
            }
            this._guardCage.SpawnGuardian(1, 0, 0, param1, getCHAMPIONCAGE().GetGuardianProperty(_loc2_, 1, "health"), "", 0, getCHAMPIONCAGE()._guardians[_loc2_].props.powerLevel);
            getLOGGER().Stat([52, _loc2_, 2]);
            getBASE().Save(0, false, true);
            this.Hide();
        }
    }

    public Hide(param1: MouseEvent | null = null): void {
        getCHAMPIONCAGE().Hide(param1);
    }

    public Center(): void {
        POPUPSETTINGS.AlignToCenter(this);
    }

    public ScaleUp(): void {
        POPUPSETTINGS.ScaleUp(this);
    }
}
