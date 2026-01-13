import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="BasePlannerPopup_ExplorerHeader")]

/**
 * BasePlannerPopup_ExplorerHeader - Explorer header for base planner
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "BasePlannerPopup_ExplorerHeader" })
export class BasePlannerPopup_ExplorerHeader extends MovieClip {
    public tLabel: TextField;

    constructor() {
        super();
        this.tLabel = new TextField();
    }
}
