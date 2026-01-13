import MovieClip from 'openfl/display/MovieClip';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="ChatBox_CLIP")]

/**
 * ChatBox_CLIP - CLIP class for chat box
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "ChatBox_CLIP" })
export class ChatBox_CLIP extends MovieClip {
    public input: any; // Dynamic MovieClip with _input, inputWoodBg, inputTxtBG
    public frame: any; // Dynamic MovieClip with arrowUp, arrowDown, mcToggle, mcMask, mcScreen, alert, header, border, tTitle, _output

    constructor() {
        super();
        this.input = new MovieClip();
        this.frame = new MovieClip();
    }
}
