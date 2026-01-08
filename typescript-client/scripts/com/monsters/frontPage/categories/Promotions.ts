import { Category } from "./Category";

/**
 * Promotions category - front page category for promotional content.
 */
export class Promotions extends Category {
    constructor() {
        super();
        this.name = "Promotions";
        this.priority = 1;
        this._doesViewRepeatedly = false;
    }
}
