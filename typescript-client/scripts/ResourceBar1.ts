import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { points_txt } from './points_txt';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="ResourceBar1")]
@Embed({ source: "/_assets/assets.swf", symbol: "ResourceBar1" })
export class ResourceBar1 extends MovieClip {
    public mcHit: MovieClip;
    public tR: TextField;
    public bAdd: MovieClip;
    public mcPoints: points_txt;
    public mcBar: MovieClip;

    constructor() {
        super();
    }
}
