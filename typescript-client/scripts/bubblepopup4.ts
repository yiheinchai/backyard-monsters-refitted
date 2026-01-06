import { TweenLite } from 'gs/TweenLite';
import { Elastic } from 'gs/easing';
import { bubblepopup4_CLIP } from './bubblepopup4_CLIP';
import { UI2 } from './UI2';

export class bubblepopup4 extends bubblepopup4_CLIP {
    constructor() {
        super();
        this.mouseEnabled = false;
        this.mouseChildren = false;
    }

    public Wobble(): void {
        this.alpha = 1;
        TweenLite.to(this, 0.6, {
            "x": 125,
            "ease": Elastic.easeOut,
            "onComplete": this.Delay.bind(this)
        });
    }

    public Delay(): void {
        TweenLite.to(this, 0.5, {
            "alpha": 0,
            "delay": 4,
            "onComplete": this.Remove.bind(this)
        });
    }

    public Remove(): void {
        try {
            UI2._top.OverchargeHide();
        } catch (e) {
        }
    }
}
