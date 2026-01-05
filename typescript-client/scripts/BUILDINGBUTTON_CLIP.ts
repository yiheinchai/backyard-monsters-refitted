import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';

/**
 * BUILDINGBUTTON_CLIP - Base UI clip class for Building Button
 * Contains all UI element declarations for building selection buttons in the store
 * Converted from ActionScript to TypeScript
 */
export class BUILDINGBUTTON_CLIP extends MovieClip {
    public tName!: TextField;
    public mcBG!: MovieClip;
    public mcShroud!: MovieClip;
    public mcNew!: MovieClip;
    public mcSale!: MovieClip;
    public tQuantity!: TextField;
    public mcCheck!: MovieClip;

    constructor() {
        super();
    }
}
