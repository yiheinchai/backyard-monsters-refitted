import MovieClip from 'openfl/display/MovieClip';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="CATAPULTITEM_view")]

/**
 * CATAPULTITEM_view - View component for catapult item
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "CATAPULTITEM_view" })
export class CATAPULTITEM_view extends MovieClip {
    public _txtMC: MovieClip;

    constructor() {
        super();
        this._txtMC = new MovieClip();
    }
}
