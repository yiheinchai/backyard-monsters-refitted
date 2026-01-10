import MovieClip from 'openfl/display/MovieClip';
import { Embed } from "./core/Embed";

/**
 * creatureBar - Creature stat bar UI element
 * Converted from ActionScript to TypeScript
 * 
 * Original: [Embed(source="/_assets/assets.swf", symbol="creatureBar")]
 */
@Embed({ source: "/_assets/assets.swf", symbol: "creatureBar" })
export class creatureBar extends MovieClip {
    public mcBar: MovieClip;

    constructor() {
        super();
        this.mcBar = new MovieClip();
    }
}
