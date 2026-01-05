import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { frame_CLIP } from './frame_CLIP';

/**
 * Message_CLIPB - CLIP class for message popup variant B
 * Converted from ActionScript to TypeScript
 */
export class Message_CLIPB extends MovieClip {
    public charsLeft_txt: TextField;
    public subject_txt: TextField;
    public sendBtn: Button_CLIP;
    public tolabel_txt: TextField;
    public messagelabel_txt: TextField;
    public fsWarning: MovieClip;
    public status_txt: TextField;
    public body_txt: TextField;
    public mcFrame: frame_CLIP;
    public subjectlabel_txt: TextField;

    constructor() {
        super();
        this.charsLeft_txt = new TextField();
        this.subject_txt = new TextField();
        this.sendBtn = new Button_CLIP();
        this.tolabel_txt = new TextField();
        this.messagelabel_txt = new TextField();
        this.fsWarning = new MovieClip();
        this.status_txt = new TextField();
        this.body_txt = new TextField();
        this.mcFrame = new frame_CLIP();
        this.subjectlabel_txt = new TextField();
    }
}
