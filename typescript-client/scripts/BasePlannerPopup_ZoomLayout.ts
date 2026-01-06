import MovieClip from 'openfl/display/MovieClip';

/**
 * BasePlannerPopup_ZoomLayout - Zoom layout for base planner popup
 * Converted from ActionScript to TypeScript
 */
export class BasePlannerPopup_ZoomLayout extends MovieClip {
    public scrollbar: MovieClip;
    public mcBG: MovieClip;
    public btnUp: MovieClip;
    public btnDown: MovieClip;

    constructor() {
        super();
        this.scrollbar = new MovieClip();
        this.mcBG = new MovieClip();
        this.btnUp = new MovieClip();
        this.btnDown = new MovieClip();
    }
}
