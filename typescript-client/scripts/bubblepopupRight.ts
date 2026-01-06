import { DropShadowFilter } from 'openfl/filters/DropShadowFilter';
import { Rectangle } from 'openfl/geom/Rectangle';
import { TextFieldAutoSize } from 'openfl/text/TextFieldAutoSize';
import { TweenLite } from 'gs/TweenLite';
import { Elastic } from 'gs/easing';
import { bubblepopupRight_CLIP } from './bubblepopupRight_CLIP';
import { GLOBAL } from './GLOBAL';

export class bubblepopupRight extends bubblepopupRight_CLIP {
    public _dropShadow: DropShadowFilter;

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

    public Setup(param1: number, param2: number, param3: string = "", param4: number = 0): void {
        this.mouseEnabled = false;
        this.mouseChildren = false;
        this.x = param1;
        this.y = param2;
        if (param3.length < 20) {
            this.mcBG.width = 80;
            this.mcText.width = 60;
        } else if (param3.length < 80) {
            this.mcBG.width = 150;
            this.mcText.width = 130;
        }
        if (param1 > 450) {
            this.mcBG.x = Math.floor(0 - (this.mcBG.width - 25));
        } else {
            this.mcBG.x = Math.floor(0 - this.mcBG.width / 2);
        }
        this.mcText.x = Math.floor(this.mcBG.x + 10);
        if (param3) {
            this.Update(param3);
        }
    }

    public Update(param1: string, param2: number = 1): void {
        this.mcText.htmlText = param1;
        this.mcText.width = 20;
        while (this.mcText.height > 20 * param2) {
            this.mcText.width += 2;
        }
        this.mcBG.width = this.mcText.width + 16;
        this.mcText.y = Math.floor(0 - this.mcText.height / 2);
        this.mcBG.height = Math.floor(this.mcText.height + 6);
        this.mcBG.y = Math.floor(this.mcText.y - 3);
        this.mcBG.x = -Math.floor(this.mcBG.width + 8);
        const _loc3_ = GLOBAL._ROOT.stage.stageWidth;
        const _loc4_ = GLOBAL.GetGameHeight();
        const _loc5_ = new Rectangle(0 - (_loc3_ - 760) / 2, 0 - (_loc4_ - 520) / 2, _loc3_, _loc4_);
        if (this.x + this.mcBG.x < _loc5_.x + 10) {
            this.mcBG.x = Math.floor(_loc5_.x - this.x + 10);
        }
        if (this.x + this.mcBG.x + this.mcBG.width > _loc5_.x + _loc5_.width - 10) {
            this.mcBG.x = Math.floor(_loc5_.x + _loc5_.width - this.x - 10 - this.mcBG.width);
        }
        this.mcText.x = Math.floor(this.mcBG.x + 8);
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
        } else if (param1 == "left") {
            this.x += 3;
            TweenLite.to(this, 0.6, {
                "y": this.y - 3,
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

    public Clear(): void {
    }
}
