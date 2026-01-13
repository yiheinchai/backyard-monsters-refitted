import { Category } from "./Category";

/**
 * UnderusedFeatures category - front page category for underused feature reminders.
 */
export class UnderusedFeatures extends Category {
    constructor() {
        super();
        this.priority = 4;
        this.name = "Underused Feature Reminders";
    }
}
