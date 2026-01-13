import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { BUILDINGSARROW } from './BUILDINGSARROW';
import { frame_CLIP } from './frame_CLIP';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="Inbox_CLIP")]
@Embed({ source: "/_assets/assets.swf", symbol: "Inbox_CLIP" })
export class Inbox_CLIP extends MovieClip {
    public outBtn: Button_CLIP;
    public bNext: BUILDINGSARROW;
    public subjectBtn: MovieClip;
    public noMessages_btn: MovieClip;
    public bPrevious: BUILDINGSARROW;
    public title_txt: TextField;
    public dateBtn: MovieClip;
    public fromBtn: MovieClip;
    public mask_mc: MovieClip;
    public unreadBtn: MovieClip;
    public mcFrame: frame_CLIP;
    public newBtn: Button_CLIP;
    public inBtn: Button_CLIP;

    constructor() {
        super();
    }
}
