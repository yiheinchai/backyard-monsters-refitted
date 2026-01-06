import { ImageCache } from "com.monsters.display.ImageCache";
import { ResourceBombs } from "com.monsters.effects.ResourceBombs";
import { SiegeWeaponProperty } from "com.monsters.siege.SiegeWeaponProperty";
import { SiegeWeapons } from "com.monsters.siege.SiegeWeapons";
import { Decoy } from "com.monsters.siege.weapons.Decoy";
import { IDurable } from "com.monsters.siege.weapons.IDurable";
import { Jars } from "com.monsters.siege.weapons.Jars";
import { SiegeWeapon } from "com.monsters.siege.weapons.SiegeWeapon";
import { Vacuum } from "com.monsters.siege.weapons.Vacuum";
import { Bitmap } from "openfl/display/Bitmap";
import { BitmapData } from "openfl/display/BitmapData";
import { BlendMode } from "openfl/display/BlendMode";
import { DisplayObject } from "openfl/display/DisplayObject";
import { MovieClip } from "openfl/display/MovieClip";
import { Shape } from "openfl/display/Shape";
import { Sprite } from "openfl/display/Sprite";
import { MouseEvent } from "openfl/events/MouseEvent";
import { TimerEvent } from "openfl/events/TimerEvent";
import { ColorMatrixFilter } from "openfl/filters/ColorMatrixFilter";
import { GlowFilter } from "openfl/filters/GlowFilter";
import { Point } from "openfl/geom/Point";
import { Rectangle } from "openfl/geom/Rectangle";
import { Timer } from "openfl/utils/Timer";
import { TweenLite } from "gs/TweenLite";
import { Bounce, Sine, Circ, Linear } from "gs/easing";
import { SIEGEWEAPONPOPUP_view } from "./SIEGEWEAPONPOPUP_view";
import { GLOBAL } from "./GLOBAL";
import { KEYS } from "./KEYS";
import { UI2 } from "./UI2";
import { ATTACK } from "./ATTACK";
import { BASE } from "./BASE";
import { POPUPSETTINGS } from "./POPUPSETTINGS";
import { bubblepopupUpSiegeWeapon_CLIP } from "./bubblepopupUpSiegeWeapon_CLIP";
import { bmp_healthbarlarge } from "./bmp_healthbarlarge";

export class SIEGEWEAPONPOPUP extends SIEGEWEAPONPOPUP_view {
    private readonly DOES_USE_NEW_DISPLAY: boolean = true;
    private _t: Timer;
    private _open: boolean;
    private _items: Array<any>;
    private _currentImage: string;
    private _bm: Bitmap;
    private _canClose: boolean;
    public _currentSiegeWeapon: SiegeWeapon;
    public _state: number = 0;
    public _tooltip: MovieClip;
    private _healthBarSource: BitmapData;
    private _healthBar: BitmapData;
    private _healthBarBitmap: Bitmap;
    private _bmGreyScaled: Bitmap;
    private _mask: Shape;
    private _isWeaponFinished: boolean;
    private _imageContainer: Sprite;

    constructor() {
        super();
        this._healthBarSource = new bmp_healthbarlarge();
        this._healthBar = new BitmapData(50, 6, true, 0);
    }

    public static Format(param1: number, param2: boolean = false): string {
        let _loc3_: string = null;
        let _loc4_: string = null;
        if (param1 > 1000000) {
            _loc3_ = "" + param1 / 1000000;
            _loc4_ = param2 ? " " + KEYS.Get("bomb_million_long") : KEYS.Get("bomb_million_short");
            _loc3_ += _loc4_;
        } else {
            _loc3_ = GLOBAL.FormatNumber(param1);
        }
        return _loc3_;
    }

    public Setup(param1: boolean): void {
        this._iconbg.mouseChildren = false;
        this._image.mouseEnabled = false;
        this._image.mouseChildren = false;
        this._items = [];
        this._bar.alpha = 0;
        this._bar.timebar.visible = false;
        this._bar._tB.visible = false;
        this._bar._tB.htmlText = "";
        this.timeLeftMC.mouseEnabled = false;
        this.timeLeftMC.mouseChildren = false;
        this.timeLeftMC.alpha = 0;
        const _loc2_: number = 0;
        const _loc3_: number = 0;
        this._currentSiegeWeapon = SiegeWeapons.availableWeapon;
        if (this._currentSiegeWeapon == null) {
            UI2._top.ClearSiegeWeapon();
            return;
        }
        if (param1) {
            ImageCache.GetImageWithCallBack(SiegeWeapons.availableWeapon.image, this.onImageLoaded.bind(this));
            return;
        }
        this._iconbg.buttonMode = true;
        this._iconbg.addEventListener(MouseEvent.MOUSE_DOWN, this.Target.bind(this));
        this._iconbg.addEventListener(MouseEvent.MOUSE_OVER, this.ToolTipShow.bind(this));
        this._iconbg.addEventListener(MouseEvent.MOUSE_OUT, this.ToolTipHide.bind(this));
        this._t = new Timer(100, Number.MAX_VALUE);
        this._t.addEventListener(TimerEvent.TIMER, this.UpdateTimer.bind(this));
        this._t.start();
        this.Update();
    }

    public Cancel(): void {
        if (this._currentSiegeWeapon.quantity > 0 && this._state == 1) {
            this._state = 0;
            this.txtName.htmlText = "<b>\n" + KEYS.Get("siege_firebtn") + "</b>";
            TweenLite.to(this._bar, 0.3, { "autoAlpha": 0, "y": 23 });
            ATTACK.RemoveDropZone();
        }
        if (this._state <= 1) {
            this._t.stop();
        }
    }

    public UpdateTimer(param1: TimerEvent): void {
        this.Update();
    }

    public Update(): void {
        let _loc2_: number = NaN;
        let _loc3_: number = NaN;
        let _loc4_: number = 0;
        if (this._currentSiegeWeapon.image != this._currentImage) {
            ImageCache.GetImageWithCallBack(this._currentSiegeWeapon.image, this.onImageLoaded.bind(this));
        }
        if (this._state == 0) {
            this.txtName.htmlText = "<b>" + KEYS.Get("siege_firebtn") + "</b>";
            if (this._currentSiegeWeapon.canFire()) {
                if (this._currentSiegeWeapon.quantity <= 0) {
                    this._image.alpha = 0.5;
                } else {
                    this._image.alpha = 1;
                }
                TweenLite.to(this._bar, 0.3, { "autoAlpha": 0, "y": 23 });
            }
        } else if (this._state == 1) {
            this.txtName.htmlText = "<b><font color=\"#FF0000\">\n" + KEYS.Get("siege_cancelbtn") + "</font></b>";
            if (this._bar.parent) {
                this._bar.parent.setChildIndex(this._bar, this._bar.parent.numChildren - 1);
            }
            TweenLite.to(this._bar, 0.3, { "autoAlpha": 1, "y": 65, "ease": Bounce.easeOut });
            if (this._currentSiegeWeapon.weaponID == Decoy.ID) {
                this._bar._tA.htmlText = KEYS.Get("siege_target_ground");
            } else if (this._currentSiegeWeapon.weaponID == Jars.ID) {
                this._bar._tA.htmlText = KEYS.Get("siege_target_towers");
            } else {
                this._bar._tA.htmlText = KEYS.Get("siege_target_targets");
            }
            this._bar._tA.y = 12;
            this._bar._tB.y = this._bar.timebar.y;
            this._bar._tB.visible = false;
            this._bar.timebar.visible = false;
        } else if (this._state == 2) {
            if (this.DOES_USE_NEW_DISPLAY) {
                if (SiegeWeapons.activeWeapon) {
                    if (this._currentSiegeWeapon.duration) {
                        this.updateTimeRemaining();
                    }
                    if (this._currentSiegeWeapon instanceof IDurable) {
                        this.updateHealth();
                    }
                } else if (!this._isWeaponFinished) {
                    this.SiegeWeaponFinished();
                }
                this.txtName.visible = false;
            } else {
                _loc2_ = SiegeWeapons.getTimeRemaingOnActiveWeapon();
                _loc3_ = _loc2_ * 10 / 10;
                if (_loc2_ > 0) {
                    TweenLite.to(this._bar, 0.3, { "autoAlpha": 1, "y": 65, "ease": Sine.easeOut });
                    this._bar._tA.htmlText = this._currentSiegeWeapon.name;
                    this._bar._tA.y = 4;
                    _loc4_ = this._currentSiegeWeapon.duration;
                    if (_loc4_) {
                        this._bar.timebar.visible = true;
                        this._bar.timebar.alpha = 1;
                        this._bar.timebar.mcBar.width = 100 / _loc4_ * _loc2_;
                        this._bar._tB.visible = true;
                        this._bar._tB.htmlText = String(_loc3_);
                    } else {
                        this._bar.timebar.visible = false;
                        this._bar.timebar.alpha = 0;
                    }
                } else {
                    TweenLite.to(this._bar, 0.3, { "autoAlpha": 0, "y": 23, "ease": Circ.easeOut });
                    TweenLite.to(this._bar.timebar, 0.3, { "autoAlpha": 0 });
                    this._bar._tB.visible = false;
                }
            }
            TweenLite.to(this._bar, 0.3, { "autoAlpha": 0, "y": 23, "ease": Circ.easeOut });
        }
        const _loc1_: boolean = !this._currentSiegeWeapon.canFire();
        if (_loc1_) {
            TweenLite.to(this._bar, 0.3, { "autoAlpha": 0, "y": 23, "ease": Circ.easeOut });
            this._image.removeEventListener(MouseEvent.MOUSE_DOWN, this.Target.bind(this));
            TweenLite.to(this._image, 0.6, { "autoAlpha": 0.5 });
        }
    }

    private SiegeWeaponFinished(): void {
        if (this._currentSiegeWeapon.duration) {
            this.timeLeftMC.visible = false;
            TweenLite.killTweensOf(this._mask);
        }
        if (this._currentSiegeWeapon instanceof IDurable) {
            this._image.removeChild(this._healthBarBitmap);
        }
        this._mask.scaleY = 0;
        this._isWeaponFinished = true;
    }

    private updateHealth(): void {
        const _loc1_: number = (this._currentSiegeWeapon as any).activeDurability;
        if (_loc1_ <= 0) {
            this._healthBarBitmap.alpha = 0;
            return;
        }
        this._healthBarBitmap.alpha = 1;
        const _loc2_: number = this._currentSiegeWeapon.getProperty(SiegeWeapon.DURABILITY).getValueForLevel(this._currentSiegeWeapon.level);
        const _loc3_: number = 50;
        const _loc4_: number = 120;
        const _loc5_: number = 6;
        let _loc6_: number = (1 - _loc1_ / _loc2_) * _loc4_;
        _loc6_ = Math.round(_loc6_ / _loc5_) * _loc5_;
        this._healthBar.copyPixels(this._healthBarSource, new Rectangle(0, _loc6_, _loc3_, _loc5_), new Point(0, 0));
    }

    private updateTimeRemaining(): void {
        const _loc1_: number = SiegeWeapons.getTimeRemaingOnActiveWeapon();
        const _loc2_: number = _loc1_ < 10 ? 16711680 : 255;
        this.timeLeftMC.alpha = 1;
        this.timeLeftMC.timeLeftText.text = _loc1_ + "s";
        this.timeLeftMC.filters = [new GlowFilter(_loc2_)];
    }

    private bluificyImage(param1: DisplayObject): void {
        let _loc2_: Array<number> = [];
        _loc2_ = _loc2_.concat([2, 0, 0, 0, 0]);
        _loc2_ = _loc2_.concat([0, 2, 0, 0, 0]);
        _loc2_ = _loc2_.concat([0, 0, 3, 0, 0]);
        _loc2_ = _loc2_.concat([0, 0, 0, 1, 0]);
        param1.filters = [new ColorMatrixFilter(_loc2_)];
    }

    private desaturateImage(param1: DisplayObject): void {
        let _loc2_: Array<number> = [];
        _loc2_ = _loc2_.concat([0.33, 0.33, 0.33, 0.33, 0]);
        _loc2_ = _loc2_.concat([0.33, 0.33, 0.33, 0.33, 0]);
        _loc2_ = _loc2_.concat([0.33, 0.33, 0.33, 0.33, 0]);
        _loc2_ = _loc2_.concat([0.33, 0.33, 0.33, 1, 0]);
        param1.filters = [new ColorMatrixFilter(_loc2_)];
    }

    private onImageLoaded(param1: string, param2: BitmapData): void {
        if (this._bm) {
            if (this._bm.parent) {
                this._bm.parent.removeChild(this._bm);
            }
            this._bm = null;
        }
        this._imageContainer = new Sprite();
        this._bm = new Bitmap(param2);
        if (this.DOES_USE_NEW_DISPLAY) {
            this._bmGreyScaled = new Bitmap(param2);
            this.desaturateImage(this._bmGreyScaled);
            this._image.addChild(this._bmGreyScaled);
            this._mask = new Shape();
            this._mask.graphics.beginFill(255);
            this._mask.graphics.drawRect(0, -this._bm.height, this._bm.height, this._bm.width);
            this._mask.y = this._bm.height;
            this._image.addChild(this._mask);
            this._imageContainer.mask = this._mask;
            if (this._currentSiegeWeapon instanceof IDurable) {
                this._healthBarBitmap = new Bitmap(this._healthBar);
                this._healthBarBitmap.width = this._image.width;
                this._healthBarBitmap.y = this._image.height - 6;
            }
        }
        this._imageContainer.addChild(this._bm);
        this._image.addChild(this._imageContainer);
        if (this._healthBarBitmap) {
            this._image.addChild(this._healthBarBitmap);
        }
        this._currentImage = param1;
    }

    public Show(param1: MouseEvent = null): void {
        this.ZeroOutAttacks();
    }

    public Target(param1: MouseEvent = null): void {
        let _loc2_: boolean = false;
        if (this._state == 1) {
            this.Cancel();
        } else if (this._state == 0) {
            this.ZeroOutAttacks();
            if (this._currentSiegeWeapon.range > 0) {
                ATTACK.DropZone(this._currentSiegeWeapon.range, this._currentSiegeWeapon.dropTarget);
                _loc2_ = true;
                this._state = 1;
            } else {
                _loc2_ = SiegeWeapons.activateWeapon(this._currentSiegeWeapon.weaponID);
                if (_loc2_) {
                    this.HasFired();
                }
            }
            if (_loc2_) {
                this._t.start();
            }
        }
    }

    public ToolTipShow(param1: MouseEvent = null): void {
        let _loc6_: SiegeWeaponProperty = null;
        this._tooltip = new bubblepopupUpSiegeWeapon_CLIP();
        this._tooltip.x = -40;
        this._tooltip.y = 70;
        let _loc2_: string = "<b>" + this._currentSiegeWeapon.name + "</b>" + "<br>" + "<b>" + KEYS.Get("siege_tooltip_level", { "v1": this._currentSiegeWeapon.level }) + "</b>";
        const _loc3_: Array<SiegeWeaponProperty> = this._currentSiegeWeapon.getProperties();
        let _loc4_: string = "";
        if (BASE.isOutpost && !this._currentSiegeWeapon.canUseInOutposts) {
            _loc4_ += "<b>" + KEYS.Get("vacuum_nooutposts", { "v1": this._currentSiegeWeapon.name }) + "</b><br>";
        } else {
            _loc4_ += this._currentSiegeWeapon.tooltip;
        }
        _loc4_ += "<ul>";
        let _loc5_: number = 0;
        while (_loc5_ < _loc3_.length) {
            _loc6_ = _loc3_[_loc5_];
            _loc4_ += "<li>" + _loc6_.label + _loc6_.getDescription(this._currentSiegeWeapon.level) + "</li>";
            _loc5_++;
        }
        _loc4_ += "</ul>";
        this._tooltip.tTitle.htmlText = _loc2_;
        this._tooltip.tBody.htmlText = _loc4_;
        this.addChild(this._tooltip);
    }

    public ToolTipHide(param1: MouseEvent = null): void {
        if (Boolean(this._tooltip) && Boolean(this._tooltip.parent)) {
            this._tooltip.parent.removeChild(this._tooltip);
            this._tooltip = null;
        }
    }

    public Fire(param1: number, param2: number): void {
        let _loc3_: boolean = false;
        if (this._state == 1) {
            _loc3_ = SiegeWeapons.activateWeapon(this._currentSiegeWeapon.weaponID, param1, param2);
            if (!_loc3_) {
                return;
            }
            ATTACK.RemoveDropZone();
            this.HasFired();
        }
    }

    public HasFired(): void {
        let _loc1_: Shape = null;
        if (this._state < 2) {
            this._state = 2;
            this._image.mouseEnabled = false;
            if (!this.DOES_USE_NEW_DISPLAY) {
                TweenLite.to(this._image, 0.6, { "autoAlpha": 0.5 });
            } else if (this._currentSiegeWeapon.duration) {
                _loc1_ = new Shape();
                _loc1_.graphics.beginFill(52479);
                _loc1_.graphics.drawRect(0, 0, this._bm.height, this._bm.width);
                _loc1_.blendMode = BlendMode.OVERLAY;
                this.desaturateImage(this._bm);
                this._imageContainer.addChild(_loc1_);
                TweenLite.to(this._mask, this._currentSiegeWeapon.duration, { "scaleY": 0, "ease": Linear.easeNone });
            }
            this.Update();
        }
    }

    public ZeroOutAttacks(): void {
        let _loc1_: string = null;
        let _loc2_: any = undefined;
        for (_loc1_ in ATTACK._flingerBucket) {
            if (ATTACK._flingerBucket[_loc1_].Get() > 0) {
                ATTACK._curCreaturesAvailable[_loc1_].Add(ATTACK._flingerBucket[_loc1_].Get());
                ATTACK._flingerBucket[_loc1_].Set(0);
            }
        }
        for (_loc2_ of UI2._top._creatureButtons) {
            _loc2_.Update();
        }
        ATTACK.RemoveDropZone();
        ResourceBombs.BombRemove();
    }

    public Hide(): void {
        this._t.stop();
        this._t.removeEventListener(TimerEvent.TIMER, this.UpdateTimer.bind(this));
        this._open = false;
        this.Update();
    }

    public validate(): boolean {
        let _loc1_: boolean = true;
        switch (this._currentSiegeWeapon.weaponID) {
            case Vacuum.ID:
                _loc1_ = Boolean(GLOBAL.townHall) && GLOBAL.townHall._destroyed === false;
                this.enabled = _loc1_;
                break;
        }
        return _loc1_;
    }

    public Center(): void {
        POPUPSETTINGS.AlignToCenter(this);
    }

    public ScaleUp(): void {
        POPUPSETTINGS.ScaleUp(this);
    }
}
