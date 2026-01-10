import InteractiveObject from "openfl/display/InteractiveObject";
import Stage from "openfl/display/Stage";
import MouseEvent from "openfl/events/MouseEvent";
import ExternalInterface from "openfl/external/ExternalInterface";
import getTimer from "openfl/utils/getTimer";

import { BrowserInfo } from "./BrowserInfo";
import { MouseWheelEnabler_JavaScript } from "./MouseWheelEnabler_JavaScript";

/**
 * MouseWheelEnabler - Enables mouse wheel support for Flash in browsers.
 */
export class MouseWheelEnabler {
    private static initialised: boolean = false;
    private static currentItem: InteractiveObject | null = null;
    private static browserMouseEvent: MouseEvent | null = null;
    private static lastEventTime: number = 0;
    public static useRawValues: boolean = false;
    public static eventTimeout: number = 50;

    constructor() { }

    public static init(stage: Stage, useRawValues: boolean = false): void {
        if (!MouseWheelEnabler.initialised) {
            MouseWheelEnabler.initialised = true;
            console.log("init mousewheel");
            MouseWheelEnabler.registerListenerForMouseMove(stage);
            MouseWheelEnabler.registerJS();
        }
        MouseWheelEnabler.useRawValues = useRawValues;
    }

    private static registerListenerForMouseMove(stage: Stage): void {
        stage.addEventListener(MouseEvent.MOUSE_MOVE, (event: MouseEvent) => {
            MouseWheelEnabler.currentItem = event.target as InteractiveObject;
            MouseWheelEnabler.browserMouseEvent = event;
        });
    }

    private static registerJS(): void {
        if (ExternalInterface.available) {
            const id = "mws_" + Math.floor(Math.random() * 1000000);
            ExternalInterface.addCallback(id, () => { });
            ExternalInterface.call(MouseWheelEnabler_JavaScript.CODE);
            ExternalInterface.call("mws.InitMouseWheelSupport", id);
            ExternalInterface.addCallback("externalMouseEvent", MouseWheelEnabler.handleExternalMouseEvent);
        }
    }

    private static handleExternalMouseEvent(rawDelta: number, scaledDelta: number): void {
        const currentTime = getTimer();
        if (currentTime >= MouseWheelEnabler.eventTimeout + MouseWheelEnabler.lastEventTime) {
            const delta = MouseWheelEnabler.useRawValues ? rawDelta : scaledDelta;
            if (Boolean(MouseWheelEnabler.currentItem) && Boolean(MouseWheelEnabler.browserMouseEvent)) {
                MouseWheelEnabler.currentItem!.dispatchEvent(new MouseEvent(
                    MouseEvent.MOUSE_WHEEL, true, false,
                    MouseWheelEnabler.browserMouseEvent!.localX, MouseWheelEnabler.browserMouseEvent!.localY,
                    MouseWheelEnabler.browserMouseEvent!.relatedObject,
                    MouseWheelEnabler.browserMouseEvent!.ctrlKey, MouseWheelEnabler.browserMouseEvent!.altKey,
                    MouseWheelEnabler.browserMouseEvent!.shiftKey, MouseWheelEnabler.browserMouseEvent!.buttonDown,
                    Math.floor(delta)
                ));
            }
            MouseWheelEnabler.lastEventTime = currentTime;
        }
    }

    public static getBrowserInfo(): BrowserInfo | null {
        if (ExternalInterface.available) {
            const browser = ExternalInterface.call("mws.getBrowserInfo");
            const platform = ExternalInterface.call("mws.getPlatformInfo");
            const agent = ExternalInterface.call("mws.getAgentInfo");
            return new BrowserInfo(browser, platform, agent);
        }
        return null;
    }
}
