import { Category } from "./Category";

/**
 * ProTips category - front page category for pro tips.
 */
export class ProTips extends Category {
    constructor() {
        super();
        this.priority = 6;
        this.name = "Pro-Tips";
    }
}
