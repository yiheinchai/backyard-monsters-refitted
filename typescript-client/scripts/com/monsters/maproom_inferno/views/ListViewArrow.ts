import { Event } from "openfl/events/Event";

import { ListViewArrow_CLIP } from "../../maproom/views/ListViewArrow_CLIP";

import { TweenLite } from "gs/TweenLite";
import { Bounce } from "gs/easing/Bounce";
import { Expo } from "gs/easing/Expo";

/**
 * List view arrow (Inferno) - animated arrow for list navigation in inferno map room.
 */
export class ListViewArrow extends ListViewArrow_CLIP {
    public offsetX: number = 0;
    public offsetY: number = 0;
    public wobbleCountdown: number = 0;
    public active: boolean = false;

    constructor() {
        super();
        this.addEventListener(Event.ENTER_FRAME, this.Wobble.bind(this));
    }

    public Trigger(isActive: boolean = false): void {
        this.active = isActive;
        if (this.active) {
            this.buttonMode = true;
            this.mcArrow.gotoAndStop(2);
        } else {
            this.buttonMode = false;
            this.mcArrow.gotoAndStop(1);
        }
    }

    public Wobble(event: Event): void {
        if (this.active) {
            if (this.wobbleCountdown === 0) {
                this.wobbleCountdown = 80;
                this.mcArrow.x = -15;
                TweenLite.to(this.mcArrow, 0.6, {
                    "x": -20,
                    "ease": Expo.easeInOut,
                    "onComplete": this.WobbleB.bind(this)
                });
            }
            --this.wobbleCountdown;
        }
    }

    private WobbleB(): void {
        TweenLite.to(this.mcArrow, 0.6, {
            "x": -15,
            "ease": Bounce.easeOut
        });
    }
}
