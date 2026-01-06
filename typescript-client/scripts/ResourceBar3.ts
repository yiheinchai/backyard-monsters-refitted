import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { points_txt } from './points_txt';

// [Embed(source="/_assets/assets.swf", symbol="ResourceBar3")]
export class ResourceBar3 extends MovieClip {
    public mcHit: MovieClip;
    public tR: TextField;
    public bAdd: MovieClip;
    public mcPoints: points_txt;
    public mcBar: MovieClip;

    constructor() {
        super();
    }
}
