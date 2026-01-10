import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="bubble_selecttarget")]

@Embed({ source: "/_assets/assets.swf", symbol: "bubble_selecttarget" })
export class bubble_selecttarget extends MovieClip {
    public bCancel: Button_CLIP;
    public tDesc: TextField;

    constructor() {
        super();
    }
}
