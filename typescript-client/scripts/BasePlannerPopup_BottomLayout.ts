import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="BasePlannerPopup_BottomLayout")]

/**
 * BasePlannerPopup_BottomLayout - Bottom layout for base planner popup
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "BasePlannerPopup_BottomLayout" })
export class BasePlannerPopup_BottomLayout extends MovieClip {
    public btnClear: MovieClip;
    public btnLoad: MovieClip;
    public check2_txt: TextField;
    public check3_txt: TextField;
    public check1: MovieClip;
    public check1_txt: TextField;
    public check2: MovieClip;
    public check3: MovieClip;
    public btnApply: MovieClip;
    public check4: MovieClip;
    public check4_txt: TextField;
    public btnSave: MovieClip;

    constructor() {
        super();
        this.btnClear = new MovieClip();
        this.btnLoad = new MovieClip();
        this.check2_txt = new TextField();
        this.check3_txt = new TextField();
        this.check1 = new MovieClip();
        this.check1_txt = new TextField();
        this.check2 = new MovieClip();
        this.check3 = new MovieClip();
        this.btnApply = new MovieClip();
        this.check4 = new MovieClip();
        this.check4_txt = new TextField();
        this.btnSave = new MovieClip();
    }
}
