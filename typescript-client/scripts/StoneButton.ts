import Bitmap from 'openfl/display/Bitmap';
import BitmapData from 'openfl/display/BitmapData';
import Sprite from 'openfl/display/Sprite';
import ColorTransform from 'openfl/geom/ColorTransform';
import Matrix from 'openfl/geom/Matrix';
import Point from 'openfl/geom/Point';
import Rectangle from 'openfl/geom/Rectangle';
import { ImageCache } from './com/monsters/display/ImageCache';
import { ImageText } from './com/monsters/display/ImageText';
import { KEYS } from './KEYS';
import { GLOBAL } from './GLOBAL';
import { ScaleBitmap } from './org/bytearray/display/ScaleBitmap';
import { button_alert } from './button_alert';

export class StoneButton extends Sprite {
    public static _bgKeys: any[] = [
        { "key": "ui/stone1.png", "width": 54, "height": 36 },
        { "key": "ui/stone2.png", "width": 59, "height": 36 },
        { "key": "ui/stone3.png", "width": 79, "height": 36 }
    ];

    public static _bgKeysInferno: any[] = [
        { "key": "ui/lava1.png", "width": 81, "height": 37 },
        { "key": "ui/lava2.png", "width": 61, "height": 37 },
        { "key": "ui/lava3.png", "width": 53, "height": 37 },
        { "key": "ui/lava4.png", "width": 55, "height": 37 }
    ];

    public _enabled: boolean = true;
    public _bmd: BitmapData;
    public _bm: Bitmap;
    public label: string;
    public size: number;
    public _alert: string = "";
    private _multiline: boolean = false;
    public spinnerInset: number = 7;
    public alertMC: button_alert;
    private _tgtWidth: number;
    public margin: number = 12;

    constructor() {
        super();
    }

    public getButtonWidth(): number {
        return this._tgtWidth;
    }

    public getButtonHeight(): number {
        let _loc1_ = 0;
        if (this._bm) {
            _loc1_ = this._bm.height;
        }
        return _loc1_;
    }

    public set Multiline(param1: boolean) {
        if (param1 != this._multiline) {
            this._multiline = param1;
            if (this.label && this.size) {
                this.Setup(this.label, this.size);
            }
        }
    }

    public get Multiline(): boolean {
        return this._multiline;
    }

    public set Enabled(param1: boolean) {
        if (param1 != this._enabled) {
            this._enabled = param1;
            this.Clear();
            if (this.label && this.size) {
                this.Setup(this.label, this.size);
            }
        }
    }

    public get Enabled(): boolean {
        return this._enabled;
    }

    public set Alert(param1: string) {
        if (param1 != "" && param1 != "0") {
            this._alert = param1;
            if (!this.alertMC) {
                this.alertMC = new button_alert();
                this.addChild(this.alertMC);
                this.alertMC.mouseChildren = false;
            } else {
                this.setChildIndex(this.alertMC, this.numChildren - 1);
            }
            this.alertMC.x = this.getButtonWidth() - this.spinnerInset;
            this.alertMC.y = this.spinnerInset;
            (this.alertMC.mcCounter as any).t.htmlText = param1;
        } else if (this.alertMC) {
            this.removeChild(this.alertMC);
            this.alertMC = null;
            this._alert = "";
        }
    }

    public get Alert(): string {
        return this._alert;
    }

    public Clear(): void {
        if (this._bmd && this._bm) {
            if (this._bm.parent) {
                this.removeChild(this._bm);
            }
            this._bmd.dispose();
        }
    }

    public SetupKey(param1: string, param2: number = 12): void {
        this.Setup(KEYS.Get(param1), param2);
    }

    public Setup(str: string, sz: number = 12): void {
        let tx: BitmapData = null;
        let ct: ColorTransform = null;

        const cbf = (param1: string, param2: BitmapData): void => {
            const _loc3_ = new BitmapData(param2.width, param2.height, true, 0);
            _loc3_.copyPixels(param2, new Rectangle(0, 0, param2.width, param2.height), new Point(0, 0));
            const _loc4_ = this._tgtWidth / _loc3_.width;
            const _loc5_ = new ScaleBitmap(_loc3_);
            _loc5_.scale9Grid = new Rectangle(10, 10, 10, 10);
            _loc5_.setSize(this._tgtWidth, 36);
            this._bmd = new BitmapData(_loc5_.width, _loc5_.height, true, 0);
            this._bmd.draw(_loc5_);
            const _loc6_ = new Matrix();
            _loc6_.translate(this.margin, 2 + Math.floor(_loc5_.height * 0.5 - tx.height * 0.5));
            this._bmd.draw(tx, _loc6_);
            this._bm = new Bitmap(this._bmd);
            this.addChild(this._bm);
        };

        this.Clear();
        this.label = str;
        this.size = sz;

        if (this._enabled) {
            this.buttonMode = true;
            this.useHandCursor = true;
            if (this.alertMC) {
                this.alertMC.buttonMode = true;
                this.alertMC.useHandCursor = true;
            }
        } else {
            this.buttonMode = false;
            this.useHandCursor = false;
        }

        tx = ImageText.Get(str, sz);
        if (!this._enabled) {
            ct = new ColorTransform(1, 1, 1, 0.5);
            tx.colorTransform(tx.rect, new ColorTransform(1, 1, 1, 0.5));
        }

        let tgt = 0;
        let tgtDiff = -1;
        this._tgtWidth = tx.width + 2 * this.margin;

        let imgArray = StoneButton._bgKeys;
        if (GLOBAL.InfernoMode()) {
            imgArray = StoneButton._bgKeysInferno;
        }

        for (let i = 0; i < imgArray.length; i++) {
            let nd = this._tgtWidth - imgArray[i].width;
            if (nd < 0) {
                nd *= -1;
            }
            if (tgtDiff == -1 || nd < tgtDiff) {
                tgtDiff = nd;
                tgt = i;
            }
        }

        ImageCache.GetImageWithCallBack(imgArray[tgt].key, cbf);
    }
}
