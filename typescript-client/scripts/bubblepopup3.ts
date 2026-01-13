import DropShadowFilter from 'openfl/filters/DropShadowFilter';
import TextFieldAutoSize from 'openfl/text/TextFieldAutoSize';
import { TweenLite } from 'gs/TweenLite';
import { Elastic } from 'gs/easing';
import { bubblepopup3_CLIP } from './bubblepopup3_CLIP';

export class bubblepopup3 extends bubblepopup3_CLIP {
    private _dropShadow: DropShadowFilter;
    private _fixedrowcount: number = 0;

    constructor() {
        super();
        this._dropShadow = new DropShadowFilter();
        this._dropShadow.distance = 1;
        this._dropShadow.angle = 45;
        this._dropShadow.color = 0;
        this._dropShadow.alpha = 1;
        this._dropShadow.blurX = 3;
        this._dropShadow.blurY = 3;
        this._dropShadow.strength = 1;
        this._dropShadow.quality = 2;
        this.filters = [this._dropShadow];
        this.mcText.autoSize = TextFieldAutoSize.CENTER;
    }

    public Setup(param1: number, param2: number, param3: string, param4: number = 0): void {
        this._fixedrowcount = param4;
        this.mouseEnabled = false;
        this.mouseChildren = false;
        this.x = param1;
        this.y = param2;
        this.Update(param3);
    }

    public Update(param1: any): void {
        this.mcText.autoSize = TextFieldAutoSize.LEFT;
        this.mcText.htmlText = param1;
        if (this._fixedrowcount > 0) {
            this.mcText.width = 80;
            while (this.mcText.height > 18 * this._fixedrowcount) {
                this.mcText.width += 2;
            }
            this.mcBG.width = this.mcText.width + 12;
        }
        this.mcBG.height = this.mcText.height + 10;
        this.mcBG.y = -Math.floor(this.mcBG.height * 0.5);
        this.mcText.y = this.mcBG.y + 5;
    }

    public Wobble(): void {
        this.rotation += 3;
        TweenLite.to(this, 0.6, {
            "rotation": this.rotation - 3,
            "ease": Elastic.easeOut
        });
    }

    public Nudge(param1: string): void {
        if (param1 == "up") {
            this.y -= 3;
            TweenLite.to(this, 0.6, {
                "y": this.y + 3,
                "ease": Elastic.easeOut
            });
        } else {
            this.x -= 3;
            TweenLite.to(this, 0.6, {
                "y": this.x + 3,
                "ease": Elastic.easeOut
            });
        }
    }
}
