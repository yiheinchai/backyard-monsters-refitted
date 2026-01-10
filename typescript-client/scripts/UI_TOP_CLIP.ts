import MovieClip from 'openfl/display/MovieClip';
import { buttonDefenseEvent_CLIP } from './buttonDefenseEvent_CLIP';
import { buttonFullscreen_CLIP } from './buttonFullscreen_CLIP';
import { buttonMusic_CLIP } from './buttonMusic_CLIP';
import { buttonReinforcement_CLIP } from './buttonReinforcement_CLIP';
import { buttonSaving_CLIP } from './buttonSaving_CLIP';
import { buttonSound_CLIP } from './buttonSound_CLIP';
import { buttonZoom_CLIP } from './buttonZoom_CLIP';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="UI_TOP_CLIP")]

/**
 * UI_TOP_CLIP - CLIP class for top UI bar
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "UI_TOP_CLIP" })
export class UI_TOP_CLIP extends MovieClip {
    public mcZoom: buttonZoom_CLIP;
    public mcProtected: MovieClip;
    public mcFullscreen: buttonFullscreen_CLIP;
    public mcSave: buttonSaving_CLIP;
    public mcBuffHolder: MovieClip;
    public mcSpecialEvent: buttonDefenseEvent_CLIP;
    public mcSound: buttonSound_CLIP;
    public mc: MovieClip;
    public mcMusic: buttonMusic_CLIP;
    public mcReinforcements: buttonReinforcement_CLIP;

    constructor() {
        super();
        this.mcZoom = new buttonZoom_CLIP();
        this.mcProtected = new MovieClip();
        this.mcFullscreen = new buttonFullscreen_CLIP();
        this.mcSave = new buttonSaving_CLIP();
        this.mcBuffHolder = new MovieClip();
        this.mcSpecialEvent = new buttonDefenseEvent_CLIP();
        this.mcSound = new buttonSound_CLIP();
        this.mc = new MovieClip();
        this.mcMusic = new buttonMusic_CLIP();
        this.mcReinforcements = new buttonReinforcement_CLIP();
    }
}
