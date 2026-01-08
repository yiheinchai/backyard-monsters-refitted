import { KeywordMessage } from "../../KeywordMessage";

/**
 * Monster Blitzkrieg end message.
 */
export class MonsterBlitzkriegEndMessage extends KeywordMessage {
    constructor() {
        super("event2end");
        this.imageURL = MonsterBlitzkriegEndMessage._IMAGE_DIRECTORY + "fp_event2start.v2.jpg";
    }

    protected static readonly _IMAGE_DIRECTORY: string = "";
}
