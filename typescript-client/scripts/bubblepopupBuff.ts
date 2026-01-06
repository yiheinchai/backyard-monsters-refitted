import { DropShadowFilter } from 'openfl/filters/DropShadowFilter';
import { TextFieldAutoSize } from 'openfl/text/TextFieldAutoSize';
import { TweenLite } from 'gs/TweenLite';
import { Elastic } from 'gs/easing';
import { bubblepopupUpBuff_CLIP } from './bubblepopupUpBuff_CLIP';

export class bubblepopupBuff extends bubblepopupUpBuff_CLIP {
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

    public Setup(param1: number, param2: number, param3: string = "", param4: string = "", param5: number = 0): void {
        this.mouseEnabled = false;
        this.mouseChildren = false;
        if (param3) {
            this.Update(param3, param4);
        }
    }

    public Update(param1: string, param2: string, param3: number = 1): void {
        this.mcText.htmlText = param1;
        this.mcTextDuration.htmlText = param2;
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

    public Cleanup(): void {
        if (this._dropShadow) {
            this.filters = [];
            this._dropShadow = null;
        }
    }

    public Clear(): void {
    }
}
