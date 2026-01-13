import { Category } from "./Category";

/**
 * News category - front page category for news items.
 */
export class News extends Category {
    constructor() {
        super();
        this.priority = 2;
        this.name = "News";
        this._doesViewRepeatedly = false;
    }
}
