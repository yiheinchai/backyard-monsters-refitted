import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';

/**
 * icon_costs - Icon component for displaying costs
 * Converted from ActionScript to TypeScript
 */
export class icon_costs extends MovieClip {
    public tTitle: TextField;
    public tValue: TextField;

    constructor() {
        super();
        this.tTitle = new TextField();
        this.tValue = new TextField();
    }
}
