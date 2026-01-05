import { bubblepopup4_CLIP } from './bubblepopup4_CLIP';
// import { UI2 } from './UI2'; // Dependent on UI2 conversion
// import gs.TweenLite; // TODO: Replace TweenLite
// import gs.easing.Elastic; // TODO: Replace easing

/**
 * bubblepopup4 - Animated bubble popup
 * Handles Wobble animation and removal
 * Converted from ActionScript to TypeScript
 */
export class bubblepopup4 extends bubblepopup4_CLIP {

    constructor() {
        super();
        this.mouseEnabled = false;
        this.mouseChildren = false;
    }

    public Wobble(): void {
        this.alpha = 1;
        // TweenLite.to(this, 0.6, { "x": 125, "ease": Elastic.easeOut, "onComplete": this.Delay });
        // Temporary replacement or stub
        this.x = 125;
        this.Delay();
    }

    public Delay(): void {
        // TweenLite.to(this, 0.5, { "alpha": 0, "delay": 4, "onComplete": this.Remove });
        // Temporary replacement or stub
        setTimeout(() => {
            this.alpha = 0;
            this.Remove();
        }, 4000); 
    }

    public Remove(): void {
        try {
            // UI2._top.OverchargeHide();
            // TODO: Uncomment when UI2 is converted
            console.warn("UI2.OverchargeHide() call stubbed in bubblepopup4");
        } catch (e: any) {
        }
    }
}
