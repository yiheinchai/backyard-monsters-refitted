import MovieClip from 'openfl/display/MovieClip';
import Sprite from 'openfl/display/Sprite';
import { popup_catapult_mc } from './popup_catapult_mc';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="CATAPULTPOPUP_view")]

/**
 * CATAPULTPOPUP_view - View component for catapult popup
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "CATAPULTPOPUP_view" })
export class CATAPULTPOPUP_view extends Sprite {
    public _imageContainer: MovieClip;
    public _mc: popup_catapult_mc;

    constructor() {
        super();
        this._imageContainer = new MovieClip();
        this._mc = new popup_catapult_mc();
    }
}
