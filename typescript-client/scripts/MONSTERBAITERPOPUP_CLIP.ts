import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';

/**
 * MONSTERBAITERPOPUP_CLIP - Base UI clip class for Monster Baiter Popup
 * Contains all UI element declarations for monster baiter popup
 * Converted from ActionScript to TypeScript
 */
export class MONSTERBAITERPOPUP_CLIP extends MovieClip {
    public m8!: MovieClip;
    public b_mc!: MovieClip;
    public m9!: MovieClip;
    public r_mc!: MovieClip;
    public sendBtn!: Button_CLIP;
    public tl_mc!: MovieClip;
    public title_txt!: TextField;
    public bContinue!: Button_CLIP;
    public m10!: MovieClip;
    public txtGuide!: TextField;
    public m11!: MovieClip;
    public t_mc!: MovieClip;
    public tr_mc!: MovieClip;
    public bl_mc!: MovieClip;
    public m12!: MovieClip;
    public m13!: MovieClip;
    public m14!: MovieClip;
    public m1!: MovieClip;
    public br_mc!: MovieClip;
    public m2!: MovieClip;
    public m3!: MovieClip;
    public m4!: MovieClip;
    public clearBtn!: Button_CLIP;
    public tSize!: TextField;
    public m5!: MovieClip;
    public m6!: MovieClip;
    public l_mc!: MovieClip;
    public tUpgrade!: TextField;
    public mcStorage!: MovieClip;
    public m7!: MovieClip;

    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    protected frame1(): void {
        this.stop();
    }
}
