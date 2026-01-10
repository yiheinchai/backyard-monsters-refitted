import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="PopupMonstersB_CLIP")]

/**
 * PopupMonstersB_CLIP - CLIP class for monsters popup variant B
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "PopupMonstersB_CLIP" })
export class PopupMonstersB_CLIP extends MovieClip {
    public mMonstersMask: MovieClip;
    public mMonsters: MovieClip;
    public bCancel: Button_CLIP;
    public tDesc: TextField;
    public scroll: MovieClip;
    public bTransfer: Button_CLIP;

    constructor() {
        super();
        this.mMonstersMask = new MovieClip();
        this.mMonsters = new MovieClip();
        this.bCancel = new Button_CLIP();
        this.tDesc = new TextField();
        this.scroll = new MovieClip();
        this.bTransfer = new Button_CLIP();
    }
}
