import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';

/**
 * icon_worker - Icon component for worker display
 * Converted from ActionScript to TypeScript
 */
export class icon_worker extends MovieClip {
    public label_txt: TextField;
    public mcIcon: MovieClip;

    constructor() {
        super();
        this.label_txt = new TextField();
        this.mcIcon = new MovieClip();
    }
}
