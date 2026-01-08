import { DisplayObjectContainer } from "openfl/display/DisplayObjectContainer";
import { Sprite } from "openfl/display/Sprite";
import { TimerEvent } from "openfl/events/TimerEvent";
import { Timer } from "openfl/utils/Timer";

import { TweenLite } from "gs/TweenLite";

/**
 * Ring - creates expanding ring effects for visual feedback.
 */
export class Ring extends Sprite {
    private static actives: Record<string, any> = {};

    constructor(lineWidth: number, color: number) {
        super();
        this.graphics.beginFill(0, 0);
        this.graphics.lineStyle(lineWidth, color);
        this.graphics.drawEllipse(-10, -10, 20, 20);
        this.graphics.endFill();
    }

    public static MakeRings(
        ringCount: number,
        duration: number,
        container: DisplayObjectContainer,
        x: number,
        y: number,
        endSize: number = 20,
        growTime: number = 1,
        ringWidth: number = 2,
        color: number = 65280
    ): void {
        const ringContainer: Sprite = new Sprite();
        ringContainer.x = x;
        ringContainer.y = y;
        container.addChild(ringContainer);
        const interval: number = 1000 * duration / ringCount;
        const timer: Timer = new Timer(interval, ringCount - 1);
        const timerId = timer.toString();
        Ring.actives[timerId] = {
            "color": color,
            "rc": 0,
            "make": ringCount,
            "container": ringContainer,
            "endSize": endSize,
            "growTime": growTime,
            "ringWidth": ringWidth,
            "timer": timer
        };
        timer.addEventListener(TimerEvent.TIMER, (event: TimerEvent) => Ring.onTimer(event, timerId));
        timer.start();
        Ring.onTimer(new TimerEvent(TimerEvent.TIMER), timerId);
    }

    private static onTimer(event: TimerEvent, timerId: string): void {
        const data: any = Ring.actives[timerId];
        if (Boolean(data) && data.rc++ < data.make) {
            const ring: Ring = new Ring(data.ringWidth, data.color);
            ring.width = 0;
            ring.height = 0;
            data.container.addChild(ring);
            TweenLite.to(ring, data.growTime, {
                "width": data.endSize,
                "height": data.endSize,
                "onComplete": ring.kill.bind(ring),
                "alpha": 0
            });
        } else if (Boolean(data)) {
            data.container.parent.removeChild(data.container);
            delete Ring.actives[timerId];
        }
    }

    public kill(): void {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
}
