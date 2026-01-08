import { Message } from "../messages/Message";

/**
 * Category - base class for front page categories.
 */
export class Category {
    public priority: number = 0;
    public name: string = "";
    public lastMessageSeen: Message | null = null;
    protected _messages: Array<Message> = [];
    protected _doesViewRepeatedly: boolean = true;

    constructor() {
        this._messages = [];
    }

    public getNextQualifiedMessage(): Message | null {
        let startIndex = 0;
        
        if (this.lastMessageSeen) {
            const lastIndex = this._messages.indexOf(this.lastMessageSeen);
            if (lastIndex >= 0) {
                startIndex = lastIndex + 1;
                if (startIndex >= this._messages.length) {
                    startIndex = 0;
                }
            }
        }
        
        let hasLooped = false;
        let i = startIndex;
        
        while (i < this._messages.length) {
            const message = this._messages[i];
            if ((!message.hasBeenSeen || this._doesViewRepeatedly) && message.areRequirementsMet) {
                return message;
            }
            
            if (i === this._messages.length - 1) {
                i = -1;
                hasLooped = true;
            }
            
            if (hasLooped && i === startIndex - 1) {
                break;
            }
            i++;
        }
        
        return null;
    }

    public addMessage(message: Message): void {
        this._messages.push(message);
        message.category = this;
    }

    public setup(data: any): void {
        this.lastMessageSeen = this.getMessageByName(data.lastMessage);
        
        for (const key in data) {
            const message = this.getMessageByName(key);
            if (message) {
                message.setup(data[key]);
            }
        }
    }

    public export(): any {
        let hasData = false;
        const result: any = {};
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

    public getMessageByName(name: string): Message | null {
        for (let i = 0; i < this._messages.length; i++) {
            const message = this._messages[i];
            if (message.name === name) {
                return message;
            }
        }
        return null;
    }
}
