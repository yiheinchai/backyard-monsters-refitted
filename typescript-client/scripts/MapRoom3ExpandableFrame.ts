import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';

// [Embed(source="/_assets/assets.swf", symbol="MapRoom3ExpandableFrame")]
export class MapRoom3ExpandableFrame extends MovieClip {
    public background: MovieClip;
    public contentsContainer: MovieClip;
    public frameFooter: MovieClip;
    public collapseExpandButton: MovieClip;
    public frameBorders: MovieClip;
    public headerText: TextField;
    public frameHeader: MovieClip;

    constructor() {
        super();
    }
}
