import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';

// [Embed(source="/_assets/assets.swf", symbol="EventStoreDisplayItem")]
export class EventStoreDisplayItem extends MovieClip {
    public xpText: TextField;
    public xpBarYellow: MovieClip;
    public imageHolder: MovieClip;
    public frame: MovieClip;
    public nameText: TextField;
    public xpBarBlue: MovieClip;
    public xpBarBg: MovieClip;
    public tickIcon: MovieClip;
    public lockIcon: MovieClip;
    public xpBarGreen: MovieClip;

    constructor() {
        super();
    }
}
