import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="buttonReinforcement_CLIP")]

/**
 * buttonReinforcement_CLIP - CLIP class for reinforcement button
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "buttonReinforcement_CLIP" })
export class buttonReinforcement_CLIP extends MovieClip {
    public tCountdown: TextField;

    constructor() {
        super();
        this.tCountdown = new TextField();
    }
}
