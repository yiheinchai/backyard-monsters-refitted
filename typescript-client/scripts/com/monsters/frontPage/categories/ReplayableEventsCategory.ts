import { Category } from "./Category";
import { Message } from "../messages/Message";

/**
 * ReplayableEventsCategory - front page category for replayable events.
 */
export class ReplayableEventsCategory extends Category {
    private m_importedData: any;

    constructor() {
        this.m_importedData = {};
        super();
        this.priority = 6;
        this.name = "Replayable Events";
        this._doesViewRepeatedly = false;
    }

    public override export(): any {
        let hasData = true;
        const result = this.m_importedData;
        result.name = this.name;
        
        if (this.lastMessageSeen) {
            result.lastMessage = this.lastMessageSeen.name;
            hasData = true;
        }
        
        for (let i = 0; i < this._messages.length; i++) {
            const message = this._messages[i];
            const messageData = message.export();
            if (messageData) {
                result[message.name] = messageData;
                hasData = true;
            }
        }
        
        if (!hasData) {
            return null;
        }
        return result;
    }

    public override setup(data: any): void {
        this.m_importedData = data;
        super.setup(data);
    }
}
