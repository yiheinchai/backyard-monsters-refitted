import MovieClip from 'openfl/display/MovieClip';
import { Embed } from "./core/Embed";

/**
 * MapRoomCell_CLIP - Map room cell CLIP
 * Converted from ActionScript to TypeScript
 * 
 * Original: [Embed(source="/_assets/assets.swf", symbol="MapRoomCell_CLIP")]
 */
@Embed({ source: "/_assets/assets.swf", symbol: "MapRoomCell_CLIP" })
export class MapRoomCell_CLIP extends MovieClip {
    public mc: any; // Dynamic MovieClip with mcHit, mcPlayer, mcGlow, mcEdges, mcPrompt, mcWater

    constructor() {
        super();
        this.mc = new MovieClip();
    }
}
