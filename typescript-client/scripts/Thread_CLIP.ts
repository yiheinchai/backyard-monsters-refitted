import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { frame_CLIP } from './frame_CLIP';
//    [Embed(source="/_assets/assets.swf", symbol="Thread_CLIP")]

/**
 * Thread_CLIP - CLIP class for thread/message display
 * Converted from ActionScript to TypeScript
 */
export class Thread_CLIP extends MovieClip {
    public outline_mc: MovieClip;
    public msg_txt: TextField;
    public subject_txt: TextField;
    public sendBtn: Button_CLIP;
    public denyBtn: Button_CLIP;
    public spinner: MovieClip;
    public mask_mc: MovieClip;
    public fsWarning: MovieClip;
    public largeOutline_mc: MovieClip;
    public reportBtn: MovieClip;
    public viewBtn: Button_CLIP;
    public mcFrame: frame_CLIP;
    public acceptBtn: Button_CLIP;
    public box: MovieClip;
    public inputBox: MovieClip;

    constructor() {
        super();
        this.outline_mc = new MovieClip();
        this.msg_txt = new TextField();
        this.subject_txt = new TextField();
        this.sendBtn = new Button_CLIP();
        this.denyBtn = new Button_CLIP();
        this.spinner = new MovieClip();
        this.mask_mc = new MovieClip();
        this.fsWarning = new MovieClip();
        this.largeOutline_mc = new MovieClip();
        this.reportBtn = new MovieClip();
        this.viewBtn = new Button_CLIP();
        this.mcFrame = new frame_CLIP();
        this.acceptBtn = new Button_CLIP();
        this.box = new MovieClip();
        this.inputBox = new MovieClip();
    }
}
