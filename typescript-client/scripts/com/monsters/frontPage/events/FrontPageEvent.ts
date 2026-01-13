import Event from "openfl/events/Event";

import { Category } from "../categories/Category";

/**
 * Front page event - events for front page navigation.
 */
export class FrontPageEvent extends Event {
    public static readonly NEXT: string = "next";
    public static readonly PREVIOUS: string = "previous";
    public static readonly CHANGE_CATEGORY: string = "changeCategory";

    private _category: Category | null;

    constructor(type: string, category: Category | null = null, bubbles: boolean = false, cancelable: boolean = false) {
        super(type, bubbles, cancelable);
        this._category = category;
    }

    public get category(): Category | null {
        return this._category;
    }
}
