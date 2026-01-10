import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="BUILDINGBUTTONSOON")]

/**
 * BUILDINGBUTTONSOON - Coming Soon Building Button
 * Placeholder for buildings that are not yet available
 */
@Embed({ source: "/_assets/assets.swf", symbol: "BUILDINGBUTTONSOON" })
export class BUILDINGBUTTONSOON extends MovieClip {
    public t: TextField | null = null;

    constructor() {
        super();
    }
}
