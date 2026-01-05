import MovieClip from 'openfl/display/MovieClip';
import Sprite from 'openfl/display/Sprite';
import { popup_catapult_mc } from './popup_catapult_mc';

/**
 * CATAPULTPOPUP_view - Base UI clip class for Catapult Popup
 * Contains all UI element declarations for the catapult selection popup
 * Converted from ActionScript to TypeScript
 */
export class CATAPULTPOPUP_view extends Sprite {
    public _imageContainer!: MovieClip;
    public _mc!: popup_catapult_mc;

    constructor() {
        super();
    }
}
