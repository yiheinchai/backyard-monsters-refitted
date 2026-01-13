import { Category } from "./Category";

/**
 * Long term category - front page category for long-term projects.
 */
export class LongTerm extends Category {
    constructor() {
        super();
        this.priority = 5;
        this.name = "Long-Term Projects";
    }
}
