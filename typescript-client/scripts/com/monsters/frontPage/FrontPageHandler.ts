import DisplayObject from "openfl/display/DisplayObject";
import Event from "openfl/events/Event";

import { Category } from "./categories/Category";
import { FrontPageEvent } from "./events/FrontPageEvent";
import { FrontPageGraphic } from "./FrontPageGraphic";
import { FrontPageLibrary } from "./FrontPageLibrary";
import { Message } from "./messages/Message";

import { BASE } from "../../../BASE";
import { BUILDINGS } from "../../../BUILDINGS";
import { BUILDINGOPTIONS } from "../../../BUILDINGOPTIONS";
import { GLOBAL } from "../../../GLOBAL";
import { INFERNO_EMERGENCE_EVENT } from "../../../INFERNO_EMERGENCE_EVENT";
import { LOGGER } from "../../../LOGGER";
import { POPUPS } from "../../../POPUPS";
import { TUTORIAL } from "../../../TUTORIAL";
import { News } from "./categories/News";

/**
 * Front page handler - manages front page popup display and navigation.
 */
export class FrontPageHandler {
    private static _graphic: FrontPageGraphic | null = null;
    private static _activeCategory: Category | null = null;
    private static _activeMessage: Message | null = null;
    private static _qualifiedCategories: Array<Category> | null = null;
    private static _messagesSeen: Array<Message> = [];
    private static _timeSpentViewing: number = 0;
    private static _hasBeenSeenThisSession: boolean = false;
    private static _hasBeenSetupThisSession: boolean = false;

    constructor() {}

    public static get isVisible(): boolean {
        return FrontPageHandler._graphic !== null;
    }

    public static get hasBeenSeenThisSession(): boolean {
        return FrontPageHandler._hasBeenSeenThisSession;
    }

    public static get hasBeenSetupThisSession(): boolean {
        return FrontPageHandler._hasBeenSetupThisSession;
    }

    public static set activeCategory(category: Category) {
        FrontPageHandler._activeCategory = category;
        if (FrontPageHandler._graphic && FrontPageHandler._qualifiedCategories) {
            FrontPageHandler._graphic.updateCategories(FrontPageHandler._activeCategory, FrontPageHandler._qualifiedCategories);
            FrontPageHandler._graphic.mcNew.alpha = category instanceof News ? 1 : 0;
            if (FrontPageHandler._qualifiedCategories.length > 1) {
                FrontPageHandler._graphic.bNext.visible = true;
                FrontPageHandler._graphic.bPrev.visible = true;
            }
        }
        FrontPageHandler.activeMessage = FrontPageHandler._activeCategory.getNextQualifiedMessage();
    }

    public static set activeMessage(message: Message | null) {
        FrontPageHandler._activeMessage = message;
        if (FrontPageHandler._graphic && FrontPageHandler._activeMessage) {
            FrontPageHandler._graphic.showMessage(message);
            FrontPageHandler._messagesSeen.push(FrontPageHandler._activeMessage);
        }
    }

    public static interupt(): void {
        FrontPageHandler.closedPopup();
        POPUPS.Next();
    }

    public static initialize(data: any = null): void {
        FrontPageLibrary.initialize();
        if (data) {
            FrontPageHandler.setup(data);
        }
    }

    public static showPopup(force: boolean = false): boolean {
        if (GLOBAL.mode !== GLOBAL.e_BASE_MODE.BUILD || BASE.isOutpost || !TUTORIAL.hasFinished || 
            FrontPageHandler._hasBeenSeenThisSession || !BASE.isMainYard || INFERNO_EMERGENCE_EVENT.isGoingToAttack) {
            return false;
        }
        
        if ((FrontPageHandler._graphic && !force) || !FrontPageHandler.updateQualifiedCategories()) {
            return false;
        }
        
        if (FrontPageHandler._graphic) {
            const oldGraphic = FrontPageHandler._graphic as DisplayObject;
            FrontPageHandler.closedPopup();
            POPUPS.Remove(oldGraphic);
        }
        
        FrontPageHandler._graphic = new FrontPageGraphic();
        FrontPageHandler._graphic.addEventListener(FrontPageEvent.NEXT, FrontPageHandler.nextCategory);
        FrontPageHandler._graphic.addEventListener(FrontPageEvent.PREVIOUS, FrontPageHandler.previousCategory);
        FrontPageHandler._graphic.addEventListener(FrontPageEvent.CHANGE_CATEGORY, FrontPageHandler.changeCategory);
        FrontPageHandler._graphic.addEventListener(Event.REMOVED_FROM_STAGE, FrontPageHandler.closedPopup);
        
        FrontPageHandler._messagesSeen = [];
        FrontPageHandler._timeSpentViewing = GLOBAL.Timestamp();
        FrontPageHandler.activeCategory = FrontPageHandler._qualifiedCategories![0];
        
        POPUPS.Push(FrontPageHandler._graphic, null, null, null, null, false, "wait");
        FrontPageHandler._hasBeenSeenThisSession = true;
        return true;
    }

    private static closedPopup(e: Event | null = null): void {
        if (!FrontPageHandler._graphic) return;
        
        FrontPageHandler._graphic.removeEventListener(FrontPageEvent.NEXT, FrontPageHandler.nextCategory);
        FrontPageHandler._graphic.removeEventListener(FrontPageEvent.PREVIOUS, FrontPageHandler.previousCategory);
        FrontPageHandler._graphic.removeEventListener(FrontPageEvent.CHANGE_CATEGORY, FrontPageHandler.changeCategory);
        FrontPageHandler._graphic.removeEventListener(Event.REMOVED_FROM_STAGE, FrontPageHandler.closedPopup);
        FrontPageHandler._graphic = null;
        
        if (e) {
            const timeSpent = GLOBAL.Timestamp() - FrontPageHandler._timeSpentViewing;
            LOGGER.StatB({
                st1: "GTP",
                st2: "time",
                value: GLOBAL.Timestamp() - FrontPageHandler._timeSpentViewing
            }, "time_seen");
            FrontPageHandler.save();
        }
    }

    private static save(): void {
        for (let i = 0; i < FrontPageHandler._messagesSeen.length; i++) {
            const message = FrontPageHandler._messagesSeen[i];
            message.viewed();
            message.category.lastMessageSeen = message;
            LOGGER.StatB({
                st1: "GTP",
                st2: "View"
            }, message.name);
        }
        BASE.Save();
    }

    public static refresh(): void {
        if (FrontPageHandler.updateQualifiedCategories()) {
            FrontPageHandler.activeCategory = FrontPageHandler._qualifiedCategories![0];
        }
    }

    protected static updateQualifiedCategories(): Array<Category> | null {
        FrontPageHandler._qualifiedCategories = [];
        
        for (let i = 0; i < FrontPageLibrary.CATEGORIES.length; i++) {
            const category = FrontPageLibrary.CATEGORIES[i];
            const message = category.getNextQualifiedMessage();
            if (message) {
                FrontPageHandler._qualifiedCategories.push(category);
            }
        }
        
        if (FrontPageHandler._qualifiedCategories.length === 0) {
            FrontPageHandler._qualifiedCategories = null;
        }
        return FrontPageHandler._qualifiedCategories;
    }

    protected static changeCategory(e: FrontPageEvent): void {
        const category = e.category;
        if (category === FrontPageHandler._activeCategory) {
            return;
        }
        if (!FrontPageHandler.updateQualifiedCategories()) {
            return;
        }
        FrontPageHandler.activeCategory = category;
    }

    protected static nextCategory(e: FrontPageEvent): void {
        if (!FrontPageHandler.updateQualifiedCategories() || !FrontPageHandler._qualifiedCategories) {
            return;
        }
        const currentIndex = FrontPageHandler._qualifiedCategories.indexOf(FrontPageHandler._activeCategory!);
        FrontPageHandler.activeCategory = FrontPageHandler._qualifiedCategories[FrontPageHandler.verifyIndex(currentIndex + 1)];
    }

    protected static previousCategory(e: FrontPageEvent): void {
        if (!FrontPageHandler.updateQualifiedCategories() || !FrontPageHandler._qualifiedCategories) {
            return;
        }
        const currentIndex = FrontPageHandler._qualifiedCategories.indexOf(FrontPageHandler._activeCategory!);
        FrontPageHandler.activeCategory = FrontPageHandler._qualifiedCategories[FrontPageHandler.verifyIndex(currentIndex - 1)];
    }

    private static verifyIndex(index: number): number {
        if (!FrontPageHandler._qualifiedCategories) return 0;
        
        if (index > FrontPageHandler._qualifiedCategories.length - 1) {
            index = 0;
        } else if (index < 0) {
            index = FrontPageHandler._qualifiedCategories.length - 1;
        }
        return index;
    }

    public static setup(data: any): void {
        FrontPageHandler._hasBeenSetupThisSession = true;
        for (const categoryName in data) {
            const category = FrontPageLibrary.getCategoryByName(categoryName);
            if (category) {
                category.setup(data[categoryName]);
            }
        }
    }

    public static export(): any {
        let result: any = null;
        
        for (let i = 0; i < FrontPageLibrary.CATEGORIES.length; i++) {
            const category = FrontPageLibrary.CATEGORIES[i];
            const categoryData = category.export();
            if (categoryData) {
                if (!result) {
                    result = {};
                }
                result[category.name] = categoryData;
            }
        }
        return result;
    }

    public static closeAll(): void {
        if (POPUPS._open) {
            POPUPS.Next();
        }
        if (BUILDINGS._open) {
            BUILDINGS.Hide();
        }
        if (BUILDINGOPTIONS._open) {
            BUILDINGOPTIONS.Hide();
        }
    }
}
