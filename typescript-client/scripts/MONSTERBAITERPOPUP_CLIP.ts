import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { Embed } from "./core/Embed";

/**
 * MONSTERBAITERPOPUP_CLIP - Monster baiter popup CLIP
 * Converted from ActionScript to TypeScript
 * 
 * Original: [Embed(source="/_assets/assets.swf", symbol="MONSTERBAITERPOPUP_CLIP")]
 */
@Embed({ source: "/_assets/assets.swf", symbol: "MONSTERBAITERPOPUP_CLIP" })
export class MONSTERBAITERPOPUP_CLIP extends MovieClip {
    public m8: MovieClip;
    public b_mc: MovieClip;
    public m9: MovieClip;
    public r_mc: MovieClip;
    public sendBtn: Button_CLIP;
    public tl_mc: MovieClip;
    public title_txt: TextField;
    public bContinue: Button_CLIP;
    public m10: MovieClip;
    public txtGuide: TextField;
    public m11: MovieClip;
    public t_mc: MovieClip;
    public tr_mc: MovieClip;
    public bl_mc: MovieClip;
    public m12: MovieClip;
    public m13: MovieClip;
    public m14: MovieClip;
    public m1: MovieClip;
    public br_mc: MovieClip;
    public m2: MovieClip;
    public m3: MovieClip;
    public m4: MovieClip;
    public clearBtn: Button_CLIP;
    public tSize: TextField;
    public m5: MovieClip;
    public m6: MovieClip;
    public l_mc: MovieClip;
    public tUpgrade: TextField;
    public mcStorage: MovieClip;
    public m7: MovieClip;

    constructor() {
        super();
        this.m8 = new MovieClip();
        this.b_mc = new MovieClip();
        this.m9 = new MovieClip();
        this.r_mc = new MovieClip();
        this.sendBtn = new Button_CLIP();
        this.tl_mc = new MovieClip();
        this.title_txt = new TextField();
        this.bContinue = new Button_CLIP();
        this.m10 = new MovieClip();
        this.txtGuide = new TextField();
        this.m11 = new MovieClip();
        this.t_mc = new MovieClip();
        this.tr_mc = new MovieClip();
        this.bl_mc = new MovieClip();
        this.m12 = new MovieClip();
        this.m13 = new MovieClip();
        this.m14 = new MovieClip();
        this.m1 = new MovieClip();
        this.br_mc = new MovieClip();
        this.m2 = new MovieClip();
        this.m3 = new MovieClip();
        this.m4 = new MovieClip();
        this.clearBtn = new Button_CLIP();
        this.tSize = new TextField();
        this.m5 = new MovieClip();
        this.m6 = new MovieClip();
        this.l_mc = new MovieClip();
        this.tUpgrade = new TextField();
        this.mcStorage = new MovieClip();
        this.m7 = new MovieClip();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    private frame1(): void {
        this.stop();
    }
}
