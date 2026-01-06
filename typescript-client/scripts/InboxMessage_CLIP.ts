import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';

// [Embed(source="/_assets/assets.swf", symbol="InboxMessage_CLIP")]
export class InboxMessage_CLIP extends MovieClip {
    public subject_txt: TextField;
    public subjectType_txt: TextField;
    public placeholder: MovieClip;
    public b1: Button_CLIP;
    public userid_txt: TextField;
    public replies_txt: TextField;
    public sent_txt: TextField;
    public sender_txt: TextField;
    public dot_mc: MovieClip;
    public bg_mc: MovieClip;

    constructor() {
        super();
    }
}
