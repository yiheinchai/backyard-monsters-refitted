import { Bitmap } from 'openfl/display/Bitmap';
import { BitmapData } from 'openfl/display/BitmapData';
import { MovieClip } from 'openfl/display/MovieClip';
import { Sprite } from 'openfl/display/Sprite';
import { MouseEvent } from 'openfl/events/MouseEvent';
import { TweenLite } from 'gsap';
import { Circ } from 'gsap/easing';
import { ImageCache } from './com/monsters/display/ImageCache';
import { ScrollSetH } from './com/monsters/display/ScrollSetH';
import { GUARDIANCHAMBERPOPUP_CLIP } from './GUARDIANCHAMBERPOPUP_CLIP';
import { CHAMPIONCHAMBER } from './CHAMPIONCHAMBER';
import { CHAMPIONCAGE } from './CHAMPIONCAGE';
import { CHAMPIONCAGEPOPUP } from './CHAMPIONCAGEPOPUP';
import { ChampionChamberFrozen } from './ChampionChamberFrozen';
import { GLOBAL } from './GLOBAL';
import { KEYS } from './KEYS';
import { POPUPSETTINGS } from './POPUPSETTINGS';

export class CHAMPIONCHAMBERPOPUP extends GUARDIANCHAMBERPOPUP_CLIP {
    private _guardChamber: CHAMPIONCHAMBER;
    private _selectGuard: any;
    private _slots: ChampionChamberFrozen[];
    private _activeSlot: ChampionChamberFrozen;
    private _cubeContainer: Sprite;

    constructor() {
        super();
        this._guardChamber = GLOBAL._bChamber as CHAMPIONCHAMBER;
        this._slots = [];
        this.tTitle.htmlText = KEYS.Get("chamber_title");
        this.createScrollBar(this.createSlots());
    }

    private createScrollBar(param1: Sprite): void {
        let _loc2_: ScrollSetH = null;
        param1.mask = this.mcMask;
        _loc2_ = new ScrollSetH(param1, this.mcMask);
        _loc2_.x = param1.x;
        _loc2_.y = param1.y + param1.height;
        this.addChild(_loc2_);
    }

    private createSlots(): Sprite {
        let _loc3_: number = 0;
        let _loc4_: any = null;
        let _loc5_: ChampionChamberFrozen = null;
        let _loc6_: number = 0;
        let _loc7_: string = null;
        let _loc8_: any = null;
        const _loc1_: Sprite = new Sprite();
        _loc1_.x = this.mcMask.x;
        _loc1_.y = this.mcMask.y;
        this.addChild(_loc1_);
        const _loc2_: number = 0;
        for (const key in CHAMPIONCAGE.GetAllGuardianData()) {
            _loc4_ = CHAMPIONCAGE.GetAllGuardianData()[key];
            _loc5_ = new ChampionChamberFrozen();
            _loc6_ = Number(_loc4_.l.Get());
            _loc7_ = "G" + _loc4_.t;
            _loc8_ = CHAMPIONCAGE._guardians[_loc7_];
            _loc5_.name = _loc4_.t.toString();
            _loc5_.tName.htmlText = "<b>" + KEYS.Get(_loc8_.title) + "</b><br>" + KEYS.Get("chamber_level", { "v1": _loc6_ });
            ImageCache.GetImageWithCallBack("monsters/" + _loc7_ + "_L" + _loc6_ + "-150.png", this.onImageLoad.bind(this), true, 4, "", [_loc5_.mcImage]);
            _loc5_.addEventListener(MouseEvent.ROLL_OVER, this.rollOverChampion.bind(this));
            _loc5_.x = _loc3_;
            _loc1_.addChild(_loc5_);
            if (_loc3_ == 0) {
                this.SelectGuard(_loc4_.t);
            }
            _loc3_ += _loc5_.width + _loc2_;
            this._slots.push(_loc5_);
            this.updateSlot(_loc5_, _loc4_.t);
        }
        return _loc1_;
    }

    private updateSlot(param1: ChampionChamberFrozen, param2: number): void {
        const _loc3_: boolean = CHAMPIONCHAMBER.HasFrozen(param2);
        const _loc4_: string = String(CHAMPIONCAGE._guardians["G" + param2].name);
        if (_loc3_) {
            param1.gotoAndStop("frozen");
            param1.bFreeze.removeEventListener(MouseEvent.CLICK, this.clickedFreeze.bind(this));
            param1.bFreeze.Setup(KEYS.Get("btn_thawname", { "v1": _loc4_ }), false, 0, 0);
            param1.bFreeze.addEventListener(MouseEvent.CLICK, this.clickedThaw.bind(this));
        } else {
            param1.gotoAndStop("thaw");
            param1.bFreeze.removeEventListener(MouseEvent.CLICK, this.clickedThaw.bind(this));
            param1.bFreeze.Setup(KEYS.Get("btn_freezename", { "v1": _loc4_ }), false, 0, 0);
            param1.bFreeze.addEventListener(MouseEvent.CLICK, this.clickedFreeze.bind(this));
        }
    }

    private onImageLoad(param1: string, param2: BitmapData, param3: any[] = null): void {
        (param3[0] as MovieClip).addChild(new Bitmap(param2));
    }

    private clickedFreeze(param1: MouseEvent): void {
        const _loc2_: string = String((param1.currentTarget as any).parent.name);
        const _loc3_: number = Number(_loc2_.substr(_loc2_.length - 1));
        this.FreezeGuard(_loc3_);
    }

    private clickedThaw(param1: MouseEvent): void {
        const _loc2_: string = String((param1.currentTarget as any).parent.name);
        const _loc3_: number = Number(_loc2_.substr(_loc2_.length - 1));
        this.ThawGuard(_loc3_);
    }

    private rollOverChampion(param1: MouseEvent): void {
        const _loc2_: string = String((param1.currentTarget as any).name);
        const _loc3_: number = Number(_loc2_.substr(_loc2_.length - 1));
        this.SelectGuard(_loc3_);
    }

    public FreezeGuard(param1: number = 0): void {
        this._guardChamber.FreezeGuardian();
        this.Hide();
    }

    private ThawGuard(param1: number = 0): void {
        this._guardChamber.ThawGuardian(param1);
        this.Hide();
    }

    public SelectGuard(param1: number = 1): void {
        this.UpdateStats(CHAMPIONCAGE.GetGuardianData(param1));
    }

    private UpdateStats(param1: any = null): void {
        let _loc2_: number = 0;
        let _loc3_: number = 0;
        let _loc4_: number = 0;
        let _loc5_: string = null;
        let _loc6_: string = null;
        let _loc7_: number = NaN;
        let _loc8_: number = NaN;
        let _loc9_: number = NaN;
        let _loc10_: number = NaN;
        let _loc11_: number = NaN;
        if (param1) {
            _loc2_ = Number(param1.t);
            _loc3_ = Number(param1.l.Get());
            _loc4_ = Number(param1.fb.Get());
            _loc5_ = "G" + _loc2_;
            _loc6_ = "monsters/" + "G" + _loc2_ + "_L" + _loc3_ + "-150.png";
            if (_loc6_) {
                ImageCache.GetImageWithCallBack(_loc6_, this.UpdateSelectImage.bind(this));
            }
            this.damage_txt.htmlText = "<b>" + KEYS.Get("gcage_labelDamage") + "</b>";
            this.health_txt.htmlText = "<b>" + KEYS.Get("gcage_labelHealth") + "</b>";
            this.speed_txt.htmlText = "<b>" + KEYS.Get("gcage_labelSpeed") + "</b>";
            this.buff_txt.htmlText = "<b>" + KEYS.Get("gcage_labelBuff") + "</b>";
            this.tEvoStage.htmlText = "<b>" + CHAMPIONCAGE._guardians["G" + _loc2_].name + "</b> " + KEYS.Get("chamber_level", { "v1": _loc3_ });
            this.tEvoDesc.htmlText = KEYS.Get(CHAMPIONCAGE._guardians["G" + _loc2_].description);
            _loc7_ = CHAMPIONCAGE.GetGuardianProperty(_loc5_, _loc3_, "damage");
            _loc8_ = CHAMPIONCAGE.GetGuardianProperty(_loc5_, _loc3_, "health");
            _loc9_ = CHAMPIONCAGE.GetGuardianProperty(_loc5_, _loc3_, "speed");
            _loc10_ = CHAMPIONCAGE.GetGuardianProperty(_loc5_, _loc3_, "buffs") * 100;
            if (_loc4_ > 0) {
                _loc7_ += CHAMPIONCAGE.GetGuardianProperty(_loc5_, _loc4_, "bonusDamage");
                _loc8_ += CHAMPIONCAGE.GetGuardianProperty(_loc5_, _loc4_, "bonusHealth");
                _loc9_ += CHAMPIONCAGE.GetGuardianProperty(_loc5_, _loc4_, "bonusSpeed");
                _loc10_ += CHAMPIONCAGE.GetGuardianProperty(_loc5_, _loc4_, "bonusBuffs") * 100;
            }
            _loc11_ = Math.floor(_loc9_ * 10) / 10;
            this.tDamage.htmlText = _loc7_.toString();
            this.tHealth.htmlText = _loc8_.toString();
            this.tSpeed.htmlText = _loc11_.toString();
            this.tBuff.htmlText = Math.floor(_loc10_) + "%";
            TweenLite.to(this.bDamage.mcBar, 0.4, {
                "width": 100 / CHAMPIONCAGEPOPUP._maxDamage * _loc7_,
                "ease": Circ.easeInOut
            });
            TweenLite.to(this.bHealth.mcBar, 0.4, {
                "width": 100 / CHAMPIONCAGEPOPUP._maxHealth * _loc8_,
                "ease": Circ.easeInOut
            });
            TweenLite.to(this.bSpeed.mcBar, 0.4, {
                "width": 100 / CHAMPIONCAGEPOPUP._maxSpeed * _loc9_,
                "ease": Circ.easeInOut
            });
            TweenLite.to(this.bBuff.mcBar, 0.4, {
                "width": 100 / CHAMPIONCAGEPOPUP._maxBuff * _loc10_,
                "ease": Circ.easeInOut
            });
        }
    }

    private UpdateSelectImage(param1: string, param2: BitmapData): void {
        let _loc3_: number = this.selectedImage.numChildren;
        while (_loc3_--) {
            this.selectedImage.removeChildAt(_loc3_);
        }
        const _loc4_: Bitmap = new Bitmap(param2);
        this.selectedImage.addChild(_loc4_);
    }

    public Hide(param1: MouseEvent = null): void {
        CHAMPIONCHAMBER.Hide();
    }

    public Center(): void {
        POPUPSETTINGS.AlignToCenter(this);
    }

    public ScaleUp(): void {
        POPUPSETTINGS.ScaleUp(this);
    }
}

// Internal class
class ChampionSlot {
    public graphic: ChampionChamberFrozen;
    public championProperties: any;
    public championObject: any;
    public type: number;

    constructor() {
    }
}
