import Event from "openfl/events/Event";

import { ABTest } from "../../cc/tests/ABTest";
import { FrontPageGraphic } from "../frontPage/FrontPageGraphic";
import { DebugMessage } from "../frontPage/messages/DebugMessage";
import { Message } from "../frontPage/messages/Message";
import { UI_BOTTOM } from "../ui/UI_BOTTOM";
import { IReplayableEventUI } from "./IReplayableEventUI";
import { ReplayableEvent } from "./ReplayableEvent";
import { ReplayableEventLibrary } from "./ReplayableEventLibrary";
import { ReplayableEventUI } from "./ReplayableEventUI";

// Lazy imports to break circular dependency chains
function getConsole(): any { return require("../debug/Console").Console; }
function getBASE(): any { return require("../../../BASE").BASE; }
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }
function getLOGGER(): any { return require("../../../LOGGER").LOGGER; }
function getPOPUPS(): any { return require("../../../POPUPS").POPUPS; }
function getTUTORIAL(): any { return require("../../../TUTORIAL").TUTORIAL; }
function getUI2(): any { return require("../../../UI2").UI2; }
function getURLLoaderApi(): any { return require("../../../URLLoaderApi").URLLoaderApi; }



/**
 * ReplayableEventHandler - manages replayable events lifecycle.
 */
export class ReplayableEventHandler {
    public static debugDate: Date = new Date();
    public static doesDebugClear: boolean = false;
    public static activeEvent: ReplayableEvent | null = null;
    private static _graphic: IReplayableEventUI | null = null;

    public static readonly k_DURATION_STORE_IS_OPEN_AFTER_EVENT: number = 172800;
    public static readonly DURATION_UNTIL_EVENT_STARTS: number = 604800;
    private static readonly _DURATION_UNTIL_EVENT_RESET: number = Number.MAX_VALUE;
    private static readonly _DURATION_BETWEEN_EVENTS: number = 1209600;
    public static readonly DURATION_REQUIRED_TO_CONFIRM_EVENT: number = 259200;
    public static eventXP: number = 0;

    constructor() {
    }

    public static get currentTime(): number {
        if (Boolean(ReplayableEventHandler.debugDate) && getGLOBAL()._aiDesignMode) {
            return ReplayableEventHandler.debugDate.getTime() / 1000;
        }
        return getGLOBAL().Timestamp();
    }

    public static initialize(data: Record<string, any> | null = null): void {
        if (getGLOBAL().isAtHome() && getTUTORIAL().hasFinished) {
            if (data) {
                ReplayableEventHandler.importData(data);
            }
            if (ReplayableEventHandler.activeEvent) {
                ReplayableEventHandler.activeEvent.initialize();
                ReplayableEventHandler.checkIfActiveEventIsFinished();
            } else if (ReplayableEventHandler.canScheduleNewEvent()) {
                const qualifiedEvent = ReplayableEventHandler.getQualifiedEvent();
                if (qualifiedEvent) {
                    const startDate = ReplayableEventHandler.getPotentialStartDateForEvent(qualifiedEvent);
                    if (startDate) {
                        ReplayableEventHandler.scheduleNewEvent(qualifiedEvent, startDate);
                        ReplayableEventHandler.activeEvent!.initialize();
                    }
                }
            }
        }
        ReplayableEventHandler.addUI();
    }

    public static updateDebugDate(time: number = 0): void {
        if (time) {
            ReplayableEventHandler.debugDate.setTime(time);
        }
        getBASE().Save();
        getUI2().DebugWarningEdit(ReplayableEventHandler.debugDate.toDateString());
        if (ReplayableEventHandler.activeEvent) {
            const message = ReplayableEventHandler.activeEvent.getCurrentMessage();
            if (message && !message.hasBeenSeen && !(message instanceof DebugMessage)) {
                getPOPUPS().Push(new FrontPageGraphic(message));
                message.viewed();
            }
            ReplayableEventHandler.checkIfActiveEventIsFinished();
        }
    }

    private static checkIfActiveEventIsFinished(): void {
        if (Boolean(ReplayableEventHandler.activeEvent) && (ReplayableEventHandler.activeEvent!.hasEventEnded || ReplayableEventHandler.activeEvent!.hasCompletedEvent)) {
            getLOGGER().StatB({ "st1": "ERS", "st2": ReplayableEventHandler.activeEvent!.name }, "event_end");
            const message = ReplayableEventHandler.activeEvent!.getCurrentMessage();
            if (message && !message.hasBeenSeen && !(message instanceof DebugMessage)) {
                getPOPUPS().Push(new FrontPageGraphic(message));
                message.viewed();
            }
            if (ReplayableEventHandler.activeEvent!.endDate - ReplayableEventHandler.currentTime >= ReplayableEventHandler.k_DURATION_STORE_IS_OPEN_AFTER_EVENT) {
                if (ReplayableEventHandler._graphic) {
                    ReplayableEventHandler.removeUI();
                }
                ReplayableEventHandler.activeEvent = null;
            }
        }
    }

    public static scheduleNewEvent(event: ReplayableEvent, startDate: number): void {
        if (event.startDate) {
            event.reset();
        }
        event.setStartDate(startDate);
        ReplayableEventHandler.callServerMethod("startevent", [["eventid", event.id], ["starttime", event.startDate], ["endtime", event.endDate]], ReplayableEventHandler.startEventCallback);
        getLOGGER().StatB({ "st1": "ERS", "st2": event.name }, "event_start");
        ReplayableEventHandler.activeEvent = event;
    }

    public static callServerMethod(method: string, params: Array<Array<any>>, callback: Function | null = null): void {
        const loader = new (getURLLoaderApi())();
        loader.load(getGLOBAL()._apiURL + "bm/event/" + method, params, callback);
    }

    protected static startEventCallback(response: Record<string, any>): void {
        const data = response;
    }

    private static addUI(): void {
        if (!ReplayableEventHandler.activeEvent || !ReplayableEventHandler.activeEvent.doesQualify()) {
            return;
        }
        ReplayableEventHandler._graphic = ReplayableEventHandler.activeEvent.createNewUI();
        ReplayableEventHandler._graphic.setup(ReplayableEventHandler.activeEvent);
        ReplayableEventHandler._graphic.addEventListener(Event.ENTER_FRAME, ReplayableEventHandler.update, false, 0, true);
        ReplayableEventHandler._graphic.addEventListener(ReplayableEventUI.CLICKED_ACTION, ReplayableEventHandler.pressedActionButton, false, 0, true);
        ReplayableEventHandler._graphic.addEventListener(ReplayableEventUI.CLICKED_INFO, ReplayableEventHandler.pressedInfoButton, false, 0, true);
        UI_BOTTOM.addChild(ReplayableEventHandler._graphic.eventUI);
    }

    private static removeUI(): void {
        if (!ReplayableEventHandler._graphic) {
            return;
        }
        ReplayableEventHandler._graphic.removeEventListener(Event.ENTER_FRAME, ReplayableEventHandler.update);
        ReplayableEventHandler._graphic.removeEventListener(ReplayableEventUI.CLICKED_ACTION, ReplayableEventHandler.pressedActionButton);
        ReplayableEventHandler._graphic.removeEventListener(ReplayableEventUI.CLICKED_INFO, ReplayableEventHandler.pressedInfoButton);
        UI_BOTTOM.removeChild(ReplayableEventHandler._graphic.eventUI);
    }

    private static update(event: Event): void {
        ReplayableEventHandler._graphic!.update();
        if (ReplayableEventHandler.activeEvent) {
            ReplayableEventHandler.activeEvent.update();
        }
        ReplayableEventHandler.checkIfActiveEventIsFinished();
    }

    private static pressedActionButton(event: Event): void {
        ReplayableEventHandler.activeEvent!.pressedActionButton();
    }

    private static pressedInfoButton(event: Event): void {
        const message = ReplayableEventHandler.activeEvent!.pressedHelpButton();
        if (message) {
            message.refresh();
            const graphic = new FrontPageGraphic(message);
            getPOPUPS().Push(graphic);
        }
    }

    public static getPotentialStartDateForEvent(event: ReplayableEvent): number {
        if (Boolean(event.originalStartDate) && event.originalStartDate - ReplayableEventHandler.currentTime <= ReplayableEventHandler.DURATION_UNTIL_EVENT_STARTS) {
            return event.originalStartDate;
        }
        const dayDuration = 86400;
        let checkTime = ReplayableEventHandler.currentTime;
        for (let i = 0; i < 7; i++) {
            checkTime += dayDuration;
            const date = new Date(checkTime * 1000);
            if (date.getDay() === 4) {
                const startOfDay = new Date(checkTime * 1000);
                startOfDay.setHours(12, 0, 0, 0);
                const adjustedTime = startOfDay.getTime() / 1000;
                const duration = adjustedTime - ReplayableEventHandler.currentTime;
                if (!ReplayableEventHandler.hasQualifiedLiveEventSoonAfter(adjustedTime) && duration < ReplayableEventHandler.DURATION_UNTIL_EVENT_STARTS && duration > ReplayableEventHandler.DURATION_REQUIRED_TO_CONFIRM_EVENT) {
                    return adjustedTime;
                }
            }
        }
        return 0;
    }

    private static canScheduleNewEvent(): boolean {
        if (!getGLOBAL()._flags["ers"]) {
            return false;
        }
        return Boolean(ReplayableEventHandler.getQualifiedLiveEvent()) || !ReplayableEventHandler.hasRecentlyParticipatedInAnEvent() && ABTest.isInTestGroup("ers", 205);
    }

    private static getQualifiedLiveEvent(): ReplayableEvent | null {
        for (let i = 0; i < ReplayableEventLibrary.EVENTS.length; i++) {
            const event = ReplayableEventLibrary.EVENTS[i];
            if (event.originalStartDate && ReplayableEventHandler.currentTime < event.originalStartDate && event.originalStartDate - ReplayableEventHandler.currentTime <= ReplayableEventHandler.DURATION_UNTIL_EVENT_STARTS) {
                return event;
            }
        }
        return null;
    }

    private static hasQualifiedLiveEventSoonAfter(startDate: number): boolean {
        for (let i = 0; i < ReplayableEventLibrary.EVENTS.length; i++) {
            const event = ReplayableEventLibrary.EVENTS[i];
            if (event.originalStartDate && event.originalStartDate >= startDate && event.originalStartDate - startDate <= ReplayableEventHandler._DURATION_BETWEEN_EVENTS) {
                return true;
            }
        }
        return false;
    }

    private static hasRecentlyParticipatedInAnEvent(): boolean {
        for (let i = 0; i < ReplayableEventLibrary.EVENTS.length; i++) {
            const event = ReplayableEventLibrary.EVENTS[i];
            if (Boolean(event.endDate) && ReplayableEventHandler.currentTime - event.endDate <= ReplayableEventHandler._DURATION_BETWEEN_EVENTS) {
                return true;
            }
        }
        return false;
    }

    public static getQualifiedEvent(): ReplayableEvent | null {
        const qualified: Array<ReplayableEvent> = [];
        for (let i = 0; i < ReplayableEventLibrary.EVENTS.length; i++) {
            const event = ReplayableEventLibrary.EVENTS[i];
            if (event.doesQualify() && !event.startDate) {
                qualified.push(event);
            }
        }
        qualified.sort(ReplayableEventHandler.comparePriority);
        if (qualified.length >= 1) {
            return qualified[0];
        }
        return null;
    }

    private static comparePriority(a: ReplayableEvent, b: ReplayableEvent): number {
        return b.priority - a.priority;
    }

    public static exportData(): Record<string, any> | null {
        let hasData = false;
        if (ReplayableEventHandler.doesDebugClear) {
            ReplayableEventHandler.doesDebugClear = false;
            return {};
        }
        if (getGLOBAL().mode !== getGLOBAL().e_BASE_MODE.BUILD || getBASE().isInfernoMainYardOrOutpost) {
            return null;
        }
        const result: Record<string, any> = {};
        for (let i = 0; i < ReplayableEventLibrary.EVENTS.length; i++) {
            const event = ReplayableEventLibrary.EVENTS[i];
            const eventData = event.exportData();
            if (eventData) {
                result[event.name] = eventData;
                hasData = true;
            }
        }
        if (ReplayableEventHandler.debugDate) {
            result.debugDate = ReplayableEventHandler.debugDate.getTime();
            hasData = true;
        }
        if (ReplayableEventHandler.activeEvent) {
            result.activeEvent = ReplayableEventHandler.activeEvent.id;
            hasData = true;
        }
        return hasData ? result : null;
    }

    public static importData(data: Record<string, any>): void {
        for (const key in data) {
            const event = ReplayableEventLibrary.getEventByName(key);
            if (event) {
                event.importData(data[key]);
            }
        }
        if (data.debugDate) {
            ReplayableEventHandler.debugDate = new Date(data.debugDate);
        }
        if (data.activeEvent) {
            ReplayableEventHandler.activeEvent = ReplayableEventLibrary.getEventByID(data.activeEvent);
        }
    }

    public static optInForEventEmails(): void {
        if (!ReplayableEventHandler.activeEvent) {
            getConsole().warning("You're trying to opt-in for an event that isnt currently running, something is fucked");
            return;
        }
        ReplayableEventHandler.callServerMethod("emailoptin", [["eventid", ReplayableEventHandler.activeEvent.id]]);
    }
}
