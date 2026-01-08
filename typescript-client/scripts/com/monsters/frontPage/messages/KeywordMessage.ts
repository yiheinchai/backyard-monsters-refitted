import { Message } from "./Message";

/**
 * Keyword message - message that uses keywords for localization.
 */
export class KeywordMessage extends Message {
    public static readonly PREFIX: string = "fp_";

    protected _keyword: string;

    constructor(keyword: string, buttonCopy: string | null = null, imageURL: string | null = null) {
        this._keyword = keyword;
        const finalImageURL = imageURL ? imageURL : KeywordMessage.PREFIX + keyword + ".jpg";
        super(
            KeywordMessage.PREFIX + keyword + "_title",
            KeywordMessage.PREFIX + keyword,
            finalImageURL,
            buttonCopy,
            undefined
        );
        this.name = this._keyword;
    }

    public static getImageURLFromKeyword(keyword: string): string {
        return Message._IMAGE_DIRECTORY + KeywordMessage.PREFIX + keyword + ".jpg";
    }
}
