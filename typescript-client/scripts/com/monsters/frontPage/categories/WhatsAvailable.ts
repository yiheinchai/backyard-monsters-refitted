import { Category } from "./Category";

/**
 * WhatsAvailable category - front page category for available features.
 */
export class WhatsAvailable extends Category {
    private static readonly _TIME_UNTIL_RESET: number = 86400;

    constructor() {
        super();
        this.priority = 3;
        this.name = "What's Available";
        this._doesViewRepeatedly = false;
    }

    public override setup(data: any): void {
        super.setup(data);
        this.markOldMessagesAsUnseen();
    }

    private markOldMessagesAsUnseen(): void {
        for (let i = 0; i < this._messages.length; i++) {
            this._messages[i].markAsUnseenIfOlderThan(WhatsAvailable._TIME_UNTIL_RESET);
        }
    }
}
