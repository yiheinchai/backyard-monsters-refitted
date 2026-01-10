import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="WMListViewItemInferno_CLIP")]

/**
 * WMListViewItemInferno_CLIP - CLIP class for inferno wild monster list item
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "WMListViewItemInferno_CLIP" })
export class WMListViewItemInferno_CLIP extends MovieClip {
    public name_txt: TextField;
    public placeholder: MovieClip;
    public attackBtn: Button_CLIP;
    public level_txt: TextField;
    public status_txt: TextField;
    public dot: MovieClip;
    public attacks_txt: TextField;
    public helpBtn: Button_CLIP;
    public extraStatus_txt: TextField;

    constructor() {
        super();
        this.name_txt = new TextField();
        this.placeholder = new MovieClip();
        this.attackBtn = new Button_CLIP();
        this.level_txt = new TextField();
        this.status_txt = new TextField();
        this.dot = new MovieClip();
        this.attacks_txt = new TextField();
        this.helpBtn = new Button_CLIP();
        this.extraStatus_txt = new TextField();
    }
}
