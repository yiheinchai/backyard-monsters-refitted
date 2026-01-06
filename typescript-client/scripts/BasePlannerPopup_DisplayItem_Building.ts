import MovieClip from 'openfl/display/MovieClip';

/**
 * BasePlannerPopup_DisplayItem_Building - Display item for building in base planner
 * Converted from ActionScript to TypeScript
 */
export class BasePlannerPopup_DisplayItem_Building extends MovieClip {
    public mcBG: MovieClip;
    public mcMask: MovieClip;
    public mcInvalid: MovieClip;
    public mcRange: MovieClip;
    public mcFort: MovieClip;
    public mcFrame: MovieClip;
    public mcIcon: MovieClip;
    public mcLevel: MovieClip;

    constructor() {
        super();
        this.mcBG = new MovieClip();
        this.mcMask = new MovieClip();
        this.mcInvalid = new MovieClip();
        this.mcRange = new MovieClip();
        this.mcFort = new MovieClip();
        this.mcFrame = new MovieClip();
        this.mcIcon = new MovieClip();
        this.mcLevel = new MovieClip();
    }
}
