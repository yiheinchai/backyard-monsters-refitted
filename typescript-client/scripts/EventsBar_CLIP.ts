import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { creatureBar } from './creatureBar';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="EventsBar_CLIP")]
@Embed({ source: "/_assets/assets.swf", symbol: "EventsBar_CLIP" })
export class EventsBar_CLIP extends MovieClip {
    public mcHit: MovieClip;
    public mcBG: MovieClip;
    public tLabel: TextField;
    public barProgressTxt: TextField;
    public tTitle: TextField;
    public barProgress: creatureBar;
    public bHelp: MovieClip;
    public mcImage: MovieClip;
    public bActionTxt: TextField;
    public bAction: MovieClip;
    public mcLogo: MovieClip;

    constructor() {
        super();
    }
}
