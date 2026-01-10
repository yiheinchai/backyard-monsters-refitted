import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="bubble_acceptInvite")]

@Embed({ source: "/_assets/assets.swf", symbol: "bubble_acceptInvite" })
export class bubble_acceptInvite extends MovieClip {
    public bNo: Button_CLIP;
    public tDesc: TextField;
    public bYes: Button_CLIP;

    constructor() {
        super();
    }
}
