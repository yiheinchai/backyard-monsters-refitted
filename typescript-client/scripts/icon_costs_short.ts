import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
//    [Embed(source="/_assets/assets.swf", symbol="icon_costs_short")]

/**
 * icon_costs_short - Short icon component for displaying costs
 * Converted from ActionScript to TypeScript
 */
export class icon_costs_short extends MovieClip {
    public tTitle: TextField;
    public tValue: TextField;

    constructor() {
        super();
        this.tTitle = new TextField();
        this.tValue = new TextField();
    }
}
