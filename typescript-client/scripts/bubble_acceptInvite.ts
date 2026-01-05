import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';

export class bubble_acceptInvite extends MovieClip {
    public bNo!: Button_CLIP;
    public tDesc!: TextField;
    public bYes!: Button_CLIP;

    constructor() {
        super();
    }
}
